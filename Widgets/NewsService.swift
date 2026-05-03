import Foundation
import AppKit

enum NewsService {

    // MARK: - Sources

    private struct Feed {
        let url: String
        let source: String
    }

    /// Build feed list from the user's saved selection in the shared store.
    /// Falls back to a sensible default if the user disabled everything.
    private static func feeds(for kind: FeedSource.Kind) -> [Feed] {
        let chosen: [FeedSource] = kind == .ai
            ? SourcesStore.shared.aiSourceList()
            : SourcesStore.shared.newsSourceList()

        let fallback: [FeedSource] = kind == .ai
            ? FeedCatalog.aiFeeds
            : FeedCatalog.generalFeeds.filter { $0.id == "fox_world" }

        let active = chosen.isEmpty ? fallback : chosen
        return active.map { src in
            Feed(url: src.url, source: src.displayName.uppercased())
        }
    }

    private static let stopWords: Set<String> = [
        "the","and","for","with","that","this","have","from","what","when",
        "where","will","your","about","into","says","said","their","there",
        "them","they","than","then","some","more","most","over","after",
        "before","been","being","which","while","also","just","only","very",
        "much","many","such","these","those","here","were","would","could",
        "should","might","still","again","through","between","because",
        "using","used","onto","upon","amid"
    ]

    // MARK: - rss2json response

    private struct RSSResp: Decodable {
        struct Enclosure: Decodable {
            let link: String?
        }
        struct Item: Decodable {
            let title: String
            let link: String
            let pubDate: String
            let thumbnail: String?
            let enclosure: Enclosure?
            let content: String?
        }
        let items: [Item]?
    }

    private static let imgRegex = try? NSRegularExpression(
        pattern: #"<img[^>]+src=["']([^"']+)["']"#,
        options: .caseInsensitive
    )

    private static func extractImage(from item: RSSResp.Item) -> URL? {
        // 1. Direct enclosure (Fox News provides this)
        if let s = item.enclosure?.link, !s.isEmpty,
           let url = URL(string: s.replacingOccurrences(of: "&amp;", with: "&")) {
            return url
        }
        // 2. Thumbnail field
        if let s = item.thumbnail, !s.isEmpty, let url = URL(string: s) {
            return url
        }
        // 3. First <img> in content HTML (TechCrunch/Verge embed images here)
        if let html = item.content, let regex = imgRegex {
            let range = NSRange(html.startIndex..., in: html)
            if let match = regex.firstMatch(in: html, range: range),
               match.numberOfRanges > 1,
               let r = Range(match.range(at: 1), in: html) {
                let src = String(html[r]).replacingOccurrences(of: "&amp;", with: "&")
                return URL(string: src)
            }
        }
        return nil
    }

    private static let dateFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd HH:mm:ss"
        f.timeZone = TimeZone(identifier: "UTC")
        f.locale = Locale(identifier: "en_US_POSIX")
        return f
    }()

    private static func fetchFeed(_ feed: Feed) async -> [NewsStory] {
        guard let encoded = feed.url.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "https://api.rss2json.com/v1/api.json?rss_url=\(encoded)")
        else { return [] }

        do {
            var req = URLRequest(url: url)
            req.timeoutInterval = 10
            let (data, _) = try await URLSession.shared.data(for: req)
            let resp = try JSONDecoder().decode(RSSResp.self, from: data)
            return (resp.items ?? []).map { item in
                NewsStory(
                    id: "\(feed.source)-\(item.link.hashValue)",
                    title: cleanTitle(item.title),
                    url: URL(string: item.link),
                    source: feed.source,
                    timestamp: dateFormatter.date(from: item.pubDate) ?? Date(),
                    imageURL: extractImage(from: item)
                )
            }
        } catch {
            return []
        }
    }

    private static func aggregate(_ feeds: [Feed], limit: Int) async -> [NewsStory] {
        let results = await withTaskGroup(of: [NewsStory].self) { group -> [[NewsStory]] in
            for feed in feeds {
                group.addTask { await fetchFeed(feed) }
            }
            var out: [[NewsStory]] = []
            for await stories in group { out.append(stories) }
            return out
        }

        var seen = Set<String>()
        var merged: [NewsStory] = []
        for story in results.flatMap({ $0 })
            .sorted(by: { $0.timestamp > $1.timestamp }) {
            let key = String(story.title.lowercased().prefix(40))
            if seen.contains(key) { continue }
            seen.insert(key)
            merged.append(story)
            if merged.count >= limit { break }
        }
        return merged
    }

    static func fetchAIStories(limit: Int) async throws -> [NewsStory] {
        var stories = await aggregate(feeds(for: .ai), limit: limit)
        stories = await prefetchHeroImage(stories: stories)
        return stories
    }

    static func fetchTopHeadlines(limit: Int) async throws -> [NewsStory] {
        var stories = await aggregate(feeds(for: .general), limit: limit)
        stories = await prefetchHeroImage(stories: stories)
        return stories
    }

    /// Download the hero story's image so WidgetKit can render it
    /// synchronously. Limits payload to ~150KB by re-encoding via NSImage.
    /// If the feed didn't provide an image, scrapes og:image from the article.
    private static func prefetchHeroImage(stories: [NewsStory]) async -> [NewsStory] {
        guard let hero = stories.first else { return stories }

        // Resolve image URL — feed-provided first, og:image fallback
        let resolvedURL: URL?
        if let direct = hero.imageURL {
            resolvedURL = direct
        } else if let articleURL = hero.url {
            resolvedURL = await fetchOGImage(from: articleURL)
        } else {
            resolvedURL = nil
        }
        guard let imageURL = resolvedURL else { return stories }

        do {
            var req = URLRequest(url: imageURL)
            req.timeoutInterval = 8
            let (data, _) = try await URLSession.shared.data(for: req)
            let final: Data
            if data.count > 600_000, let downsampled = downsample(data: data, maxWidth: 800) {
                final = downsampled
            } else {
                final = data
            }
            var updated = stories
            let h = hero
            updated[0] = NewsStory(
                id: h.id, title: h.title, url: h.url,
                source: h.source, timestamp: h.timestamp,
                imageURL: imageURL, imageData: final
            )
            return updated
        } catch {
            return stories
        }
    }

    private static let ogImageRegex1 = try? NSRegularExpression(
        pattern: #"<meta[^>]+(?:property|name)\s*=\s*["']og:image["'][^>]*content\s*=\s*["']([^"']+)["']"#,
        options: .caseInsensitive
    )
    private static let ogImageRegex2 = try? NSRegularExpression(
        pattern: #"<meta[^>]+content\s*=\s*["']([^"']+)["'][^>]*(?:property|name)\s*=\s*["']og:image["']"#,
        options: .caseInsensitive
    )

    private static func fetchOGImage(from articleURL: URL) async -> URL? {
        var req = URLRequest(url: articleURL)
        req.timeoutInterval = 5
        req.setValue("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", forHTTPHeaderField: "User-Agent")
        req.setValue("bytes=0-65536", forHTTPHeaderField: "Range")
        do {
            let (data, _) = try await URLSession.shared.data(for: req)
            guard let html = String(data: data, encoding: .utf8) else { return nil }
            let range = NSRange(html.startIndex..., in: html)
            for regex in [ogImageRegex1, ogImageRegex2].compactMap({ $0 }) {
                if let match = regex.firstMatch(in: html, range: range),
                   match.numberOfRanges > 1,
                   let r = Range(match.range(at: 1), in: html) {
                    let raw = String(html[r]).replacingOccurrences(of: "&amp;", with: "&")
                    return URL(string: raw)
                }
            }
        } catch {}
        return nil
    }

    private static func downsample(data: Data, maxWidth: CGFloat) -> Data? {
        guard let image = NSImage(data: data) else { return nil }
        let size = image.size
        guard size.width > maxWidth else { return data }
        let ratio = maxWidth / size.width
        let newSize = NSSize(width: maxWidth, height: size.height * ratio)
        let resized = NSImage(size: newSize)
        resized.lockFocus()
        image.draw(in: NSRect(origin: .zero, size: newSize),
                   from: NSRect(origin: .zero, size: size),
                   operation: .copy, fraction: 1.0)
        resized.unlockFocus()
        guard let tiff = resized.tiffRepresentation,
              let rep = NSBitmapImageRep(data: tiff) else { return nil }
        return rep.representation(using: .jpeg,
                                  properties: [.compressionFactor: 0.7])
    }

    private static func cleanTitle(_ raw: String) -> String {
        // Strip common HTML entities and trailing whitespace
        raw
            .replacingOccurrences(of: "&amp;", with: "&")
            .replacingOccurrences(of: "&#039;", with: "'")
            .replacingOccurrences(of: "&quot;", with: "\"")
            .replacingOccurrences(of: "&#8217;", with: "’")
            .replacingOccurrences(of: "&#8211;", with: "–")
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }

    // MARK: - Extractive summarizer

    static func summarize(_ stories: [NewsStory], kind: NewsKind) -> String {
        guard !stories.isEmpty else {
            return "No stories available right now. Pull to refresh."
        }

        let words = stories
            .map { $0.title.lowercased() }
            .joined(separator: " ")
            .components(separatedBy: CharacterSet.alphanumerics.inverted)
            .filter { $0.count > 3 && !stopWords.contains($0) }

        var freq: [String: Int] = [:]
        for w in words { freq[w, default: 0] += 1 }
        let topThemes = freq.sorted { $0.value > $1.value }
            .prefix(4)
            .map(\.key)
            .joined(separator: ", ")

        let lead = stories.first?.title ?? ""
        let prefix = (kind == .ai)
            ? "\(stories.count) top AI stories today —"
            : "\(stories.count) top headlines —"
        let themesPart = topThemes.isEmpty ? "" : " Themes: \(topThemes)."
        return "\(prefix) \(lead).\(themesPart)"
    }

}
