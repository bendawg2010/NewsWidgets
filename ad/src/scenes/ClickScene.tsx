import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Wallpaper } from "../components/Wallpaper";
import { MenuBar } from "../components/MenuBar";
import { NewsWidget } from "../widgets/NewsWidget";
import { NEWS_DATA } from "../data";
import { COLORS, FONT_STACK } from "../tokens";

/** Scene 4 — user clicks the news widget; reader window slides up. */
export const ClickScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Cursor moves toward the widget over the first second.
  const cursorProg = interpolate(frame, [0, 0.9 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Click flash + widget tap-down at frame 0.9s
  const tapTime = 0.9 * fps;
  const tapPulse = spring({
    frame: frame - tapTime,
    fps,
    config: { damping: 12, stiffness: 220 },
  });
  const widgetScale = 1 - tapPulse * 0.04 + Math.max(0, (frame - tapTime - 6) / fps) * 0.04;

  // Reader window springs up after click
  const readerSpring = spring({
    frame: frame - tapTime - 4,
    fps,
    config: { damping: 16, stiffness: 95 },
  });
  const readerY = interpolate(readerSpring, [0, 1], [560, 0]);
  const readerOpacity = interpolate(readerSpring, [0, 1], [0, 1]);

  // Widget origin point (left side of screen)
  const widgetOriginX = 580;
  const widgetOriginY = 540;
  // Cursor starts off-screen right
  const cursorX = interpolate(cursorProg, [0, 1], [1700, widgetOriginX + 150]);
  const cursorY = interpolate(cursorProg, [0, 1], [800, widgetOriginY + 80]);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Wallpaper />
      <MenuBar time="9:41" />

      {/* Widget on the left */}
      <div
        style={{
          position: "absolute",
          left: widgetOriginX - 240,
          top: widgetOriginY - 240,
          transform: `scale(${Math.min(1, widgetScale)})`,
          transformOrigin: "center",
        }}
      >
        <NewsWidget {...NEWS_DATA} />
      </div>

      {/* Tap pulse ring */}
      {frame >= tapTime && frame < tapTime + 18 && (
        <div
          style={{
            position: "absolute",
            left: widgetOriginX + 120,
            top: widgetOriginY + 60,
            width: interpolate(frame - tapTime, [0, 18], [20, 220]),
            height: interpolate(frame - tapTime, [0, 18], [20, 220]),
            borderRadius: "50%",
            border: `3px solid ${COLORS.newsRed}`,
            opacity: interpolate(frame - tapTime, [0, 18], [0.9, 0]),
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {/* Reader window */}
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 120,
          width: 760,
          height: 540,
          borderRadius: 18,
          background: "rgba(20,20,22,0.92)",
          backdropFilter: "blur(40px)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,255,255,0.10)",
          transform: `translateY(${readerY}px)`,
          opacity: readerOpacity,
          overflow: "hidden",
          fontFamily: FONT_STACK,
          color: "white",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            padding: "10px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <TrafficLights />
          <div
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 13,
              fontWeight: 600,
              opacity: 0.85,
            }}
          >
            Senate passes sweeping budget framework — Fox News
          </div>
        </div>
        {/* Article */}
        <div style={{ padding: 30 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: COLORS.newsRed,
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            FOX NEWS · POLITICS
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -0.5,
              marginBottom: 16,
            }}
          >
            Senate passes sweeping budget framework after marathon overnight
            session
          </div>
          <div
            style={{
              fontSize: 16,
              lineHeight: 1.55,
              color: COLORS.textSecondary,
            }}
          >
            Lawmakers approved the sweeping framework just before dawn following
            17 hours of debate, marking the first major budget action of the
            session and setting the stage for individual appropriations bills
            in the coming weeks.
          </div>
        </div>
      </div>

      {/* Cursor */}
      <Cursor x={cursorX} y={cursorY} />
    </AbsoluteFill>
  );
};

const TrafficLights: React.FC = () => (
  <div style={{ display: "flex", gap: 6 }}>
    <div style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f57" }} />
    <div style={{ width: 12, height: 12, borderRadius: 6, background: "#febc2e" }} />
    <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28c840" }} />
  </div>
);

const Cursor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg
    width={28}
    height={36}
    viewBox="0 0 28 36"
    style={{
      position: "absolute",
      left: x,
      top: y,
      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.4))",
    }}
  >
    <path
      d="M2 2 L2 26 L9 19 L13 28 L17 26 L13 17 L22 17 Z"
      fill="white"
      stroke="black"
      strokeWidth={1.4}
      strokeLinejoin="round"
    />
  </svg>
);
