import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";

const SN_GREEN = "#1FA85B";
const SN_GRADIENT = `linear-gradient(135deg, ${SN_GREEN}, #0A6B36)`;

type Sport = {
  abbrev: string;       // SF Symbol-like text glyph
  color: string;
  name: string;
  initiallyOn: boolean;
  flipsAt?: number;     // seconds when toggle flips
};

const SPORTS: Sport[] = [
  { abbrev: "🏈", color: "#013369", name: "NFL — Football",       initiallyOn: true,  flipsAt: undefined },
  { abbrev: "🏀", color: "#C8102E", name: "NBA — Basketball",     initiallyOn: false, flipsAt: 0.9 },
  { abbrev: "⚾", color: "#0E3386", name: "MLB — Baseball",       initiallyOn: true,  flipsAt: undefined },
  { abbrev: "🏒", color: "#000000", name: "NHL — Hockey",         initiallyOn: false, flipsAt: 1.6 },
  { abbrev: "⚽", color: "#3D195B", name: "EPL — Soccer",         initiallyOn: false, flipsAt: 2.3 },
  { abbrev: "🏎️", color: "#E10600", name: "Formula 1",            initiallyOn: false, flipsAt: 3.0 },
  { abbrev: "🏉", color: "#FF8200", name: "College Football",     initiallyOn: true,  flipsAt: undefined },
  { abbrev: "⛳", color: "#006747", name: "PGA — Golf",            initiallyOn: false, flipsAt: undefined },
];

export const SportPickerScene: React.FC<{ vertical?: boolean }> = ({
  vertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sheetSp = spring({ frame, fps, config: { damping: 14, stiffness: 95 } });
  const sheetY = interpolate(sheetSp, [0, 1], [vertical ? 600 : 380, 0]);

  const captionOp = interpolate(frame, [0.4 * fps, 0.9 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{
        background:
          "radial-gradient(1400px 900px at 25% 15%, rgba(31, 168, 91, 0.50), transparent 65%)," +
          "radial-gradient(1200px 800px at 80% 90%, rgba(10, 107, 54, 0.50), transparent 65%)," +
          "linear-gradient(135deg, #032010 0%, #051a10 60%, #02180a 100%)",
      }} />

      {/* Caption */}
      <div style={{
        position: "absolute",
        top: vertical ? 110 : 70,
        left: 0, right: 0, textAlign: "center",
        fontFamily: FONT_STACK, color: "white", opacity: captionOp,
      }}>
        <div style={{ fontSize: vertical ? 64 : 48, fontWeight: 800, letterSpacing: -1.5 }}>
          Pick your sports.
        </div>
        <div style={{
          marginTop: 6, fontSize: vertical ? 30 : 22,
          color: COLORS.textSecondary, fontWeight: 500,
        }}>
          Football, basketball, F1 — only what you actually watch.
        </div>
      </div>

      {/* Settings sheet */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          transform: `translateY(${sheetY}px)`,
          opacity: sheetSp,
          width: vertical ? 880 : 620,
          background: "rgba(28, 28, 30, 0.92)",
          backdropFilter: "blur(40px) saturate(180%)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          padding: vertical ? 28 : 22,
          fontFamily: FONT_STACK, color: "white",
        }}>
          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            paddingBottom: 16,
            borderBottom: "1px solid rgba(255,255,255,0.10)",
            marginBottom: 18,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: SN_GRADIENT,
              display: "grid", placeItems: "center",
            }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="white">
                <path d="M5 4h14v3a4 4 0 0 1-4 4 3 3 0 0 1-3 3 3 3 0 0 1-3-3 4 4 0 0 1-4-4V4z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: vertical ? 22 : 18, fontWeight: 700 }}>Sports</div>
              <div style={{ fontSize: vertical ? 14 : 12, color: COLORS.textSecondary, marginTop: 2 }}>
                Choose what shows up in your widget.
              </div>
            </div>
            <div style={{
              fontSize: vertical ? 14 : 12, fontWeight: 600,
              color: COLORS.textSecondary,
              padding: "5px 11px",
              background: "rgba(255,255,255,0.08)", borderRadius: 6,
            }}>
              Done
            </div>
          </div>

          {/* Sport rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SPORTS.slice(0, vertical ? SPORTS.length : 6).map((s) => (
              <SportRow key={s.name} sport={s} fps={fps} frame={frame} vertical={vertical} />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SportRow: React.FC<{
  sport: Sport;
  fps: number;
  frame: number;
  vertical: boolean;
}> = ({ sport, fps, frame, vertical }) => {
  const flipFrame = sport.flipsAt !== undefined ? sport.flipsAt * fps : null;
  const flipped = flipFrame !== null && frame >= flipFrame;
  const isOn = flipped ? !sport.initiallyOn : sport.initiallyOn;

  const flipProgress = flipFrame === null
    ? (sport.initiallyOn ? 1 : 0)
    : interpolate(
        frame,
        [flipFrame, flipFrame + 8],
        [sport.initiallyOn ? 1 : 0, sport.initiallyOn ? 0 : 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );

  const pulseProgress = flipFrame === null ? 0 :
    interpolate(frame, [flipFrame, flipFrame + 14], [0, 1], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
    });

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: vertical ? "12px 14px" : "10px 12px",
      background: "rgba(255,255,255,0.04)",
      borderRadius: 10,
      border: "0.5px solid rgba(255,255,255,0.05)",
      position: "relative",
    }}>
      <div style={{
        width: vertical ? 40 : 34, height: vertical ? 40 : 34,
        borderRadius: 8,
        background: sport.color,
        display: "grid", placeItems: "center",
        fontSize: vertical ? 22 : 18,
        flexShrink: 0,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
      }}>
        {sport.abbrev}
      </div>
      <div style={{ flex: 1, fontSize: vertical ? 17 : 14, fontWeight: 500 }}>
        {sport.name}
      </div>
      {flipFrame !== null && pulseProgress > 0 && pulseProgress < 1 && (
        <div style={{
          position: "absolute",
          right: vertical ? 24 : 22,
          top: "50%",
          width: vertical ? 50 : 44,
          height: vertical ? 50 : 44,
          borderRadius: "50%",
          border: `2px solid ${isOn ? "#34c759" : "rgba(255,255,255,0.3)"}`,
          transform: `translate(50%, -50%) scale(${interpolate(pulseProgress, [0, 1], [0.5, 1.6])})`,
          opacity: interpolate(pulseProgress, [0, 1], [0.8, 0]),
          pointerEvents: "none",
        }} />
      )}
      <div style={{
        width: vertical ? 50 : 44, height: vertical ? 30 : 26,
        borderRadius: 999,
        background: isOn ? "#34c759" : "rgba(120,120,128,0.4)",
        position: "relative",
        flexShrink: 0,
      }}>
        <div style={{
          position: "absolute",
          top: 2,
          left: interpolate(flipProgress, [0, 1], [2, vertical ? 22 : 20]),
          width: vertical ? 26 : 22,
          height: vertical ? 26 : 22,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
        }} />
      </div>
    </div>
  );
};
