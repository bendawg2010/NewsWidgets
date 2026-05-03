import React from "react";
import { COLORS, FONT_STACK } from "../tokens";

export type F1Driver = {
  pos: number;
  abbrev: string;
  team: string;
  teamColor: string;     // hex
  lastLap?: string;      // "1:31.504"
  gap?: string;          // "+2.4s" or "LEADER"
};

export const F1_RED = "#E10600";

const F1_GRADIENT = `linear-gradient(135deg, #FF3333 0%, ${F1_RED} 100%)`;

type Props = {
  drivers: F1Driver[];
  circuit: string;       // "Miami GP"
  sessionName: string;   // "Race"
  size?: "large" | "xl";
  isLive?: boolean;
};

export const F1WidgetMock: React.FC<Props> = ({
  drivers,
  circuit,
  sessionName,
  size = "large",
  isLive = true,
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
            background: F1_GRADIENT,
            display: "grid",
            placeItems: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          }}
        >
          {/* Checkered flag */}
          <svg width={14} height={14} viewBox="0 0 24 24" fill="white">
            <path d="M5 3v18h2v-7h12V3H5zm4 9H7V9h2v3zm0-3V6h2v3H9zm0 3h2v3H9v-3zm4 0h-2V9h2v3zm0-3V6h2v3h-2zm0 6V12h2v3h-2zm4-3h-2V9h2v3zm0-3V6h2v3h-2z"/>
          </svg>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>F1 Live</div>
        {isLive && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 9px",
              borderRadius: 999,
              background: `#34C75926`,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#34C759",
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.5,
                color: "#34C759",
              }}
            >
              LIVE
            </span>
          </div>
        )}
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.textSecondary,
          }}
        >
          {circuit} • {sessionName}
        </div>
      </div>

      {/* Driver rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, flex: 1 }}>
        {drivers.map((d, i) => (
          <React.Fragment key={d.abbrev}>
            {i > 0 && (
              <div style={{ height: 1, background: "rgba(255,255,255,0.08)" }} />
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  fontFamily: '"SF Pro Rounded", -apple-system, system-ui',
                  width: 26,
                  textAlign: "center",
                  color: d.pos === 1 ? "#FFD60A" : "#fff",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {d.pos}
              </div>
              <div
                style={{
                  width: 5,
                  height: 26,
                  borderRadius: 2,
                  background: d.teamColor,
                  flexShrink: 0,
                }}
              />
              <div style={{ fontSize: 15, fontWeight: 800, width: 50 }}>
                {d.abbrev}
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: COLORS.textSecondary,
                  flex: 1,
                }}
              >
                {d.team}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 1,
                }}
              >
                <div
                  style={{
                    fontSize: d.gap === "LEADER" ? 10 : 13,
                    fontWeight: d.gap === "LEADER" ? 800 : 600,
                    color: d.gap === "LEADER" ? "#FFD60A" : COLORS.textSecondary,
                    letterSpacing: d.gap === "LEADER" ? 0.5 : 0,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {d.gap || ""}
                </div>
                {d.lastLap && (
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: 'ui-monospace, "SF Mono", monospace',
                      color: COLORS.textTertiary,
                    }}
                  >
                    {d.lastLap}
                  </div>
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
