import SwiftUI
import WidgetKit

@main
struct NewsWidgetsApp: App {
    @StateObject private var router = AppRouter()
    @StateObject private var refresher = WidgetRefresher()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(router)
                .frame(minWidth: 900, minHeight: 600)
                .onOpenURL { router.handle(url: $0) }
                .onAppear { refresher.start() }
        }
        .windowResizability(.contentSize)
    }
}

/// Forces WidgetCenter to reload timelines on a strict cadence whenever the
/// host app is running. macOS otherwise throttles widget reloads aggressively
/// (it treats Timeline policies as hints, not guarantees).
@MainActor
final class WidgetRefresher: ObservableObject {
    private var timer: Timer?
    /// Reload every 15 min — both widgets refetch on each call.
    private let interval: TimeInterval = 15 * 60

    func start() {
        guard timer == nil else { return }
        // Fire immediately on launch, then every interval.
        WidgetCenter.shared.reloadAllTimelines()
        timer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true) { _ in
            Task { @MainActor in
                WidgetCenter.shared.reloadAllTimelines()
            }
        }
        timer?.tolerance = 30
    }
}

/// Drives navigation from incoming widget deep links.
final class AppRouter: ObservableObject {
    @Published var openedArticle: ArticleRequest? = nil
    @Published var lastOpenAt: Date = Date()

    struct ArticleRequest: Identifiable, Equatable {
        let id = UUID()
        let url: URL
        let title: String?
    }

    func handle(url: URL) {
        guard url.scheme == "newswidgets" else { return }
        guard let comps = URLComponents(url: url, resolvingAgainstBaseURL: false) else { return }

        switch url.host {
        case "story":
            let items = comps.queryItems ?? []
            let urlStr = items.first(where: { $0.name == "url" })?.value
            let title = items.first(where: { $0.name == "title" })?.value
            if let s = urlStr,
               let decoded = s.removingPercentEncoding,
               let articleURL = URL(string: decoded) {
                openedArticle = ArticleRequest(url: articleURL, title: title)
            }
        case "reload":
            // Triggered by external schedulers (e.g. cron / LaunchAgent).
            WidgetCenter.shared.reloadAllTimelines()
        default:
            break
        }
        lastOpenAt = Date()
    }
}
