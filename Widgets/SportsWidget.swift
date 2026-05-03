import WidgetKit
import SwiftUI

// MARK: - Entry

struct SportsEntry: TimelineEntry {
    let date: Date
    let games: [GameScore]
    let liveCount: Int
}

// MARK: - Provider

struct SportsProvider: TimelineProvider {
    func placeholder(in context: Context) -> SportsEntry {
        SportsEntry(date: Date(), games: [], liveCount: 0)
    }

    func getSnapshot(in context: Context, completion: @escaping (SportsEntry) -> Void) {
        Task { completion(await load()) }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<SportsEntry>) -> Void) {
        Task {
            let entry = await load()
            // Live games — refresh every 5 min. No live games — every 30 min.
            let interval: TimeInterval = entry.liveCount > 0 ? 5 * 60 : 30 * 60
            let next = Date().addingTimeInterval(interval)
            completion(Timeline(entries: [entry], policy: .after(next)))
        }
    }

    private func load() async -> SportsEntry {
        let games = await SportsService.fetchTopScores(limit: 6)
        let live = games.filter(\.isLive).count
        return SportsEntry(date: Date(), games: games, liveCount: live)
    }
}

// MARK: - Widget

struct SportsWidget: Widget {
    let kind: String = "SportsWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: SportsProvider()) { entry in
            SportsView(entry: entry)
                .containerBackground(for: .widget) {
                    ZStack {
                        Rectangle().fill(Color(red: 0.06, green: 0.10, blue: 0.06))
                        LinearGradient(
                            colors: [
                                Color(red: 0.10, green: 0.55, blue: 0.30).opacity(0.22),
                                Color(red: 0.20, green: 0.70, blue: 0.40).opacity(0.10),
                                .clear
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                        Rectangle().fill(.thickMaterial).opacity(0.35)
                    }
                }
        }
        .configurationDisplayName("Scores")
        .description("Live scores from the NFL, NBA, MLB, NHL, and Premier League.")
        .supportedFamilies([.systemMedium, .systemLarge, .systemExtraLarge])
    }
}

// MARK: - View

struct SportsView: View {
    let entry: SportsEntry
    @Environment(\.widgetFamily) private var family

    private var sportsGreen: Color { Color(red: 0.20, green: 0.78, blue: 0.45) }

    private var rowCount: Int {
        switch family {
        case .systemMedium: return 3
        case .systemLarge:  return 6
        default:            return 8
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 8) {
                ZStack {
                    RoundedRectangle(cornerRadius: 6, style: .continuous)
                        .fill(LinearGradient(
                            colors: [Color(red: 0.20, green: 0.78, blue: 0.45),
                                     Color(red: 0.10, green: 0.55, blue: 0.30)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing))
                    Image(systemName: "sportscourt.fill")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundStyle(.white)
                }
                .frame(width: 22, height: 22)
                .shadow(color: .black.opacity(0.25), radius: 2, y: 1)

                Text("Scores")
                    .font(.system(size: 13, weight: .semibold))

                if entry.liveCount > 0 {
                    LivePill(count: entry.liveCount)
                }

                Spacer()

                Text(entry.date, style: .time)
                    .font(.system(size: 12, weight: .medium))
                    .monospacedDigit()
                    .foregroundStyle(.secondary)
            }

            if entry.games.isEmpty {
                VStack(spacing: 6) {
                    Spacer()
                    Image(systemName: "sportscourt")
                        .font(.system(size: 28))
                        .foregroundStyle(.tertiary)
                    Text("No games right now")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Spacer()
                }
                .frame(maxWidth: .infinity)
            } else {
                VStack(spacing: 0) {
                    ForEach(Array(entry.games.prefix(rowCount).enumerated()), id: \.element.id) { idx, game in
                        if idx > 0 {
                            Divider().opacity(0.5)
                        }
                        gameRow(game)
                            .padding(.vertical, 6)
                    }
                }
            }

            Spacer(minLength: 0)
        }
    }

    @ViewBuilder
    private func gameRow(_ game: GameScore) -> some View {
        let link = game.url ?? URL(string: "https://www.espn.com")!
        Link(destination: link) {
            HStack(spacing: 10) {
                Text(game.leagueAbbrev)
                    .font(.system(size: 9, weight: .heavy))
                    .tracking(0.5)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 3)
                    .background(
                        RoundedRectangle(cornerRadius: 4, style: .continuous)
                            .fill(Color(hex: game.leagueAccent) ?? sportsGreen)
                    )
                    .frame(width: 38, alignment: .center)

                VStack(alignment: .leading, spacing: 1) {
                    Text(game.displayLine)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(.primary)
                        .lineLimit(1)
                    Text(game.statusShort)
                        .font(.system(size: 10.5, weight: .medium))
                        .foregroundStyle(game.isLive ? sportsGreen : .secondary)
                }

                Spacer(minLength: 4)

                if game.isLive {
                    Circle()
                        .fill(sportsGreen)
                        .frame(width: 7, height: 7)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

private struct LivePill: View {
    let count: Int
    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(Color(red: 0.20, green: 0.78, blue: 0.45))
                .frame(width: 6, height: 6)
            Text("\(count) LIVE")
                .font(.system(size: 9.5, weight: .heavy))
                .tracking(0.5)
                .foregroundStyle(Color(red: 0.20, green: 0.78, blue: 0.45))
        }
        .padding(.horizontal, 7)
        .padding(.vertical, 3)
        .background(
            Capsule().fill(Color(red: 0.20, green: 0.78, blue: 0.45).opacity(0.16))
        )
    }
}

// MARK: - Color helper

extension Color {
    init?(hex: String) {
        var s = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if s.hasPrefix("#") { s.removeFirst() }
        guard s.count == 6, let v = UInt32(s, radix: 16) else { return nil }
        let r = Double((v >> 16) & 0xFF) / 255.0
        let g = Double((v >> 8) & 0xFF) / 255.0
        let b = Double(v & 0xFF) / 255.0
        self = Color(red: r, green: g, blue: b)
    }
}
