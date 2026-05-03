import Foundation

// MARK: - Models

struct F1Driver: Identifiable, Hashable {
    let id: Int                  // driver_number
    let abbrev: String           // "VER"
    let fullName: String         // "Max VERSTAPPEN"
    let teamName: String
    let teamColor: String        // hex
    let position: Int?
    let lastLap: Double?         // seconds
    let gapToLeader: Double?     // seconds
}

struct F1Session: Hashable {
    let sessionKey: Int
    let sessionName: String      // "Race", "Qualifying", etc.
    let circuitShortName: String // "Miami"
    let countryName: String      // "United States"
    let dateStart: Date
    let dateEnd: Date
    var isLive: Bool {
        let now = Date()
        return now >= dateStart && now <= dateEnd
    }
}

struct F1NextRace: Hashable {
    let raceName: String
    let circuit: String
    let country: String
    let date: Date
    let round: Int
}

struct F1Snapshot: Hashable {
    let session: F1Session?
    let drivers: [F1Driver]
    let nextRace: F1NextRace?
}

// MARK: - Service

enum F1Service {

    private static let openF1 = "https://api.openf1.org/v1"
    private static let ergast = "https://api.jolpi.ca/ergast/f1"

    // -- Public entrypoint -----------------------------------------------

    static func fetchSnapshot() async -> F1Snapshot {
        async let session = fetchLatestSession()
        async let drivers = fetchDrivers()
        async let positions = fetchLatestPositions()
        async let laps = fetchLatestLaps()
        async let nextRace = fetchNextRace()

        let s = await session
        let driverList = await drivers
        let posMap = await positions
        let lapMap = await laps

        // Compute gap to leader from most recent lap_duration accumulator.
        // Without sector data this is a coarse proxy: difference in last lap times.
        let leaderLap = lapMap.values.compactMap { $0.duration }.min()

        let merged: [F1Driver] = driverList.map { d in
            let pos = posMap[d.id]
            let lap = lapMap[d.id]
            let gap: Double? = {
                guard let l = lap?.duration, let leader = leaderLap, l >= leader else { return nil }
                return l - leader
            }()
            return F1Driver(
                id: d.id,
                abbrev: d.abbrev,
                fullName: d.fullName,
                teamName: d.teamName,
                teamColor: d.teamColor,
                position: pos,
                lastLap: lap?.duration,
                gapToLeader: gap
            )
        }
        .sorted { ($0.position ?? 999) < ($1.position ?? 999) }

        return F1Snapshot(session: s, drivers: merged, nextRace: await nextRace)
    }

    // -- Session ---------------------------------------------------------

    private static func fetchLatestSession() async -> F1Session? {
        guard let url = URL(string: "\(openF1)/sessions?session_key=latest") else { return nil }
        do {
            var req = URLRequest(url: url); req.timeoutInterval = 8
            let (data, _) = try await URLSession.shared.data(for: req)
            guard let arr = try JSONSerialization.jsonObject(with: data) as? [[String: Any]],
                  let raw = arr.first
            else { return nil }
            let iso = ISO8601DateFormatter()
            iso.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
            return F1Session(
                sessionKey: raw["session_key"] as? Int ?? 0,
                sessionName: raw["session_name"] as? String ?? "Session",
                circuitShortName: raw["circuit_short_name"] as? String ?? "—",
                countryName: raw["country_name"] as? String ?? "",
                dateStart: parseDate(raw["date_start"]) ?? Date.distantPast,
                dateEnd: parseDate(raw["date_end"]) ?? Date.distantFuture
            )
        } catch { return nil }
    }

    private static func parseDate(_ any: Any?) -> Date? {
        guard let s = any as? String else { return nil }
        let isoFrac = ISO8601DateFormatter()
        isoFrac.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return isoFrac.date(from: s) ?? ISO8601DateFormatter().date(from: s)
    }

    // -- Drivers ---------------------------------------------------------

    private struct LatestDriver {
        let id: Int; let abbrev: String; let fullName: String
        let teamName: String; let teamColor: String
    }

    private static func fetchDrivers() async -> [LatestDriver] {
        guard let url = URL(string: "\(openF1)/drivers?session_key=latest") else { return [] }
        do {
            var req = URLRequest(url: url); req.timeoutInterval = 8
            let (data, _) = try await URLSession.shared.data(for: req)
            guard let arr = try JSONSerialization.jsonObject(with: data) as? [[String: Any]]
            else { return [] }
            return arr.compactMap { d in
                guard let num = d["driver_number"] as? Int else { return nil }
                return LatestDriver(
                    id: num,
                    abbrev: d["name_acronym"] as? String ?? "—",
                    fullName: d["full_name"] as? String ?? "Driver",
                    teamName: d["team_name"] as? String ?? "",
                    teamColor: (d["team_colour"] as? String).map { "#" + $0 } ?? "#888888"
                )
            }
        } catch { return [] }
    }

    // -- Positions: most recent per driver -------------------------------

    private static func fetchLatestPositions() async -> [Int: Int] {
        guard let url = URL(string: "\(openF1)/position?session_key=latest") else { return [:] }
        do {
            var req = URLRequest(url: url); req.timeoutInterval = 10
            let (data, _) = try await URLSession.shared.data(for: req)
            guard let arr = try JSONSerialization.jsonObject(with: data) as? [[String: Any]]
            else { return [:] }
            // Iterate forward — last one wins per driver (the API returns chronological)
            var out: [Int: Int] = [:]
            for r in arr {
                guard let num = r["driver_number"] as? Int,
                      let pos = r["position"] as? Int else { continue }
                out[num] = pos
            }
            return out
        } catch { return [:] }
    }

    // -- Laps: most recent per driver ------------------------------------

    private struct LapInfo { let duration: Double?; let lapNumber: Int }

    private static func fetchLatestLaps() async -> [Int: LapInfo] {
        guard let url = URL(string: "\(openF1)/laps?session_key=latest") else { return [:] }
        do {
            var req = URLRequest(url: url); req.timeoutInterval = 10
            let (data, _) = try await URLSession.shared.data(for: req)
            guard let arr = try JSONSerialization.jsonObject(with: data) as? [[String: Any]]
            else { return [:] }
            var out: [Int: LapInfo] = [:]
            for r in arr {
                guard let num = r["driver_number"] as? Int else { continue }
                let lap = r["lap_number"] as? Int ?? 0
                let dur = r["lap_duration"] as? Double
                let prev = out[num]?.lapNumber ?? -1
                if lap >= prev {
                    out[num] = LapInfo(duration: dur, lapNumber: lap)
                }
            }
            return out
        } catch { return [:] }
    }

    // -- Next race (when there's no live session) ------------------------

    private static func fetchNextRace() async -> F1NextRace? {
        guard let url = URL(string: "\(ergast)/current.json") else { return nil }
        do {
            var req = URLRequest(url: url); req.timeoutInterval = 8
            let (data, _) = try await URLSession.shared.data(for: req)
            guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let mr = json["MRData"] as? [String: Any],
                  let table = mr["RaceTable"] as? [String: Any],
                  let races = table["Races"] as? [[String: Any]]
            else { return nil }
            let df = DateFormatter()
            df.dateFormat = "yyyy-MM-dd"
            df.timeZone = TimeZone(identifier: "UTC")
            df.locale = Locale(identifier: "en_US_POSIX")

            let now = Date()
            for r in races {
                guard let dateStr = r["date"] as? String,
                      let d = df.date(from: dateStr) else { continue }
                if d >= now {
                    let circuit = (r["Circuit"] as? [String: Any])?["circuitName"] as? String ?? ""
                    let country = ((r["Circuit"] as? [String: Any])?["Location"] as? [String: Any])?["country"] as? String ?? ""
                    return F1NextRace(
                        raceName: r["raceName"] as? String ?? "Next Race",
                        circuit: circuit,
                        country: country,
                        date: d,
                        round: Int(r["round"] as? String ?? "") ?? 0
                    )
                }
            }
            return nil
        } catch { return nil }
    }
}
