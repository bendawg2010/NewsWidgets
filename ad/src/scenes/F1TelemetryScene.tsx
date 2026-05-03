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

const F1_GRADIENT = `linear-gradient(135deg, #FF3333 0%, ${F1_RED} 100%)`;

/**
 * Big-data telemetry showcase. Six panels, each demoing one OpenF1 datapoint
 * the widget consumes. Values animate on a tight loop so it feels live.
 */
export const F1TelemetryScene: React.FC<{ vertical?: boolean }> = ({
  vertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSp = spring({ frame, fps, config: { damping: 18 } });
  const captionOp = interpolate(frame, [1.4 * fps, 2.0 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Drive the live-update feel
  const t = frame / fps;

  const speed = 280 + Math.round(60 * Math.sin(t * 1.4) + 30 * Math.sin(t * 3.7));
  const throttlePct = Math.round(60 + 40 * (Math.sin(t * 1.8) * 0.5 + 0.5));
  const brakePct = Math.max(0, Math.round(80 * Math.max(0, Math.sin(t * 1.4 + Math.PI))));
  const gear = Math.max(2, Math.min(8, Math.round(2 + 6 * (Math.sin(t * 1.4) * 0.5 + 0.5))));
  const rpm = 8000 + Math.round(3500 * (Math.sin(t * 1.4) * 0.5 + 0.5));
  const lapMs = 90.512 + (Math.sin(t * 0.6)) * 0.45;
  const gapToLeader = Math.max(0.05, 0.4 + Math.sin(t * 0.5) * 0.15);
  const lapNumber = 38 + Math.floor((frame % 200) / 200);
  const trackTempC = 38 + Math.round(Math.sin(t * 0.3) * 2);

  const fmt = (n: number, w: number = 0) =>
    n.toFixed(w).padStart(w === 0 ? 0 : 0, "0");

  const fmtLap = (s: number) => {
    const m = Math.floor(s / 60);
    const rem = s - m * 60;
    return `${m}:${rem.toFixed(3).padStart(6, "0")}`;
  };

  const panels: Array<{ label: string; value: string; unit?: string; accent?: boolean }> = [
    { label: "SPEED",     value: `${speed}`,           unit: "KM/H" },
    { label: "GEAR",      value: `${gear}`,            unit: "" },
    { label: "THROTTLE",  value: `${throttlePct}`,     unit: "%" },
    { label: "BRAKE",     value: `${brakePct}`,        unit: "%" },
    { label: "RPM",       value: `${rpm.toLocaleString()}`, unit: "" },
    { label: "LAST LAP",  value: fmtLap(lapMs),        unit: "" },
    { label: "GAP",       value: `+${gapToLeader.toFixed(3)}`, unit: "S", accent: true },
    { label: "LAP",       value: `${lapNumber}/57`,    unit: "" },
    { label: "TRACK",     value: `${trackTempC}`,      unit: "°C" },
  ];

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
        flexDirection: "column", padding: 60, gap: vertical ? 36 : 28,
        fontFamily: FONT_STACK, color: "white",
      }}>
        {/* Title */}
        <div style={{
          opacity: titleSp,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 13, fontWeight: 800, letterSpacing: 2.5,
            color: F1_RED, textTransform: "uppercase", marginBottom: 6,
          }}>
            POWERED BY OPENF1 · LIVE TELEMETRY
          </div>
          <div style={{
            fontSize: vertical ? 70 : 56,
            fontWeight: 800, letterSpacing: -2, lineHeight: 1.05,
          }}>
            Every datapoint, live.
          </div>
        </div>

        {/* Telemetry grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: vertical ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
          gap: vertical ? 18 : 22,
          width: vertical ? 940 : 1200,
        }}>
          {panels.map((p, i) => (
            <TelemetryPanel
              key={p.label}
              label={p.label}
              value={p.value}
              unit={p.unit}
              accent={p.accent}
              delay={i * 4}
              vertical={vertical}
            />
          ))}
        </div>

        {/* Caption */}
        <div style={{
          opacity: captionOp,
          transform: `translateY(${interpolate(captionOp, [0, 1], [12, 0])}px)`,
          color: COLORS.textSecondary,
          fontSize: vertical ? 28 : 22,
          fontWeight: 500,
          textAlign: "center",
        }}>
          Speed · gear · throttle · brake · RPM · lap times · gaps · weather
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TelemetryPanel: React.FC<{
  label: string;
  value: string;
  unit?: string;
  accent?: boolean;
  delay: number;
  vertical: boolean;
}> = ({ label, value, unit, accent, delay, vertical }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  // Subtle pulse so the value feels live
  const pulse = (Math.sin(frame / fps * 4) * 0.5 + 0.5) * 0.04 + 0.96;

  return (
    <div style={{
      opacity: sp,
      transform: `translateY(${interpolate(sp, [0, 1], [20, 0])}px) scale(${interpolate(sp, [0, 1], [0.95, 1])})`,
      background: "rgba(20, 14, 16, 0.80)",
      border: `1px solid ${accent ? "rgba(255,80,80,0.40)" : "rgba(255,255,255,0.08)"}`,
      borderRadius: 16,
      padding: vertical ? "16px 20px" : "20px 24px",
      boxShadow: accent
        ? "0 12px 32px rgba(225, 6, 0, 0.22), inset 0 1px 0 rgba(255,255,255,0.06)"
        : "0 12px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Accent stripe */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, height: 2,
        background: accent ? F1_GRADIENT : "rgba(255,255,255,0.10)",
      }} />

      {/* Label */}
      <div style={{
        fontSize: vertical ? 11 : 12,
        fontWeight: 800, letterSpacing: 1.4,
        color: accent ? "#FF7A7A" : "rgba(255,255,255,0.55)",
        textTransform: "uppercase",
        marginBottom: vertical ? 8 : 10,
      }}>
        {label}
      </div>

      {/* Value */}
      <div style={{
        display: "flex",
        alignItems: "baseline",
        gap: 6,
        transform: `scale(${pulse})`,
        transformOrigin: "left bottom",
      }}>
        <span style={{
          fontSize: vertical ? 42 : 56,
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontWeight: 800,
          letterSpacing: -2,
          color: accent ? "#FFD60A" : "white",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1,
        }}>
          {value}
        </span>
        {unit && (
          <span style={{
            fontSize: vertical ? 16 : 20,
            fontWeight: 700,
            color: COLORS.textSecondary,
            letterSpacing: 0.5,
          }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
