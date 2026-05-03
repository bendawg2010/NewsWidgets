import Foundation
#if canImport(Combine)
import Combine
#endif

/// A single news feed the user can opt in / out of.
struct FeedSource: Identifiable, Hashable, Codable {
    let id: String           // stable id, used as the on-disk key
    let displayName: String
    let url: String
    let kind: Kind
    let icon: String         // SF Symbol

    enum Kind: String, Codable, Hashable { case ai, general }
}

/// Curated catalog of feeds the user can pick from.
enum FeedCatalog {
    static let aiFeeds: [FeedSource] = [
        .init(id: "techcrunch_ai",
              displayName: "TechCrunch AI",
              url: "https://techcrunch.com/category/artificial-intelligence/feed/",
              kind: .ai, icon: "cpu"),
        .init(id: "verge_ai",
              displayName: "The Verge — AI",
              url: "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
              kind: .ai, icon: "v.circle.fill"),
        .init(id: "ars_ai",
              displayName: "Ars Technica — AI",
              url: "https://arstechnica.com/ai/feed/",
              kind: .ai, icon: "atom"),
        .init(id: "venturebeat_ai",
              displayName: "VentureBeat — AI",
              url: "https://venturebeat.com/category/ai/feed/",
              kind: .ai, icon: "chart.line.uptrend.xyaxis"),
        .init(id: "mit_tech_review",
              displayName: "MIT Tech Review",
              url: "https://www.technologyreview.com/feed/",
              kind: .ai, icon: "graduationcap.fill"),
        .init(id: "hn_top",
              displayName: "Hacker News (top)",
              url: "https://hnrss.org/frontpage",
              kind: .ai, icon: "h.square"),
    ]

    static let generalFeeds: [FeedSource] = [
        .init(id: "fox_world",
              displayName: "Fox News — World",
              url: "https://moxie.foxnews.com/google-publisher/world.xml",
              kind: .general, icon: "globe.americas.fill"),
        .init(id: "fox_us",
              displayName: "Fox News — US",
              url: "https://moxie.foxnews.com/google-publisher/us.xml",
              kind: .general, icon: "flag.fill"),
        .init(id: "fox_politics",
              displayName: "Fox News — Politics",
              url: "https://moxie.foxnews.com/google-publisher/politics.xml",
              kind: .general, icon: "building.columns.fill"),
        .init(id: "bbc_world",
              displayName: "BBC — World",
              url: "https://feeds.bbci.co.uk/news/world/rss.xml",
              kind: .general, icon: "globe"),
        .init(id: "reuters_world",
              displayName: "Reuters — World",
              url: "https://www.reutersagency.com/feed/?best-regions=north-american&post_type=best",
              kind: .general, icon: "newspaper"),
        .init(id: "ap_top",
              displayName: "Associated Press",
              url: "https://feeds.feedburner.com/TheAssociatedPress",
              kind: .general, icon: "a.square"),
        .init(id: "wsj_world",
              displayName: "Wall Street Journal — World",
              url: "https://feeds.a.dj.com/rss/RSSWorldNews.xml",
              kind: .general, icon: "dollarsign.circle.fill"),
    ]

    static let allFeeds: [FeedSource] = aiFeeds + generalFeeds

    static func feed(byID id: String) -> FeedSource? {
        allFeeds.first(where: { $0.id == id })
    }
}

/// Persists the user's chosen feed IDs in the shared App Group container so
/// both the host app and the widget extension see the same selection.
final class SourcesStore: ObservableObject {
    static let shared = SourcesStore()

    private static let appGroup = "group.com.benburnette.NewsWidgets"
    private static let aiKey = "selectedAIFeeds"
    private static let newsKey = "selectedNewsFeeds"

    private let defaults: UserDefaults

    @Published var selectedAI: Set<String> {
        didSet { defaults.set(Array(selectedAI), forKey: Self.aiKey) }
    }
    @Published var selectedNews: Set<String> {
        didSet { defaults.set(Array(selectedNews), forKey: Self.newsKey) }
    }

    private init() {
        // Fall back to .standard if the app group isn't set up correctly.
        let d = UserDefaults(suiteName: Self.appGroup) ?? .standard
        self.defaults = d
        let savedAI = (d.array(forKey: Self.aiKey) as? [String]) ?? FeedCatalog.aiFeeds.map(\.id)
        let savedNews = (d.array(forKey: Self.newsKey) as? [String])
            ?? ["fox_world", "fox_us"]
        self.selectedAI = Set(savedAI)
        self.selectedNews = Set(savedNews)
    }

    func aiSourceList() -> [FeedSource] {
        FeedCatalog.aiFeeds.filter { selectedAI.contains($0.id) }
    }

    func newsSourceList() -> [FeedSource] {
        FeedCatalog.generalFeeds.filter { selectedNews.contains($0.id) }
    }

    func toggle(_ feed: FeedSource) {
        switch feed.kind {
        case .ai:
            if selectedAI.contains(feed.id) { selectedAI.remove(feed.id) }
            else { selectedAI.insert(feed.id) }
        case .general:
            if selectedNews.contains(feed.id) { selectedNews.remove(feed.id) }
            else { selectedNews.insert(feed.id) }
        }
    }

    func isOn(_ feed: FeedSource) -> Bool {
        feed.kind == .ai
            ? selectedAI.contains(feed.id)
            : selectedNews.contains(feed.id)
    }
}
