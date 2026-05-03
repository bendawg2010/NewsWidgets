/**
 * Fetch live ESPN scoreboards + OpenF1 standings RIGHT BEFORE the ads render.
 * Bakes the result into src/live-data.json which the scenes import.
 *
 * Run: npx tsx ad/scripts/fetch-live-data.ts
 */
import { writeFileSync } from "fs";
import { join } from "path";

type Game = {
  league: string;
  leagueColor: string;
  awayAbbrev: string;
  homeAbbrev: string;
  awayScore: number | null;
  homeScore: number | null;
  status: string;
  isLive: boolean;
  isFinal: boolean;
};

type Driver = {
  pos: number;
  abbrev: string;
  team: string;
  teamColor: string;
  lastLap: string;
  gap: string;
};

const ESPN_LEAGUES = [
  { sport: "football",   league: "nfl",   abbrev: "NFL", color: "#013369" },
  { sport: "basketball", league: "nba",   abbrev: "NBA", color: "#C8102E" },
  { sport: "baseball",   league: "mlb",   abbrev: "MLB", color: "#0E3386" },
  { sport: "hockey",     league: "nhl",   abbrev: "NHL", color: "#000000" },
  { sport: "soccer",     league: "eng.1", abbrev: "EPL", color: "#3D195B" },
];

async function fetchEspn(): Promise<Game[]> {
  const all: Game[] = [];
  await Promise.all(ESPN_LEAGUES.map(async (l) => {
    try {
      const r = await fetch(
        `https://site.api.espn.com/apis/site/v2/sports/${l.sport}/${l.league}/scoreboard`,
      );
      if (!r.ok) return;
      const data: any = await r.json();
      for (const ev of (data.events || [])) {
        const comp = ev.competitions?.[0];
        if (!comp) continue;
        const home = comp.competitors?.find((c: any) => c.homeAway === "home");
        const away = comp.competitors?.find((c: any) => c.homeAway === "away");
        const status = comp.status?.type;
        if (!home || !away || !status) continue;
        all.push({
          league: l.abbrev,
          leagueColor: l.color,
          awayAbbrev: away.team.abbreviation,
          homeAbbrev: home.team.abbreviation,
          awayScore: away.score ? parseInt(away.score, 10) : null,
          homeScore: home.score ? parseInt(home.score, 10) : null,
          status: status.shortDetail || status.detail || "",
          isLive: status.state === "in",
          isFinal: status.state === "post",
        });
      }
    } catch (e) {
      console.error(`ESPN ${l.league} failed:`, e);
    }
  }));

  // Sort: live > today scheduled > final > rest, take 4-6
  return all
    .sort((a, b) => {
      if (a.isLive !== b.isLive) return a.isLive ? -1 : 1;
      if (a.isFinal !== b.isFinal) return a.isFinal ? 1 : -1;
      return 0;
    })
    .slice(0, 6);
}

async function fetchF1(): Promise<{ drivers: Driver[]; circuit: string; sessionName: string; isLive: boolean }> {
  try {
    const sessionR = await fetch("https://api.openf1.org/v1/sessions?session_key=latest");
    const sessions: any[] = await sessionR.json();
    const session = sessions[0] || {};
    const circuit = session.circuit_short_name || "Unknown";
    const sessionName = session.session_name || "Session";
    const start = session.date_start ? new Date(session.date_start).getTime() : 0;
    const end = session.date_end ? new Date(session.date_end).getTime() : 0;
    const now = Date.now();
    const isLive = start > 0 && end > 0 && now >= start && now <= end;

    // Drivers
    const driversR = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
    const driverList: any[] = await driversR.json();
    const driverMap: Record<number, { abbrev: string; team: string; teamColor: string }> = {};
    for (const d of driverList) {
      driverMap[d.driver_number] = {
        abbrev: d.name_acronym || "—",
        team: d.team_name || "—",
        teamColor: "#" + (d.team_colour || "888888"),
      };
    }

    // Latest position per driver
    const posR = await fetch("https://api.openf1.org/v1/position?session_key=latest");
    const positions: any[] = await posR.json();
    const latestPos: Record<number, number> = {};
    for (const p of positions) {
      latestPos[p.driver_number] = p.position;
    }

    // Latest lap per driver — laps payload is large, can be slow
    const latestLap: Record<number, { duration: number | null; lap: number }> = {};
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 25000);
      const lapR = await fetch("https://api.openf1.org/v1/laps?session_key=latest", {
        signal: ctrl.signal,
      });
      clearTimeout(t);
      const laps: any = await lapR.json();
      if (Array.isArray(laps)) {
        for (const l of laps) {
          const prev = latestLap[l.driver_number]?.lap ?? -1;
          if ((l.lap_number || 0) >= prev) {
            latestLap[l.driver_number] = { duration: l.lap_duration ?? null, lap: l.lap_number || 0 };
          }
        }
      }
    } catch (e) {
      console.error("OpenF1 laps timed out, falling back to no lap times");
    }

    // Build sorted drivers
    const merged: Driver[] = Object.entries(latestPos)
      .map(([numStr, pos]) => {
        const num = parseInt(numStr, 10);
        const d = driverMap[num];
        if (!d) return null;
        const lap = latestLap[num];
        return {
          pos,
          abbrev: d.abbrev,
          team: d.team,
          teamColor: d.teamColor,
          lastLap: lap?.duration ? formatLap(lap.duration) : "—",
          gap: pos === 1 ? "LEADER" : "",
        } as Driver;
      })
      .filter((x): x is Driver => x !== null)
      .sort((a, b) => a.pos - b.pos);

    // Compute gap to leader from last laps (best-effort)
    const leaderLap = merged.find((d) => d.pos === 1);
    if (leaderLap?.lastLap !== "—") {
      const leaderSec = parseLap(leaderLap!.lastLap);
      for (const d of merged) {
        if (d.pos === 1) continue;
        if (d.lastLap === "—") continue;
        const sec = parseLap(d.lastLap);
        const diff = sec - leaderSec;
        if (diff > 0.001) d.gap = `+${diff.toFixed(3)}s`;
      }
    }

    return {
      drivers: merged.slice(0, 8),
      circuit,
      sessionName,
      isLive,
    };
  } catch (e) {
    console.error("OpenF1 failed:", e);
    return { drivers: [], circuit: "—", sessionName: "—", isLive: false };
  }
}

function formatLap(s: number): string {
  const m = Math.floor(s / 60);
  const rem = s - m * 60;
  return `${m}:${rem.toFixed(3).padStart(6, "0")}`;
}
function parseLap(s: string): number {
  const [m, r] = s.split(":");
  return parseInt(m, 10) * 60 + parseFloat(r);
}

(async () => {
  const [espn, f1] = await Promise.all([fetchEspn(), fetchF1()]);
  const out = {
    fetchedAt: new Date().toISOString(),
    espn,
    f1,
  };
  const path = join(__dirname, "..", "src", "live-data.json");
  writeFileSync(path, JSON.stringify(out, null, 2));
  console.log(`✓ Wrote live data to ${path}`);
  console.log(`  ESPN: ${espn.length} games (${espn.filter(g => g.isLive).length} live)`);
  console.log(`  F1: ${f1.drivers.length} drivers @ ${f1.circuit} ${f1.sessionName} (live: ${f1.isLive})`);
})();
