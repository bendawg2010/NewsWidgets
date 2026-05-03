import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Wallpaper } from "../components/Wallpaper";
import { COLORS, FONT_STACK } from "../tokens";

type Source = {
  letter: string;          // initial used as the "logo"
  color: string;           // brand-ish color
  name: string;
  initiallyOn: boolean;    // checked at frame 0
  flipsAt?: number;        // optional — second when its toggle flips
};

const SOURCES: Source[] = [
  { letter: "F",  color: "#003366", name: "Fox News",        initiallyOn: true,  flipsAt: undefined },
  { letter: "C",  color: "#CC0000", name: "CNN",             initiallyOn: false, flipsAt: 0.9 },
  { letter: "B",  color: "#BB1919", name: "BBC",             initiallyOn: true,  flipsAt: undefined },
  { letter: "R",  color: "#FA7900", name: "Reuters",         initiallyOn: false, flipsAt: 1.6 },
  { letter: "N",  color: "#000000", name: "New York Times",  initiallyOn: false, flipsAt: 2.3 },
  { letter: "AP", color: "#D7261E", name: "Associated Press",initiallyOn: true,  flipsAt: undefined },
  { letter: "W",  color: "#000000", name: "Washington Post", initiallyOn: false, flipsAt: 3.0 },
  { letter: "AJ", color: "#FAB511", name: "Al Jazeera",      initiallyOn: false, flipsAt: undefined },
];

type Props = {
  /** Where to anchor the sheet — defaults to centered. */
  vertical?: boolean;
};

export const SourcePickerScene: React.FC<Props> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sheetSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });
  const sheetY = interpolate(sheetSpring, [0, 1], [vertical ? 600 : 380, 0]);
  const sheetOp = interpolate(sheetSpring, [0, 1], [0, 1]);

  const captionOp = interpolate(frame, [0.4 * fps, 0.9 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Wallpaper />

      {/* Caption */}
      <div
        style={{
          position: "absolute",
          top: vertical ? 110 : 70,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_STACK,
          color: "white",
          opacity: captionOp,
        }}
      >
        <div style={{ fontSize: vertical ? 64 : 48, fontWeight: 800, letterSpacing: -1.5 }}>
          Pick your sources.
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: vertical ? 30 : 22,
            color: COLORS.textSecondary,
            fontWeight: 500,
          }}
        >
          Fox, CNN, BBC, Reuters — your call.
        </div>
      </div>

      {/* Settings sheet */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `translateY(${sheetY}px)`,
            opacity: sheetOp,
            width: vertical ? 880 : 620,
            background: "rgba(28, 28, 30, 0.92)",
            backdropFilter: "blur(40px) saturate(180%)",
            borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            padding: vertical ? 28 : 22,
            fontFamily: FONT_STACK,
            color: "white",
          }}
        >
          {/* Sheet header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingBottom: 16,
              borderBottom: "1px solid rgba(255,255,255,0.10)",
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: `linear-gradient(135deg, #FF5A5F, ${COLORS.newsRed})`,
                display: "grid",
                placeItems: "center",
              }}
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="white">
                <path d="M3 5.5C3 4.67 3.67 4 4.5 4h13c.83 0 1.5.67 1.5 1.5V18c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5.5zM5 6v12h12V6H5zm1.5 2h9v1.5h-9V8z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: vertical ? 22 : 18, fontWeight: 700 }}>World News</div>
              <div style={{ fontSize: vertical ? 14 : 12, color: COLORS.textSecondary, marginTop: 2 }}>
                Choose what shows up in your widget.
              </div>
            </div>
            <div
              style={{
                fontSize: vertical ? 14 : 12,
                fontWeight: 600,
                color: COLORS.textSecondary,
                padding: "5px 11px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 6,
              }}
            >
              Done
            </div>
          </div>

          {/* Source rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SOURCES.slice(0, vertical ? SOURCES.length : 6).map((s, i) => (
              <SourceRow
                key={s.name}
                source={s}
                vertical={vertical}
                rowIndex={i}
                fps={fps}
                frame={frame}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SourceRow: React.FC<{
  source: Source;
  vertical: boolean;
  rowIndex: number;
  fps: number;
  frame: number;
}> = ({ source, vertical, rowIndex, fps, frame }) => {
  // Toggle "on" state — flips at the configured time, otherwise stays initial
  const flipFrame = source.flipsAt !== undefined ? source.flipsAt * fps : null;
  const flipped = flipFrame !== null && frame >= flipFrame;
  const isOn = flipped ? !source.initiallyOn : source.initiallyOn;

  // Animate the toggle handle motion + color
  const flipProgress = flipFrame === null
    ? (source.initiallyOn ? 1 : 0)
    : interpolate(frame, [flipFrame, flipFrame + 8], [source.initiallyOn ? 1 : 0, source.initiallyOn ? 0 : 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // Tap pulse on flip
  const pulseProgress = flipFrame === null ? 0 :
    interpolate(frame, [flipFrame, flipFrame + 14], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: vertical ? "12px 14px" : "10px 12px",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 10,
        border: "0.5px solid rgba(255,255,255,0.05)",
        position: "relative",
      }}
    >
      {/* Brand "logo" tile */}
      <div
        style={{
          width: vertical ? 38 : 32,
          height: vertical ? 38 : 32,
          borderRadius: 7,
          background: source.color,
          display: "grid",
          placeItems: "center",
          color: "white",
          fontWeight: 800,
          fontSize: vertical ? 14 : 12,
          letterSpacing: -0.4,
          flexShrink: 0,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        {source.letter}
      </div>
      <div style={{ flex: 1, fontSize: vertical ? 17 : 14, fontWeight: 500 }}>
        {source.name}
      </div>
      {/* Pulse ring on flip */}
      {flipFrame !== null && pulseProgress > 0 && pulseProgress < 1 && (
        <div
          style={{
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
          }}
        />
      )}
      {/* iOS-style toggle */}
      <div
        style={{
          width: vertical ? 50 : 44,
          height: vertical ? 30 : 26,
          borderRadius: 999,
          background: isOn ? "#34c759" : "rgba(120,120,128,0.4)",
          position: "relative",
          transition: "none",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 2,
            left: interpolate(flipProgress, [0, 1], [2, vertical ? 22 : 20]),
            width: vertical ? 26 : 22,
            height: vertical ? 26 : 22,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          }}
        />
      </div>
    </div>
  );
};
