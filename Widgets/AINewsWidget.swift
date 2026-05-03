import WidgetKit
import SwiftUI
import AppKit

// MARK: - Entry

struct AINewsEntry: TimelineEntry {
    let date: Date
    let stories: [NewsStory]
    let summary: String
}

// MARK: - Provider

struct AINewsProvider: TimelineProvider {
    func placeholder(in context: Context) -> AINewsEntry {
        AINewsEntry(date: Date(),
                    stories: NewsStory.placeholders,
                    summary: "Summarizing the day's AI news…")
    }

    func getSnapshot(in context: Context, completion: @escaping (AINewsEntry) -> Void) {
        Task { completion(await load()) }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<AINewsEntry>) -> Void) {
        Task {
            let entry = await load()
            let next = Date().addingTimeInterval(30 * 60)
            completion(Timeline(entries: [entry], policy: .after(next)))
        }
    }

    private func load() async -> AINewsEntry {
        do {
            let stories = try await NewsService.fetchAIStories(limit: 5)
            let summary = NewsService.summarize(stories, kind: .ai)
            return AINewsEntry(date: Date(), stories: stories, summary: summary)
        } catch {
            return AINewsEntry(date: Date(),
                               stories: [],
                               summary: "AI feed unavailable. Will retry shortly.")
        }
    }
}

// MARK: - Widget configuration

struct AINewsWidget: Widget {
    let kind: String = "AINewsWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: AINewsProvider()) { entry in
            AINewsView(entry: entry)
                .containerBackground(for: .widget) {
                    // Solid darkish base + gradient sheen. macOS desktop widgets
                    // are dimmed when another app is frontmost — using an opaque
                    // backing keeps text legible through that tint.
                    ZStack {
                        Rectangle().fill(Color(red: 0.10, green: 0.06, blue: 0.16))
                        LinearGradient(
                            colors: [
                                Color(red: 0.66, green: 0.33, blue: 0.97).opacity(0.20),
                                Color(red: 0.23, green: 0.51, blue: 0.96).opacity(0.12),
                                .clear
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                        Rectangle().fill(.thickMaterial).opacity(0.35)
                    }
                }
        }
        .configurationDisplayName("AI Today")
        .description("A daily summary of AI news, refreshed automatically.")
        .supportedFamilies([.systemMedium, .systemLarge, .systemExtraLarge])
    }
}

// MARK: - View
//
// AI Today widget — Apple Intelligence aesthetic
// Brand: pink → purple → blue gradient (top-leading → bottom-trailing)
// Sources: TechCrunch, The Verge, Ars Technica, VentureBeat

struct AINewsView: View {
    let entry: AINewsEntry
    @Environment(\.widgetFamily) private var family

    private let aiGradient = LinearGradient(
        colors: [
            Color(red: 0.93, green: 0.28, blue: 0.60),  // pink
            Color(red: 0.66, green: 0.33, blue: 0.97),  // purple
            Color(red: 0.23, green: 0.51, blue: 0.96)   // blue
        ],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

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

    /// Photo hero on every size — Medium gets a shorter card, list shrinks to 1.
    private var showHero: Bool { true }

    /// When the hero is shown, the first story is the hero — list shows the rest.
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
                        .fill(aiGradient)
                    Image(systemName: "sparkles")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(.white)
                }
                .frame(width: 22, height: 22)
                .shadow(color: .black.opacity(0.20), radius: 2, y: 1)

                Text("AI Today")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(.primary)

                Spacer()

                Text(entry.date, style: .time)
                    .font(.system(size: 12, weight: .medium))
                    .monospacedDigit()
                    .foregroundStyle(.secondary)
            }

            // MARK: Photo hero (top story)
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

    private var aiGradientFallback: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.34, green: 0.11, blue: 0.53),
                    Color(red: 0.12, green: 0.23, blue: 0.54)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            RadialGradient(
                colors: [Color(red: 0.93, green: 0.28, blue: 0.60).opacity(0.85), .clear],
                center: UnitPoint(x: 0.30, y: 0.30),
                startRadius: 0,
                endRadius: 180
            )
            RadialGradient(
                colors: [Color(red: 0.23, green: 0.51, blue: 0.96).opacity(0.85), .clear],
                center: UnitPoint(x: 0.70, y: 0.65),
                startRadius: 0,
                endRadius: 200
            )
        }
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
                                aiGradientFallback
                            }
                        }
                    )
                    .clipped()

                // Bottom dark overlay for text legibility
                LinearGradient(
                    colors: [.clear, .black.opacity(0.7)],
                    startPoint: .top, endPoint: .bottom
                )

                VStack(alignment: .leading, spacing: 6) {
                    Text("TOP STORY")
                        .font(.system(size: 9, weight: .heavy))
                        .tracking(0.8)
                        .foregroundStyle(.white)
                        .padding(.horizontal, 7)
                        .padding(.vertical, 3)
                        .background(
                            LinearGradient(
                                colors: [
                                    Color(red: 0.93, green: 0.28, blue: 0.60),
                                    Color(red: 0.66, green: 0.33, blue: 0.97)
                                ],
                                startPoint: .leading, endPoint: .trailing
                            ),
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

    /// Build a deep link that opens the host app on the article.
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
    private func storyRow(_ story: NewsStory) -> some View {
        Link(destination: openInAppURL(for: story)) {
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(story.source.uppercased())
                        .font(.system(size: 9.5, weight: .heavy))
                        .tracking(0.6)
                        .foregroundStyle(aiGradient)
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
