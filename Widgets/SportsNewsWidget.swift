import WidgetKit
import SwiftUI
import AppKit

// MARK: - Entry

struct SportsNewsEntry: TimelineEntry {
    let date: Date
    let stories: [NewsStory]
    let summary: String
}

// MARK: - Provider

struct SportsNewsProvider: TimelineProvider {
    func placeholder(in context: Context) -> SportsNewsEntry {
        SportsNewsEntry(date: Date(),
                        stories: NewsStory.placeholders,
                        summary: "Loading sports headlines…")
    }

    func getSnapshot(in context: Context, completion: @escaping (SportsNewsEntry) -> Void) {
        Task { completion(await load()) }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SportsNewsEntry>) -> Void) {
        Task {
            let entry = await load()
            let next = Date().addingTimeInterval(20 * 60)
            completion(Timeline(entries: [entry], policy: .after(next)))
        }
    }

    private func load() async -> SportsNewsEntry {
        let stories = await SportsNewsService.fetchTop(limit: 5)
        let lead = stories.first?.title ?? "Top sports stories"
        let summary = "\(stories.count) top sports stories — \(lead)."
        return SportsNewsEntry(date: Date(), stories: stories, summary: summary)
    }
}

// MARK: - Widget

struct SportsNewsWidget: Widget {
    let kind: String = "SportsNewsWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SportsNewsProvider()) { entry in
            SportsNewsView(entry: entry)
                .containerBackground(for: .widget) {
                    ZStack {
                        Rectangle().fill(Color(red: 0.04, green: 0.10, blue: 0.06))
                        LinearGradient(
                            colors: [
                                Color(red: 0.18, green: 0.65, blue: 0.40).opacity(0.20),
                                Color(red: 0.10, green: 0.45, blue: 0.30).opacity(0.10),
                                .clear
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                        Rectangle().fill(.thickMaterial).opacity(0.30)
                    }
                }
        }
        .configurationDisplayName("Sports News")
        .description("Top sports headlines from ESPN, Fox Sports, BBC Sport, CBS Sports.")
        .supportedFamilies([.systemMedium, .systemLarge, .systemExtraLarge])
    }
}

// MARK: - View

struct SportsNewsView: View {
    let entry: SportsNewsEntry
    @Environment(\.widgetFamily) private var family

    private var sportsGreen: Color { Color(red: 0.18, green: 0.65, blue: 0.40) }

    private var storyCount: Int {
        switch family {
        case .systemMedium: return 2
        case .systemLarge:  return 4
        default:            return 5
        }
    }
    private var stories: [NewsStory] { Array(entry.stories.prefix(storyCount)) }
    private var listStories: [NewsStory] {
        guard stories.first != nil else { return stories }
        return Array(stories.dropFirst())
    }

    private var greenGradient: LinearGradient {
        LinearGradient(
            colors: [Color(red: 0.20, green: 0.78, blue: 0.45),
                     Color(red: 0.10, green: 0.55, blue: 0.30)],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            // Header
            HStack(spacing: 8) {
                ZStack {
                    RoundedRectangle(cornerRadius: 6, style: .continuous).fill(greenGradient)
                    Image(systemName: "trophy.fill")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(.white)
                }
                .frame(width: 22, height: 22)
                .shadow(color: .black.opacity(0.20), radius: 2, y: 1)

                Text("Sports News")
                    .font(.system(size: 13, weight: .semibold))

                Spacer()

                Text(entry.date, style: .time)
                    .font(.system(size: 12, weight: .medium))
                    .monospacedDigit()
                    .foregroundStyle(.secondary)
            }

            // Photo hero
            if let top = stories.first {
                photoHero(for: top)
            }

            // Story list
            VStack(alignment: .leading, spacing: 0) {
                ForEach(listStories) { story in
                    storyRow(story)
                }
            }

            Spacer(minLength: 0)
        }
    }

    @ViewBuilder
    private func photoHero(for story: NewsStory) -> some View {
        Link(destination: story.url ?? URL(string: "https://www.espn.com")!) {
            ZStack(alignment: .bottomLeading) {
                Color.clear.overlay(
                    Group {
                        if let data = story.imageData, let nsImage = NSImage(data: data) {
                            Image(nsImage: nsImage)
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                        } else {
                            ZStack {
                                LinearGradient(
                                    colors: [Color(red: 0.05, green: 0.30, blue: 0.20),
                                             Color(red: 0.02, green: 0.20, blue: 0.10)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                                RadialGradient(
                                    colors: [sportsGreen.opacity(0.85), .clear],
                                    center: UnitPoint(x: 0.30, y: 0.30),
                                    startRadius: 0,
                                    endRadius: 200
                                )
                            }
                        }
                    }
                ).clipped()

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
                        .background(greenGradient,
                                    in: RoundedRectangle(cornerRadius: 5, style: .continuous))

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
        Link(destination: story.url ?? URL(string: "https://www.espn.com")!) {
            VStack(alignment: .leading, spacing: 2) {
                HStack(spacing: 6) {
                    Text(story.source.uppercased())
                        .font(.system(size: 9.5, weight: .heavy))
                        .tracking(0.6)
                        .foregroundStyle(sportsGreen)
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
