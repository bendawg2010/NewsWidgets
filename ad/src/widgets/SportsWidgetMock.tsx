import React from "react";
import { COLORS, FONT_STACK } from "../tokens";

export type SportsGame = {
  league: string;
  leagueColor: string;   // hex
  teams: string;         // "SEA 29 @ NE 13"
  status: string;        // "Final" or "Q3 4:32"
  isLive?: boolean;
};

export const SPORTS_GREEN = "#34C759";

const SPORTS_GRADIENT =
  `linear-gradient(135deg, ${SPORTS_GREEN} 0%, #0d8c47 100%)`;

type Props = {
  games: SportsGame[];
  time: string;
  size?: "large" | "xl";
  liveCount?: number;
};

export const SportsWidgetMock: React.FC<Props> = ({
  games,
  time,
  size = "large",
  liveCount = 0,
}) => {
  const width = size === "xl" ? 720 : 480;
  const height = size === "xl" ? 480 : 480;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 32,
        padding: 22,
        background: COLORS.bgGlass,
        backdropFilter: "blur(48px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 48px rgba(0,0,0,0.55)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        fontFamily: FONT_STACK,
        color: COLORS.textPrimary,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: SPORTS_GRADIENT,
            display: "grid",
            placeItems: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          }}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5.5 15.4c-.4-1.1-1.4-1.9-2.6-2-.4-.4-.6-1-.6-1.6 0-.6.2-1.2.6-1.6 1.2-.1 2.2-.9 2.6-2 .9 1.1 1.5 2.5 1.5 4 0 1.5-.6 2.9-1.5 4zm-11 0C5.6 16.4 5 15 5 13.5c0-1.5.6-2.9 1.5-4 .4 1.1 1.4 1.9 2.6 2 .4.4.6 1 .6 1.6 0 .6-.2 1.2-.6 1.6-1.2.1-2.2.9-2.6 2zM12 4.5c1.5 0 2.9.6 4 1.5-1.1.4-1.9 1.4-2 2.6-.4.4-1 .6-1.6.6-.6 0-1.2-.2-1.6-.6-.1-1.2-.9-2.2-2-2.6 1.1-.9 2.5-1.5 4-1.5z"/>
          </svg>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>Scores</div>
        {liveCount > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 9px",
              borderRadius: 999,
              background: `${SPORTS_GREEN}26`,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: SPORTS_GREEN,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.5,
                color: SPORTS_GREEN,
              }}
            >
              {liveCount} LIVE
            </span>
          </div>
        )}
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.textSecondary,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {time}
        </div>
      </div>

      {/* Game rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
        {games.map((g, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  padding: "4px 7px",
                  borderRadius: 5,
                  background: g.leagueColor,
                  color: "white",
                  width: 46,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {g.league}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{g.teams}</div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: g.isLive ? SPORTS_GREEN : COLORS.textSecondary,
                  }}
                >
                  {g.status}
                </div>
              </div>
              {g.isLive && (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: SPORTS_GREEN,
                  }}
                />
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
