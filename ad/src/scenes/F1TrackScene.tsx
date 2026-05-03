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

/**
 * Hand-traced approximation of the Miami International Autodrome.
 * Drawn at viewBox 0 0 800 460 — used both as the visible track
 * and as the path along which driver dots travel.
 */
const TRACK_PATH =
  "M 90 280 " +
  "L 280 280 " +
  "C 320 280 350 270 360 240 " +
  "L 380 200 " +
  "C 400 160 440 150 470 170 " +
  "L 540 220 " +
  "C 560 235 580 240 600 240 " +
  "L 700 240 " +
  "C 730 240 745 250 745 280 " +
  "L 745 350 " +
  "C 745 380 720 395 690 395 " +
  "L 200 395 " +
  "C 130 395 90 365 90 320 " +
  "Z";

type TeamColor = { abbrev: string; color: string };

const DRIVERS: TeamColor[] = [
  { abbrev: "VER", color: "#3671C6" },
  { abbrev: "NOR", color: "#FF8000" },
  { abbrev: "LEC", color: "#E80020" },
  { abbrev: "PIA", color: "#FF8000" },
  { abbrev: "HAM", color: "#27F4D2" },
  { abbrev: "RUS", color: "#27F4D2" },
  { abbrev: "SAI", color: "#E80020" },
];

export const F1TrackScene: React.FC<{ vertical?: boolean }> = ({
  vertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Title fade-in
  const titleSp = spring({ frame, fps, config: { damping: 18 } });
  const trackSp = spring({ frame: frame - 0.3 * fps, fps, config: { damping: 16 } });
  const captionOp = interpolate(frame, [1.4 * fps, 2.0 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Each driver progresses around the loop; lap takes ~6 seconds for visual punch
  const lapFrames = 6 * fps;
  const baseProgress = (frame % lapFrames) / lapFrames;

  // Use the underlying SVG path's getTotalLength via a hidden ref hack? We can't
  // call DOM methods inside the Remotion renderer reliably across compositions,
  // so we approximate: precompute control points along the loop using a closed
  // bezier sampler. Simpler — measure once in a memoized off-DOM SVG.
  const totalLength = React.useMemo(() => {
    if (typeof document === "undefined") return 2200;  // SSR fallback estimate
    const ns = "http://www.w3.org/2000/svg";
    const tmp = document.createElementNS(ns, "path");
    tmp.setAttribute("d", TRACK_PATH);
    return tmp.getTotalLength();
  }, []);

  // Precompute cached point-at-length lookups to keep frame work cheap
  const points = React.useMemo<Array<{ x: number; y: number }>>(() => {
    if (typeof document === "undefined") {
      return Array.from({ length: 200 }, (_, i) => ({
        x: 400 + Math.cos((i / 200) * Math.PI * 2) * 280,
        y: 280 + Math.sin((i / 200) * Math.PI * 2) * 100,
      }));
    }
    const ns = "http://www.w3.org/2000/svg";
    const tmp = document.createElementNS(ns, "path");
    tmp.setAttribute("d", TRACK_PATH);
    const len = tmp.getTotalLength();
    return Array.from({ length: 400 }, (_, i) => {
      const p = tmp.getPointAtLength((i / 400) * len);
      return { x: p.x, y: p.y };
    });
  }, []);

  const pointAt = (frac: number) => {
    const f = ((frac % 1) + 1) % 1;
    const idx = Math.floor(f * points.length) % points.length;
    return points[idx];
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Subtle dark red tint backdrop */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(1200px 800px at 30% 30%, rgba(225, 6, 0, 0.40), transparent 60%)," +
            "radial-gradient(1000px 700px at 80% 80%, rgba(120, 10, 10, 0.45), transparent 65%)," +
            "linear-gradient(135deg, #1a0405 0%, #0a0a0a 60%, #200608 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: 60,
          flexDirection: "column",
          gap: vertical ? 36 : 28,
        }}
      >
        {/* Title */}
        <div
          style={{
            opacity: titleSp,
            transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
            textAlign: "center",
            fontFamily: FONT_STACK,
            color: "white",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 2.5,
              color: F1_RED,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            ROUND 6 · MIAMI · LAP 38 / 57
          </div>
          <div
            style={{
              fontSize: vertical ? 70 : 56,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Live on the track.
          </div>
        </div>

        {/* SVG track */}
        <div
          style={{
            width: vertical ? 920 : 1100,
            height: vertical ? 540 : 600,
            background: "rgba(20, 14, 16, 0.85)",
            border: `1px solid rgba(255, 80, 80, 0.18)`,
            borderRadius: 28,
            padding: 24,
            transform: `scale(${interpolate(trackSp, [0, 1], [0.95, 1])})`,
            opacity: trackSp,
            boxShadow: "0 30px 80px rgba(225,6,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <svg
            viewBox="0 0 800 460"
            width="100%"
            height="100%"
            style={{ display: "block" }}
          >
            {/* Glow underneath */}
            <defs>
              <filter id="trackGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer track stroke (asphalt) */}
            <path
              d={TRACK_PATH}
              fill="none"
              stroke="#2a2a30"
              strokeWidth={36}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Inner track stroke (lighter asphalt) */}
            <path
              d={TRACK_PATH}
              fill="none"
              stroke="#3a3a44"
              strokeWidth={28}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Centre line — dashed */}
            <path
              d={TRACK_PATH}
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth={1.5}
              strokeDasharray="6 10"
              strokeLinejoin="round"
            />
            {/* Start/finish line */}
            <line
              x1="90"
              y1="262"
              x2="90"
              y2="298"
              stroke="white"
              strokeWidth={4}
              strokeDasharray="3 3"
            />
            <text
              x="100"
              y="252"
              fill="rgba(255,255,255,0.6)"
              fontSize={11}
              fontFamily={FONT_STACK}
              fontWeight={700}
              letterSpacing={1}
            >
              START / FINISH
            </text>

            {/* Driver dots */}
            {DRIVERS.map((d, i) => {
              const offset = i * 0.07;          // initial spacing
              const speedMod = 1 + i * 0.005;   // slightly different speeds
              const progress = baseProgress * speedMod + offset;
              const p = pointAt(progress);
              return (
                <g key={d.abbrev} filter="url(#trackGlow)">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={9}
                    fill={d.color}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                  <text
                    x={p.x}
                    y={p.y - 16}
                    fill="white"
                    fontSize={10}
                    fontFamily={FONT_STACK}
                    fontWeight={800}
                    textAnchor="middle"
                    style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.85)", strokeWidth: 3 } as any}
                  >
                    {d.abbrev}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Caption */}
        <div
          style={{
            opacity: captionOp,
            transform: `translateY(${interpolate(captionOp, [0, 1], [12, 0])}px)`,
            fontFamily: FONT_STACK,
            color: COLORS.textSecondary,
            fontSize: vertical ? 28 : 22,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Watch every car move in real time, right on your desktop.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
