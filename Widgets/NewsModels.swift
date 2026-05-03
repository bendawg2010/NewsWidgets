import Foundation

struct NewsStory: Identifiable, Hashable {
    let id: String
    let title: String
    let url: URL?
    let source: String
    let timestamp: Date
    let imageURL: URL?
    /// Pre-fetched image bytes for the hero story. Populated by NewsService
    /// before handing the entry to WidgetKit (AsyncImage doesn't work reliably
    /// in widget snapshots).
    let imageData: Data?

    init(id: String, title: String, url: URL?, source: String,
         timestamp: Date, imageURL: URL? = nil, imageData: Data? = nil) {
        self.id = id
        self.title = title
        self.url = url
        self.source = source
        self.timestamp = timestamp
        self.imageURL = imageURL
        self.imageData = imageData
    }

    static let placeholders: [NewsStory] = [
        NewsStory(id: "p1", title: "Loading the day's top stories…",
                  url: nil, source: "—", timestamp: Date()),
        NewsStory(id: "p2", title: "One moment while we fetch the news",
                  url: nil, source: "—", timestamp: Date()),
        NewsStory(id: "p3", title: "Tap to refresh once data arrives",
                  url: nil, source: "—", timestamp: Date())
    ]
}

enum NewsKind {
    case ai
    case general
}
