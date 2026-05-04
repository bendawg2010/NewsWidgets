import React from "react";
import { COLORS, FONT_STACK } from "../tokens";

export type ClassRow = {
  index: number;
  time: string;
  name: string;
  room?: string;
  status: "past" | "live" | "upcoming";
  accent: string;
};

export const CS_GRAD_START = "#4F8BFF";
export const CS_GRAD_MID   = "#7B61FF";
export const CS_GRAD_END   = "#C855E8";
export const LIVE_GREEN    = "#34C759";

export const CS_GRADIENT =
  `linear-gradient(135deg, ${CS_GRAD_START} 0%, ${CS_GRAD_MID} 55%, ${CS_GRAD_END} 100%)`;

export const ScheduleWidgetMock: React.FC<{
  rows: ClassRow[];
  cycleLabel: string;
  weekday: string;
  time: string;
  size?: "large" | "xl";
  liveTimeLeft?: string;
}> = ({ rows, cycleLabel, weekday, time, size = "large", liveTimeLeft = "44m" }) => {
  const width = size === "xl" ? 720 : 480;
  const height = size === "xl" ? 480 : 480;

  return (
    <div style={{
      width, height,
      borderRadius: 32,
      padding: 22,
      background: COLORS.bgGlass,
      backdropFilter: "blur(48px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 48px rgba(0,0,0,0.55)",
      display: "flex", flexDirection: "column", gap: 10,
      fontFamily: FONT_STACK, color: COLORS.textPrimary, overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: CS_GRADIENT,
          display: "grid", placeItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
        }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="white">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <rect x="3" y="3" width="18" height="4" rx="2" fill="rgba(0,0,0,0.25)"/>
            <circle cx="16" cy="14" r="3.5" fill={CS_GRAD_START} />
            <path d="M16 11.5v2.5l1.5 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>Class Schedule</div>
          <div style={{ fontSize: 10, fontWeight: 500, color: COLORS.textSecondary }}>
            {weekday} · {cycleLabel}
          </div>
        </div>
        <div style={{
          fontSize: 12, fontWeight: 500,
          color: COLORS.textSecondary,
          fontVariantNumeric: "tabular-nums",
        }}>{time}</div>
      </div>

      {/* Period rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        {rows.map((row) => (
          <PeriodRow key={row.index} row={row} liveTimeLeft={liveTimeLeft} />
        ))}
      </div>
    </div>
  );
};

const PeriodRow: React.FC<{ row: ClassRow; liveTimeLeft: string }> = ({ row, liveTimeLeft }) => {
  const isLive = row.status === "live";
  const isPast = row.status === "past";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "6px 10px",
      borderRadius: 8,
      background: isLive ? `${LIVE_GREEN}22` : "transparent",
      border: isLive ? `0.5px solid ${LIVE_GREEN}50` : "0.5px solid transparent",
      opacity: isPast ? 0.5 : 1,
    }}>
      <div style={{
        width: 4, height: 32, borderRadius: 2,
        background: isLive ? LIVE_GREEN : row.accent,
      }} />
      <div style={{ width: 50 }}>
        <div style={{
          fontSize: 11, fontWeight: 800,
          color: COLORS.textTertiary, lineHeight: 1.1,
        }}>
          {row.index}
        </div>
        <div style={{
          fontSize: 10, fontWeight: 500,
          color: COLORS.textSecondary,
          fontVariantNumeric: "tabular-nums",
        }}>
          {row.time}
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>
            {row.name}
          </span>
          {row.room && (
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 0.4,
              padding: "2px 6px", borderRadius: 999,
              background: "rgba(120,120,128,0.20)",
              color: COLORS.textSecondary,
            }}>
              {row.room}
            </span>
          )}
        </div>
        {isLive && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{
              width: 6, height: 6, borderRadius: 3,
              background: LIVE_GREEN,
              boxShadow: `0 0 6px ${LIVE_GREEN}`,
            }} />
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 0.6,
              color: LIVE_GREEN,
            }}>LIVE NOW</span>
          </div>
        )}
        {isPast && (
          <div style={{ fontSize: 9, fontWeight: 600, color: COLORS.textTertiary }}>
            done
          </div>
        )}
      </div>
      {isLive && (
        <div style={{
          fontSize: 11, fontWeight: 800,
          color: LIVE_GREEN,
          fontVariantNumeric: "tabular-nums",
        }}>
          {liveTimeLeft}
        </div>
      )}
      {isPast && (
        <div style={{ fontSize: 11, color: COLORS.textTertiary }}>✓</div>
      )}
    </div>
  );
};
