import SwiftUI
import WidgetKit

struct SettingsView: View {
    @ObservedObject var sources: SourcesStore = .shared
    @Environment(\.dismiss) private var dismiss
    var onChange: () -> Void = {}

    var body: some View {
        VStack(spacing: 0) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Sources")
                        .font(.system(size: 22, weight: .bold))
                    Text("Pick what shows up in your widgets and reader.")
                        .font(.system(size: 13))
                        .foregroundStyle(.secondary)
                }
                Spacer()
                Button("Done") { dismiss() }
                    .keyboardShortcut(.defaultAction)
            }
            .padding(20)

            Divider()

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    sectionHeader(
                        title: "AI Today",
                        subtitle: "These feed into the AI Today widget.",
                        gradient: LinearGradient(
                            colors: [Color(red: 0.93, green: 0.28, blue: 0.60),
                                     Color(red: 0.66, green: 0.33, blue: 0.97),
                                     Color(red: 0.23, green: 0.51, blue: 0.96)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing),
                        symbol: "sparkles")
                    sourceList(FeedCatalog.aiFeeds)

                    Divider().padding(.vertical, 4)

                    sectionHeader(
                        title: "World News",
                        subtitle: "These feed into the News widget.",
                        gradient: LinearGradient(
                            colors: [Color(red: 1.0, green: 0.35, blue: 0.37),
                                     Color(red: 0.98, green: 0.18, blue: 0.28)],
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing),
                        symbol: "newspaper.fill")
                    sourceList(FeedCatalog.generalFeeds)
                }
                .padding(20)
            }

            Divider()

            HStack {
                Text("Selection is shared with the widgets and applied on next refresh.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Spacer()
                Button {
                    WidgetCenter.shared.reloadAllTimelines()
                    onChange()
                } label: {
                    Label("Refresh now", systemImage: "arrow.clockwise")
                }
            }
            .padding(20)
        }
        .frame(width: 560, height: 640)
        .onChange(of: sources.selectedAI) { _, _ in
            WidgetCenter.shared.reloadAllTimelines()
            onChange()
        }
        .onChange(of: sources.selectedNews) { _, _ in
            WidgetCenter.shared.reloadAllTimelines()
            onChange()
        }
    }

    @ViewBuilder
    private func sectionHeader(title: String, subtitle: String,
                               gradient: LinearGradient, symbol: String) -> some View {
        HStack(spacing: 10) {
            ZStack {
                RoundedRectangle(cornerRadius: 7, style: .continuous).fill(gradient)
                Image(systemName: symbol)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundStyle(.white)
            }
            .frame(width: 28, height: 28)
            VStack(alignment: .leading, spacing: 1) {
                Text(title).font(.system(size: 16, weight: .semibold))
                Text(subtitle).font(.caption).foregroundStyle(.secondary)
            }
        }
    }

    @ViewBuilder
    private func sourceList(_ feeds: [FeedSource]) -> some View {
        VStack(spacing: 6) {
            ForEach(feeds) { feed in
                HStack(spacing: 12) {
                    Image(systemName: feed.icon)
                        .font(.system(size: 13))
                        .frame(width: 22, height: 22)
                        .foregroundStyle(.secondary)
                    VStack(alignment: .leading, spacing: 1) {
                        Text(feed.displayName)
                            .font(.system(size: 13, weight: .medium))
                        Text(feed.url)
                            .font(.system(size: 10, weight: .regular, design: .monospaced))
                            .foregroundStyle(.tertiary)
                            .lineLimit(1)
                    }
                    Spacer()
                    Toggle("", isOn: Binding(
                        get: { sources.isOn(feed) },
                        set: { _ in sources.toggle(feed) }
                    ))
                    .toggleStyle(.switch)
                    .labelsHidden()
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(
                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                        .fill(.regularMaterial)
                        .opacity(0.5)
                )
            }
        }
    }
}

#Preview {
    SettingsView()
}
