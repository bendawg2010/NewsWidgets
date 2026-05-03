import Foundation
import AppKit

/// Top sports articles aggregated across multiple sources.
enum SportsNewsService {

    private struct Feed {
        let url: String
        let label: String
    }

    private static let feeds: [Feed] = [
        Feed(url: "https://www.espn.com/espn/rss/news",            label: "ESPN"),
        Feed(url: "https://feeds.bbci.co.uk/sport/rss.xml",        label: "BBC SPORT"),
        Feed(url: "https://api.foxsports.com/v1/rss",              label: "FOX SPORTS"),
        Feed(url: "https://www.cbssports.com/rss/headlines/",      label: "CBS SPORTS"),
    ]

    private struct RSSResp: Decodable {
        struct Enclosure: Decodable { let link: String? }
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

    private static let dateFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd HH:mm:ss"
        f.timeZone = TimeZone(identifier: "UTC")
        f.locale = Locale(identifier: "en_US_POSIX")
        return f
    }()

    static func fetchTop(limit: Int = 5) async -> [NewsStory] {
        let merged = await withTaskGroup(of: [NewsStory].self) { group -> [NewsStory] in
            for f in feeds {
                group.addTask { await fetchOne(f) }
            }
            var all: [NewsStory] = []
            for await chunk in group { all.append(contentsOf: chunk) }
            return all
        }

        // Most recent first; dedupe by title prefix
        var seen = Set<String>()
        var out: [NewsStory] = []
        for story in merged.sorted(by: { $0.timestamp > $1.timestamp }) {
            let key = String(story.title.lowercased().prefix(40))
            if seen.contains(key) { continue }
            seen.insert(key)
            out.append(story)
            if out.count >= limit { break }
        }

        // Pre-fetch hero image for the top story (reuse NewsService cache helpers
        // by going through its public path).
        return await prefetchHero(stories: out)
    }

    private static func fetchOne(_ feed: Feed) async -> [NewsStory] {
        guard let enc = feed.url.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let url = URL(string: "https://api.rss2json.com/v1/api.json?rss_url=\(enc)")
        else { return [] }
        do {
            var req = URLRequest(url: url); req.timeoutInterval = 8
            let (data, _) = try await URLSession.shared.data(for: req)
            let resp = try JSONDecoder().decode(RSSResp.self, from: data)
            return (resp.items ?? []).map { item in
                NewsStory(
                    id: "\(feed.label)-\(item.link.hashValue)",
                    title: clean(item.title),
                    url: URL(string: item.link),
                    source: feed.label,
                    timestamp: dateFormatter.date(from: item.pubDate) ?? Date(),
                    imageURL: extractImage(item)
                )
            }
        } catch { return [] }
    }

    private static func extractImage(_ item: RSSResp.Item) -> URL? {
        if let s = item.enclosure?.link, !s.isEmpty,
           let u = URL(string: s.replacingOccurrences(of: "&amp;", with: "&")) {
            return u
        }
        if let s = item.thumbnail, !s.isEmpty, let u = URL(string: s) { return u }
        return nil
    }

    private static func clean(_ s: String) -> String {
        s.replacingOccurrences(of: "&amp;", with: "&")
         .replacingOccurrences(of: "&#039;", with: "'")
         .replacingOccurrences(of: "&quot;", with: "\"")
         .replacingOccurrences(of: "&#8217;", with: "’")
         .replacingOccurrences(of: "&#8211;", with: "–")
         .trimmingCharacters(in: .whitespacesAndNewlines)
    }

    /// Same simple inline pre-fetch as the news service. Stored as imageData.
    private static func prefetchHero(stories: [NewsStory]) async -> [NewsStory] {
        guard let hero = stories.first, let url = hero.imageURL else { return stories }
        do {
            var req = URLRequest(url: url); req.timeoutInterval = 8
            let (data, _) = try await URLSession.shared.data(for: req)
            let final = downsample(data: data, maxWidth: 600) ?? data
            var updated = stories
            let h = hero
            updated[0] = NewsStory(
                id: h.id, title: h.title, url: h.url,
                source: h.source, timestamp: h.timestamp,
                imageURL: h.imageURL, imageData: final
            )
            return updated
        } catch { return stories }
    }

    private static func downsample(data: Data, maxWidth: CGFloat) -> Data? {
        let cfData = data as CFData
        guard let src = CGImageSourceCreateWithData(cfData, nil) else { return nil }
        let opts: [CFString: Any] = [
            kCGImageSourceCreateThumbnailFromImageAlways: true,
            kCGImageSourceCreateThumbnailWithTransform:   true,
            kCGImageSourceShouldCacheImmediately:         true,
            kCGImageSourceThumbnailMaxPixelSize:          Int(maxWidth),
        ]
        guard let cg = CGImageSourceCreateThumbnailAtIndex(src, 0, opts as CFDictionary)
        else { return nil }
        let mutable = NSMutableData()
        guard let dest = CGImageDestinationCreateWithData(mutable, "public.jpeg" as CFString, 1, nil)
        else { return nil }
        CGImageDestinationAddImage(dest, cg, [kCGImageDestinationLossyCompressionQuality: 0.65] as CFDictionary)
        guard CGImageDestinationFinalize(dest) else { return nil }
        return mutable as Data
    }
}
