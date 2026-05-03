import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";
import { F1_RED } from "../widgets/F1WidgetMock";
import { SAMPLE_DRIVERS } from "./F1Scenes";

/**
 * Scripted leaderboard with two staged overtakes for visual drama.
 * Mirrors the look of an F1 TV broadcast tower.
 */
export const F1PositionsScene: React.FC<{ vertical?: boolean }> = ({
  vertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title pop-in
  const titleSp = spring({ frame, fps, config: { damping: 18 } });

  // Two scripted overtakes — each driver swaps position at a frame point
  // Overtake 1: at 1.8s — driver index 2 (P3) jumps to P2, swap with index 1
  // Overtake 2: at 3.5s — driver index 4 (P5) jumps to P3, swap with index 2
  const ot1Frame = Math.round(1.8 * fps);
  const ot2Frame = Math.round(3.5 * fps);

  // Compute current visible position per driver based on overtake state
  const getPos = (driverIdx: number): number => {
    let pos = driverIdx + 1; // initial pos
    if (frame >= ot1Frame) {
      if (driverIdx === 1) pos = 3;        // NOR drops to P3
      if (driverIdx === 2) pos = 2;        // LEC up to P2
    }
    if (frame >= ot2Frame) {
      if (driverIdx === 2) pos = 3;        // LEC drops back to P3
      if (driverIdx === 1) pos = 4;        // NOR drops further to P4
      if (driverIdx === 4) pos = 2;        // HAM jumps to P2
    }
    return pos;
  };

  // For the highlight pulse on a recent overtake
  const highlightFrames = 18;
  const wasJustOvertaken = (driverIdx: number): number => {
    const dist1 = frame - ot1Frame;
    const dist2 = frame - ot2Frame;
    if ([1, 2].includes(driverIdx) && dist1 >= 0 && dist1 < highlightFrames) {
      return 1 - dist1 / highlightFrames;
    }
    if ([1, 2, 4].includes(driverIdx) && dist2 >= 0 && dist2 < highlightFrames) {
      return 1 - dist2 / highlightFrames;
    }
    return 0;
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Backdrop */}
      <AbsoluteFill style={{
        background:
          "radial-gradient(1200px 800px at 30% 30%, rgba(225, 6, 0, 0.40), transparent 60%)," +
          "radial-gradient(1000px 700px at 80% 80%, rgba(120, 10, 10, 0.50), transparent 65%)," +
          "linear-gradient(135deg, #1a0405 0%, #0a0a0a 60%, #200608 100%)",
      }} />

      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        padding: vertical ? "100px 40px 100px" : "70px 60px",
        flexDirection: "column",
        gap: vertical ? 32 : 26,
        fontFamily: FONT_STACK, color: "white",
      }}>
        {/* Title */}
        <div style={{
          opacity: titleSp,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          textAlign: "center",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 13, fontWeight: 800, letterSpacing: 2.5,
            color: F1_RED, textTransform: "uppercase", marginBottom: 8,
          }}>
            <span style={{
              display: "inline-block", width: 10, height: 10,
              borderRadius: "50%", background: "#34c759",
              boxShadow: `0 0 12px #34c759`,
            }} />
            LIVE STANDINGS · POSITION CHANGES
          </div>
          <div style={{
            fontSize: vertical ? 70 : 56,
            fontWeight: 800, letterSpacing: -2, lineHeight: 1.05,
          }}>
            See every overtake.
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{
          width: vertical ? "100%" : 900,
          maxWidth: 980,
          background: "rgba(20, 14, 16, 0.85)",
          borderRadius: 20,
          border: "1px solid rgba(255, 80, 80, 0.18)",
          padding: vertical ? 16 : 20,
          boxShadow: "0 30px 80px rgba(225,6,0,0.20), inset 0 1px 0 rgba(255,255,255,0.06)",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {/* Header row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "44px 6px 60px 1fr 110px 80px",
            gap: 10,
            padding: "8px 12px",
            fontSize: 10, fontWeight: 800, letterSpacing: 1.4,
            color: "rgba(255,255,255,0.45)",
            textTransform: "uppercase",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 4,
          }}>
            <div style={{ textAlign: "center" }}>POS</div>
            <div />
            <div>DRIVER</div>
            <div>TEAM</div>
            <div style={{ textAlign: "right" }}>LAST LAP</div>
            <div style={{ textAlign: "right" }}>GAP</div>
          </div>

          {/* Driver rows */}
          {SAMPLE_DRIVERS.slice(0, vertical ? 6 : 7).map((driver, idx) => {
            const newPos = getPos(idx);
            const rowSpring = spring({
              frame,
              fps,
              config: { damping: 20, stiffness: 110 },
              delay: 6 + idx * 3,
            });
            const opacity = rowSpring;
            const verticalOffset = (newPos - 1) * (vertical ? 56 : 60);
            const justOvertaken = wasJustOvertaken(idx);

            return (
              <div
                key={driver.abbrev}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 6px 60px 1fr 110px 80px",
                  gap: 10,
                  padding: vertical ? "12px 12px" : "14px 12px",
                  alignItems: "center",
                  background: justOvertaken > 0
                    ? `rgba(225, 6, 0, ${justOvertaken * 0.25})`
                    : "rgba(255,255,255,0.02)",
                  borderRadius: 10,
                  position: "absolute",
                  left: vertical ? 16 : 20,
                  right: vertical ? 16 : 20,
                  top: 60 + verticalOffset,
                  opacity,
                  transition: "none",
                  transform: `translateX(${interpolate(rowSpring, [0, 1], [-20, 0])}px)`,
                  border: justOvertaken > 0
                    ? `1px solid rgba(225, 6, 0, ${justOvertaken * 0.6})`
                    : "1px solid transparent",
                }}
              >
                <div style={{
                  fontSize: 22, fontWeight: 800,
                  fontFamily: '"SF Pro Rounded", -apple-system',
                  color: newPos === 1 ? "#FFD60A" : "white",
                  textAlign: "center",
                  fontVariantNumeric: "tabular-nums",
                  transition: "color 0.2s ease",
                }}>
                  {newPos}
                </div>
                <div style={{
                  width: 6, height: 28,
                  background: driver.teamColor,
                  borderRadius: 2,
                }} />
                <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>
                  {driver.abbrev}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.textSecondary }}>
                  {driver.team}
                </div>
                <div style={{
                  fontSize: 14, fontFamily: 'ui-monospace, "SF Mono", monospace',
                  color: COLORS.textSecondary, textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {driver.lastLap}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: newPos === 1 ? "#FFD60A" : COLORS.textSecondary,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {newPos === 1 ? "LEADER" : driver.gap || "—"}
                </div>
                {justOvertaken > 0 && (
                  <div style={{
                    position: "absolute",
                    top: -8, right: 12,
                    fontSize: 9, fontWeight: 800, letterSpacing: 0.7,
                    padding: "3px 7px", borderRadius: 999,
                    background: F1_RED,
                    color: "white",
                    opacity: justOvertaken,
                  }}>
                    OVERTAKE
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
