import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";
import { Wallpaper } from "../components/Wallpaper";

export const VerticalHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t1 = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const t2 = spring({
    frame: frame - 0.4 * fps, fps,
    config: { damping: 18 },
  });
  const t3 = spring({
    frame: frame - 0.8 * fps, fps,
    config: { damping: 20 },
  });

  const cursorBlink = Math.floor(frame / (0.5 * fps)) % 2 === 0 ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Wallpaper />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_STACK,
          color: "white",
          padding: 60,
        }}
      >
        <div
          style={{
            transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
            opacity: t1,
            fontSize: 180,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          Today,
        </div>
        <div
          style={{
            marginTop: 24,
            transform: `translateY(${interpolate(t2, [0, 1], [30, 0])}px)`,
            opacity: t2,
            fontSize: 180,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 1,
            textAlign: "center",
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <span
            style={{
              background: `linear-gradient(135deg, ${COLORS.aiPink}, ${COLORS.aiPurple} 60%, ${COLORS.aiBlue})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            summarized.
          </span>
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 150,
              background: COLORS.aiPurple,
              opacity: cursorBlink,
              borderRadius: 4,
              marginLeft: 8,
              transform: "translateY(12px)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 60,
            opacity: t3,
            fontSize: 44,
            fontWeight: 500,
            color: COLORS.textSecondary,
            textAlign: "center",
            letterSpacing: -0.5,
          }}
        >
          A native macOS widget app.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
