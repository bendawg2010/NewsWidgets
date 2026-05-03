import SwiftUI
import WebKit
import WidgetKit

// MARK: - Root

struct RootView: View {
    @EnvironmentObject var router: AppRouter
    @StateObject private var feed = FeedViewModel()
    @State private var selectedStoryID: NewsStory.ID?
    @State private var showSettings = false

    var body: some View {
        NavigationSplitView {
            sidebar
        } detail: {
            detail
        }
        .navigationTitle("News Widgets")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button {
                    showSettings = true
                } label: {
                    Label("Sources", systemImage: "slider.horizontal.3")
                }
                .help("Choose news sources")
            }
            ToolbarItem(placement: .primaryAction) {
                Button {
                    Task { await feed.refresh() }
                    WidgetCenter.shared.reloadAllTimelines()
                } label: {
                    Label("Refresh", systemImage: "arrow.clockwise")
                }
                .help("Reload feeds and refresh widgets")
            }
        }
        .sheet(isPresented: $showSettings) {
            SettingsView(onChange: { Task { await feed.refresh() } })
        }
        .task { await feed.refresh() }
        .onChange(of: router.openedArticle) { _, _ in
            // When a widget opens an article URL, clear sidebar selection so
            // the detail pane shows the deep-linked article instead.
            if router.openedArticle != nil { selectedStoryID = nil }
        }
    }

    // MARK: - Sidebar

    @ViewBuilder
    private var sidebar: some View {
        List(selection: $selectedStoryID) {
            Section {
                ForEach(feed.aiStories) { story in
                    storyCell(story)
                        .tag(story.id)
                }
            } header: {
                sectionHeader("AI Today",
                              icon: "sparkles",
                              gradient: LinearGradient(
                                colors: [Color(red: 0.93, green: 0.28, blue: 0.60),
                                         Color(red: 0.66, green: 0.33, blue: 0.97),
                                         Color(red: 0.23, green: 0.51, blue: 0.96)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing))
            }
            Section {
                ForEach(feed.newsStories) { story in
                    storyCell(story)
                        .tag(story.id)
                }
            } header: {
                sectionHeader("World News",
                              icon: "newspaper.fill",
                              gradient: LinearGradient(
                                colors: [Color(red: 1.0, green: 0.35, blue: 0.37),
                                         Color(red: 0.98, green: 0.18, blue: 0.28)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing))
            }
        }
        .listStyle(.sidebar)
        .navigationSplitViewColumnWidth(min: 280, ideal: 340, max: 420)
        .overlay {
            if feed.isLoading && feed.aiStories.isEmpty && feed.newsStories.isEmpty {
                ProgressView("Loading…")
            }
        }
    }

    @ViewBuilder
    private func sectionHeader(_ title: String, icon: String, gradient: LinearGradient) -> some View {
        HStack(spacing: 6) {
            ZStack {
                RoundedRectangle(cornerRadius: 4, style: .continuous).fill(gradient)
                Image(systemName: icon)
                    .font(.system(size: 9, weight: .bold))
                    .foregroundStyle(.white)
            }
            .frame(width: 16, height: 16)
            Text(title)
                .font(.system(size: 11, weight: .semibold))
                .textCase(nil)
        }
    }

    @ViewBuilder
    private func storyCell(_ story: NewsStory) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 6) {
                Text(story.source.uppercased())
                    .font(.system(size: 9.5, weight: .heavy))
                    .tracking(0.6)
                    .foregroundStyle(sourceTint(for: story.source))
                Circle()
                    .fill(.secondary.opacity(0.4))
                    .frame(width: 2, height: 2)
                Text(story.timestamp, style: .relative)
                    .font(.system(size: 9.5, weight: .heavy))
                    .tracking(0.6)
                    .foregroundStyle(.secondary)
            }
            Text(story.title)
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(.primary)
                .lineLimit(3)
                .multilineTextAlignment(.leading)
        }
        .padding(.vertical, 4)
    }

    private func sourceTint(for source: String) -> Color {
        switch source {
        case "FOX NEWS": return Color(red: 0.98, green: 0.18, blue: 0.28)
        default:         return Color(red: 0.66, green: 0.33, blue: 0.97)
        }
    }

    // MARK: - Detail pane

    @ViewBuilder
    private var detail: some View {
        if let req = router.openedArticle {
            // Widget deep-link wins over sidebar selection
            ArticleReaderView(url: req.url, title: req.title ?? "")
                .id(req.id)  // force a fresh WKWebView per request
        } else if let id = selectedStoryID,
                  let story = feed.story(byID: id),
                  let url = story.url {
            ArticleReaderView(url: url, title: story.title)
                .id(id)
        } else {
            welcomeView
        }
    }

    @ViewBuilder
    private var welcomeView: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.93, green: 0.28, blue: 0.60).opacity(0.18),
                    Color(red: 0.66, green: 0.33, blue: 0.97).opacity(0.18),
                    Color(red: 0.23, green: 0.51, blue: 0.96).opacity(0.10)
                ],
                startPoint: .topLeading, endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            VStack(spacing: 16) {
                Image(systemName: "sparkles.rectangle.stack.fill")
                    .font(.system(size: 64, weight: .regular))
                    .foregroundStyle(LinearGradient(
                        colors: [Color(red: 0.93, green: 0.28, blue: 0.60),
                                 Color(red: 0.66, green: 0.33, blue: 0.97),
                                 Color(red: 0.23, green: 0.51, blue: 0.96)],
                        startPoint: .topLeading, endPoint: .bottomTrailing))
                Text("News Widgets")
                    .font(.system(size: 28, weight: .bold))
                Text("Pick a story from the sidebar — or tap one in your widget on the desktop.")
                    .font(.system(size: 14))
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .frame(maxWidth: 380)
            }
            .padding()
        }
    }
}

// MARK: - Reader

struct ArticleReaderView: View {
    let url: URL
    let title: String
    @State private var isLoading = true

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 8) {
                Text(title.isEmpty ? url.host ?? "Article" : title)
                    .font(.system(size: 14, weight: .semibold))
                    .lineLimit(1)
                Spacer()
                Link(destination: url) {
                    Label("Open in Browser", systemImage: "safari")
                        .font(.system(size: 12, weight: .medium))
                        .padding(.horizontal, 10).padding(.vertical, 5)
                        .background(.regularMaterial, in: Capsule())
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(.bar)

            ZStack {
                WebViewRepresentable(url: url, isLoading: $isLoading)
                if isLoading {
                    ProgressView()
                        .controlSize(.large)
                }
            }
        }
    }
}

struct WebViewRepresentable: NSViewRepresentable {
    let url: URL
    @Binding var isLoading: Bool

    func makeCoordinator() -> Coordinator {
        Coordinator(isLoading: $isLoading)
    }

    func makeNSView(context: Context) -> WKWebView {
        let cfg = WKWebViewConfiguration()
        cfg.defaultWebpagePreferences.preferredContentMode = .desktop
        let web = WKWebView(frame: .zero, configuration: cfg)
        web.navigationDelegate = context.coordinator
        web.allowsBackForwardNavigationGestures = true
        web.load(URLRequest(url: url))
        return web
    }

    func updateNSView(_ nsView: WKWebView, context: Context) {
        if nsView.url != url {
            nsView.load(URLRequest(url: url))
        }
    }

    final class Coordinator: NSObject, WKNavigationDelegate {
        @Binding var isLoading: Bool
        init(isLoading: Binding<Bool>) { _isLoading = isLoading }

        func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
            isLoading = true
        }
        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            isLoading = false
        }
        func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
            isLoading = false
        }
    }
}

// MARK: - Feed view model

@MainActor
final class FeedViewModel: ObservableObject {
    @Published var aiStories: [NewsStory] = []
    @Published var newsStories: [NewsStory] = []
    @Published var isLoading = false

    func refresh() async {
        isLoading = true
        async let ai = NewsService.fetchAIStories(limit: 12)
        async let news = NewsService.fetchTopHeadlines(limit: 12)
        let (aiResult, newsResult) = await ((try? ai) ?? [], (try? news) ?? [])
        aiStories = aiResult
        newsStories = newsResult
        isLoading = false
    }

    func story(byID id: NewsStory.ID) -> NewsStory? {
        aiStories.first(where: { $0.id == id }) ?? newsStories.first(where: { $0.id == id })
    }
}
