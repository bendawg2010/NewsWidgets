import WidgetKit
import SwiftUI
import AppKit

// MARK: - Entry

struct GeneralNewsEntry: TimelineEntry {
    let date: Date
    let stories: [NewsStory]
    let summary: String
}

// MARK: - Provider

struct GeneralNewsProvider: TimelineProvider {
    func placeholder(in context: Context) -> GeneralNewsEntry {
        GeneralNewsEntry(date: Date(),
                         stories: NewsStory.placeholders,
                         summary: "Summarizing today's headlines…")
    }

    func getSnapshot(in context: Context, completion: @escaping (GeneralNewsEntry) -> Void) {
        Task { completion(await load()) }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<GeneralNewsEntry>) -> Void) {
        Task {
            let entry = await load()
            let next = Date().addingTimeInterval(15 * 60)
            completion(Timeline(entries: [entry], policy: .after(next)))
        }
    }

    private func load() async -> GeneralNewsEntry {
        do {
            let stories = try await NewsService.fetchTopHeadlines(limit: 5)
            let summary = NewsService.summarize(stories, kind: .general)
            return GeneralNewsEntry(date: Date(), stories: stories, summary: summary)
        } catch {
            return GeneralNewsEntry(date: Date(),
                                    stories: [],
                                    summary: "News feed unavailable. Will retry shortly.")
        }
    }
}

// MARK: - Widget configuration

struct GeneralNewsWidget: Widget {
    let kind: String = "GeneralNewsWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: GeneralNewsProvider()) { entry in
            GeneralNewsView(entry: entry)
                .containerBackground(for: .widget) {
                    ZStack {
                        Rectangle().fill(.regularMaterial)
                        LinearGradient(
                            colors: [
                                Color(red: 0.98, green: 0.18, blue: 0.28).opacity(0.10),
                                Color(red: 0.50, green: 0.11, blue: 0.11).opacity(0.05),
                                .clear
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                    }
                }
        }
        .configurationDisplayName("News")
        .description("Top world headlines from Fox News, refreshed automatically.")
        .supportedFamilies([.systemMedium, .systemLarge, .systemExtraLarge])
    }
}

// MARK: - View
//
// News widget — Apple News aesthetic
// Brand: Apple News red (#FA2D48)
// Source: Fox News (US + World)

struct GeneralNewsView: View {
    let entry: GeneralNewsEntry
    @Environment(\.widgetFamily) private var family

    private let newsRed = Color(red: 0.98, green: 0.18, blue: 0.28)

    private var storyCount: Int {
        switch family {
        case .systemMedium: return 2
        case .systemLarge:  return 4
        default:            return 5
        }
    }

    private var stories: [NewsStory] {
        Array(entry.stories.prefix(storyCount))
    }

    private var showHero: Bool { true }

    private var listStories: [NewsStory] {
        guard showHero, let _ = stories.first else { return stories }
        return Array(stories.dropFirst())
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            // MARK: Header
            HStack(spacing: 8) {
                ZStack {
                    RoundedRectangle(cornerRadius: 6, style: .continuous)
                        .fill(LinearGradient(
                            colors: [Color(red: 1.0, green: 0.35, blue: 0.37), newsRed],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ))
                    Image(systemName: "newspaper.fill")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(.white)
                }
                .frame(width: 22, height: 22)
                .shadow(color: .black.opacity(0.20), radius: 2, y: 1)

                Text("News")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(.primary)

                Spacer()

                Text(entry.date, style: .time)
                    .font(.system(size: 12, weight: .medium))
                    .monospacedDigit()
                    .foregroundStyle(.secondary)
            }

            // MARK: Photo hero (breaking story)
            if showHero, let top = stories.first {
                photoHero(for: top)
            }

            // MARK: Story list
            VStack(alignment: .leading, spacing: 0) {
                ForEach(listStories) { story in
                    storyRow(story)
                }
            }

            Spacer(minLength: 0)
        }
    }

    private var newsGradientFallback: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.12, green: 0.16, blue: 0.22),
                    Color(red: 0.50, green: 0.11, blue: 0.11)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            RadialGradient(
                colors: [newsRed.opacity(0.95), .clear],
                center: UnitPoint(x: 0.70, y: 0.30),
                startRadius: 0,
                endRadius: 200
            )
        }
    }

    private func openInAppURL(for story: NewsStory) -> URL {
        guard let articleURL = story.url,
              let encoded = articleURL.absoluteString
                .addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
              let u = URL(string: "newswidgets://story?url=\(encoded)&title=\(story.title.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")")
        else {
            return URL(string: "newswidgets://home")!
        }
        return u
    }

    @ViewBuilder
    private func photoHero(for story: NewsStory) -> some View {
        Link(destination: openInAppURL(for: story)) {
            ZStack(alignment: .bottomLeading) {
                // Real (pre-fetched) image when available, gradient fallback otherwise.
                // Color.clear anchors the ZStack size so the Image doesn't push the
                // bottom-aligned overlay (badge + title) out of the visible frame.
                Color.clear
                    .overlay(
                        Group {
                            if let data = story.imageData, let nsImage = NSImage(data: data) {
                                Image(nsImage: nsImage)
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                            } else {
                                newsGradientFallback
                            }
                        }
                    )
                    .clipped()

                LinearGradient(
                    colors: [.clear, .black.opacity(0.7)],
                    startPoint: .top, endPoint: .bottom
                )

                VStack(alignment: .leading, spacing: 6) {
                    Text("BREAKING")
                        .font(.system(size: 9, weight: .heavy))
                        .tracking(0.8)
                        .foregroundStyle(.white)
                        .padding(.horizontal, 7)
                        .padding(.vertical, 3)
                        .background(
                            newsRed,
                            in: RoundedRectangle(cornerRadius: 5, style: .continuous)
                        )

                    Spacer(minLength: 0)

                    Text(story.title)
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(.white)
                        .lineLimit(2)
                        .multilineTextAlignment(.leading)
                        .shadow(color: .black.opacity(0.4), radius: 2, y: 1)
                }
                .padding(10)
            }
            .frame(height: family == .systemMedium ? 60 : (family == .systemLarge ? 96 : 110))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func storyRow(_ story: NewsStory) -> some View {
        Link(destination: openInAppURL(for: story)) {
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(story.source.uppercased())
                        .font(.system(size: 9.5, weight: .heavy))
                        .tracking(0.6)
                        .foregroundStyle(newsRed)
                    Circle()
                        .fill(.secondary.opacity(0.4))
                        .frame(width: 2, height: 2)
                    Text(story.timestamp, style: .relative)
                        .font(.system(size: 9.5, weight: .heavy))
                        .tracking(0.6)
                        .foregroundStyle(.secondary)
                        .monospacedDigit()
                }
                Text(story.title)
                    .font(.system(size: 13, weight: .semibold))
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                    .foregroundStyle(.primary)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.vertical, 6)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}
