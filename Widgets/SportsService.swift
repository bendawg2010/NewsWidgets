import Foundation

/// One game (either in-progress, scheduled, or final).
struct GameScore: Identifiable, Hashable {
    let id: String
    let leagueAbbrev: String        // "NFL", "NBA", "MLB"
    let leagueAccent: String        // hex color string for the league pill
    let homeAbbrev: String
    let awayAbbrev: String
    let homeScore: Int?
    let awayScore: Int?
    let statusShort: String         // "Final", "Q3 4:32", "8:00 PM EDT"
    let isLive: Bool
    let isFinal: Bool
    let date: Date
    let url: URL?

    var displayLine: String {
        let h = homeScore.map(String.init) ?? "-"
        let a = awayScore.map(String.init) ?? "-"
        return "\(awayAbbrev) \(a) @ \(homeAbbrev) \(h)"
    }
}

enum SportsService {

    /// Leagues we pull. ESPN groups its hidden API under sport/league.
    private struct League {
        let sport: String
        let league: String
        let abbrev: String
        let accent: String
    }

    private static let leagues: [League] = [
        League(sport: "football",   league: "nfl",     abbrev: "NFL", accent: "#013369"),
        League(sport: "basketball", league: "nba",     abbrev: "NBA", accent: "#C8102E"),
        League(sport: "baseball",   league: "mlb",     abbrev: "MLB", accent: "#0E3386"),
        League(sport: "hockey",     league: "nhl",     abbrev: "NHL", accent: "#000000"),
        League(sport: "soccer",     league: "eng.1",   abbrev: "EPL", accent: "#3D195B"),
    ]

    static func fetchTopScores(limit: Int = 6) async -> [GameScore] {
        let games = await withTaskGroup(of: [GameScore].self) { group -> [GameScore] in
            for l in leagues {
                group.addTask { await fetchLeague(l) }
            }
            var all: [GameScore] = []
            for await chunk in group { all.append(contentsOf: chunk) }
            return all
        }

        // Priority: live games first → then "final today" → then upcoming today → then later
        return games.sorted { lhs, rhs in
            if lhs.isLive != rhs.isLive { return lhs.isLive }
            if lhs.isFinal != rhs.isFinal { return lhs.isFinal }
            return lhs.date < rhs.date
        }
        .prefix(limit)
        .map { $0 }
    }

    private static func fetchLeague(_ league: League) async -> [GameScore] {
        let urlStr = "https://site.api.espn.com/apis/site/v2/sports/\(league.sport)/\(league.league)/scoreboard"
        guard let url = URL(string: urlStr) else { return [] }
        do {
            var req = URLRequest(url: url)
            req.timeoutInterval = 8
            let (data, _) = try await URLSession.shared.data(for: req)
            return parseEspn(data: data, league: league)
        } catch {
            return []
        }
    }

    // MARK: - ESPN JSON parser (minimal, defensive)

    private static func parseEspn(data: Data, league: League) -> [GameScore] {
        guard let root = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let events = root["events"] as? [[String: Any]]
        else { return [] }

        let iso = ISO8601DateFormatter()
        var out: [GameScore] = []
        for ev in events {
            guard let id = ev["id"] as? String,
                  let comps = ev["competitions"] as? [[String: Any]],
                  let comp = comps.first,
                  let competitors = comp["competitors"] as? [[String: Any]],
                  competitors.count >= 2
            else { continue }

            let home = competitors.first { ($0["homeAway"] as? String) == "home" } ?? competitors[0]
            let away = competitors.first { ($0["homeAway"] as? String) == "away" } ?? competitors[1]

            let homeAbbrev = (home["team"] as? [String: Any])?["abbreviation"] as? String ?? "—"
            let awayAbbrev = (away["team"] as? [String: Any])?["abbreviation"] as? String ?? "—"

            let homeScore = Int(home["score"] as? String ?? "")
            let awayScore = Int(away["score"] as? String ?? "")

            let status = (comp["status"] as? [String: Any])?["type"] as? [String: Any]
            let statusShort = status?["shortDetail"] as? String ?? ""
            let stateName = (status?["state"] as? String) ?? ""
            let isLive = stateName == "in"
            let isFinal = stateName == "post"

            let dateStr = ev["date"] as? String ?? ""
            let date = iso.date(from: dateStr) ?? Date()

            let links = ev["links"] as? [[String: Any]] ?? []
            let urlStr: String? = links
                .first(where: { ($0["rel"] as? [String])?.contains("desktop") == true })?["href"] as? String

            out.append(GameScore(
                id: "\(league.abbrev)-\(id)",
                leagueAbbrev: league.abbrev,
                leagueAccent: league.accent,
                homeAbbrev: homeAbbrev,
                awayAbbrev: awayAbbrev,
                homeScore: homeScore,
                awayScore: awayScore,
                statusShort: statusShort,
                isLive: isLive,
                isFinal: isFinal,
                date: date,
                url: urlStr.flatMap { URL(string: $0) }
            ))
        }
        return out
    }
}
