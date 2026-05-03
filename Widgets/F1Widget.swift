import WidgetKit
import SwiftUI

// MARK: - Entry

struct F1Entry: TimelineEntry {
    let date: Date
    let snapshot: F1Snapshot
}

// MARK: - Provider

struct F1Provider: TimelineProvider {
    func placeholder(in context: Context) -> F1Entry {
        F1Entry(date: Date(), snapshot: F1Snapshot(session: nil, drivers: [], nextRace: nil))
    }

    func getSnapshot(in context: Context, completion: @escaping (F1Entry) -> Void) {
        Task { completion(await load()) }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<F1Entry>) -> Void) {
        Task {
            let entry = await load()
            // Live session → 90 seconds. Otherwise → 30 minutes (next race countdown).
            let interval: TimeInterval = (entry.snapshot.session?.isLive == true) ? 90 : 30 * 60
            completion(Timeline(entries: [entry],
                                policy: .after(Date().addingTimeInterval(interval))))
        }
    }

    private func load() async -> F1Entry {
        F1Entry(date: Date(), snapshot: await F1Service.fetchSnapshot())
    }
}

// MARK: - Widget

struct F1Widget: Widget {
    let kind: String = "F1Widget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: F1Provider()) { entry in
            F1View(entry: entry)
                .containerBackground(for: .widget) {
                    ZStack {
                        Rectangle().fill(Color(red: 0.13, green: 0.04, blue: 0.06))
                        LinearGradient(
                            colors: [
                                Color(red: 0.90, green: 0.10, blue: 0.10).opacity(0.30),
                                Color(red: 0.50, green: 0.05, blue: 0.10).opacity(0.20),
                                .clear
                            ],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        )
                        Rectangle().fill(.thickMaterial).opacity(0.30)
                    }
                }
        }
        .configurationDisplayName("F1 Live")
        .description("Live driver positions during a race weekend, plus the next race countdown.")
        .supportedFamilies([.systemMedium, .systemLarge, .systemExtraLarge])
    }
}

// MARK: - View

struct F1View: View {
    let entry: F1Entry
    @Environment(\.widgetFamily) private var family

    private var f1Red: Color { Color(red: 0.90, green: 0.05, blue: 0.10) }

    private var driverCount: Int {
        switch family {
        case .systemMedium: return 4
        case .systemLarge:  return 8
        default:            return 12
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            header

            if let session = entry.snapshot.session, !entry.snapshot.drivers.isEmpty {
                liveBoard(session: session)
            } else if let next = entry.snapshot.nextRace {
                nextRaceCard(next)
            } else {
                emptyState
            }

            Spacer(minLength: 0)
        }
    }

    @ViewBuilder
    private var header: some View {
        HStack(spacing: 8) {
            ZStack {
                RoundedRectangle(cornerRadius: 6, style: .continuous)
                    .fill(LinearGradient(
                        colors: [Color(red: 1.0, green: 0.20, blue: 0.20),
                                 Color(red: 0.70, green: 0.05, blue: 0.10)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing))
                Image(systemName: "flag.checkered")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundStyle(.white)
            }
            .frame(width: 22, height: 22)
            .shadow(color: .black.opacity(0.25), radius: 2, y: 1)

            Text("F1 Live")
                .font(.system(size: 13, weight: .semibold))

            if let s = entry.snapshot.session, s.isLive {
                LiveDot()
            }

            Spacer()

            if let s = entry.snapshot.session {
                Text("\(s.circuitShortName) • \(s.sessionName)")
                    .font(.system(size: 10.5, weight: .semibold))
                    .foregroundStyle(.secondary)
                    .lineLimit(1)
            } else {
                Text(entry.date, style: .time)
                    .font(.system(size: 12, weight: .medium))
                    .monospacedDigit()
                    .foregroundStyle(.secondary)
            }
        }
    }

    @ViewBuilder
    private func liveBoard(session: F1Session) -> some View {
        VStack(spacing: 0) {
            ForEach(Array(entry.snapshot.drivers.prefix(driverCount).enumerated()),
                    id: \.element.id) { idx, driver in
                if idx > 0 {
                    Divider().opacity(0.45)
                }
                driverRow(driver)
                    .padding(.vertical, 5)
            }
        }
    }

    @ViewBuilder
    private func driverRow(_ driver: F1Driver) -> some View {
        let teamColor = Color(hex: driver.teamColor) ?? .gray
        HStack(spacing: 10) {
            // Position number
            Text(driver.position.map(String.init) ?? "—")
                .font(.system(size: 14, weight: .bold, design: .rounded))
                .frame(width: 22, alignment: .center)
                .monospacedDigit()
                .foregroundStyle(driver.position == 1 ? .yellow : .primary)

            // Team color stripe
            RoundedRectangle(cornerRadius: 2)
                .fill(teamColor)
                .frame(width: 4, height: 22)

            // Driver code
            Text(driver.abbrev)
                .font(.system(size: 13, weight: .heavy))
                .foregroundStyle(.primary)
                .frame(width: 36, alignment: .leading)

            // Team name (small grey)
            Text(driver.teamName)
                .font(.system(size: 10.5, weight: .medium))
                .foregroundStyle(.secondary)
                .lineLimit(1)

            Spacer(minLength: 4)

            // Gap or last lap
            VStack(alignment: .trailing, spacing: 1) {
                if let gap = driver.gapToLeader, gap > 0.001 {
                    Text("+\(formatSeconds(gap))")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundStyle(.secondary)
                        .monospacedDigit()
                } else if driver.position == 1 {
                    Text("LEADER")
                        .font(.system(size: 9, weight: .heavy))
                        .tracking(0.5)
                        .foregroundStyle(.yellow)
                }
                if let lap = driver.lastLap, family != .systemMedium {
                    Text(formatLap(lap))
                        .font(.system(size: 10, weight: .medium, design: .monospaced))
                        .foregroundStyle(.tertiary)
                }
            }
        }
    }

    @ViewBuilder
    private func nextRaceCard(_ next: F1NextRace) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 6) {
                Text("ROUND \(next.round)")
                    .font(.system(size: 9.5, weight: .heavy))
                    .tracking(0.7)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 7).padding(.vertical, 3)
                    .background(f1Red, in: RoundedRectangle(cornerRadius: 5))
                Text(next.country.uppercased())
                    .font(.system(size: 9.5, weight: .heavy))
                    .tracking(0.5)
                    .foregroundStyle(.secondary)
                Spacer()
            }

            Text(next.raceName)
                .font(.system(size: 16, weight: .bold))
                .lineLimit(2)

            Text(next.circuit)
                .font(.system(size: 11, weight: .medium))
                .foregroundStyle(.secondary)

            Spacer(minLength: 4)

            HStack(spacing: 8) {
                Image(systemName: "calendar")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(.secondary)
                Text(next.date, style: .relative)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(.primary)
                Spacer()
                Text(next.date, format: .dateTime.month(.abbreviated).day().year())
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(.tertiary)
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 12, style: .continuous)
                .fill(f1Red.opacity(0.16))
                .overlay(
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .strokeBorder(f1Red.opacity(0.30), lineWidth: 0.5)
                )
        )
    }

    @ViewBuilder
    private var emptyState: some View {
        VStack(spacing: 6) {
            Spacer()
            Image(systemName: "flag.checkered")
                .font(.system(size: 28))
                .foregroundStyle(.tertiary)
            Text("No race info available")
                .font(.caption)
                .foregroundStyle(.secondary)
            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Formatters

    private func formatSeconds(_ s: Double) -> String {
        if s < 60 {
            return String(format: "%.1fs", s)
        }
        let m = Int(s / 60)
        let rem = s - Double(m * 60)
        return String(format: "%dm %.1fs", m, rem)
    }

    private func formatLap(_ s: Double) -> String {
        let m = Int(s / 60)
        let rem = s - Double(m * 60)
        return String(format: "%d:%06.3f", m, rem)
    }
}

private struct LiveDot: View {
    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(Color(red: 0.20, green: 0.78, blue: 0.45))
                .frame(width: 6, height: 6)
            Text("LIVE")
                .font(.system(size: 9.5, weight: .heavy))
                .tracking(0.5)
                .foregroundStyle(Color(red: 0.20, green: 0.78, blue: 0.45))
        }
        .padding(.horizontal, 7)
        .padding(.vertical, 3)
        .background(Capsule().fill(Color(red: 0.20, green: 0.78, blue: 0.45).opacity(0.16)))
    }
}
