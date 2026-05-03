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

/** Scene 1 — opening hook: bold tagline on a soft macOS gradient. */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const subSpring = spring({
    frame: frame - 0.45 * fps,
    fps,
    config: { damping: 18 },
  });
  const subY = interpolate(subSpring, [0, 1], [24, 0]);

  const cursorBlink = Math.floor(frame / (0.5 * fps)) % 2 === 0 ? 1 : 0;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Wallpaper />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_STACK,
        }}
      >
        <div
          style={{
            transform: `translateY(${titleY}px)`,
            opacity: titleOpacity,
            display: "flex",
            alignItems: "baseline",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 130,
              fontWeight: 800,
              color: "white",
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            Today
          </span>
          <span
            style={{
              fontSize: 130,
              fontWeight: 800,
              background: `linear-gradient(135deg, ${COLORS.aiPink}, ${COLORS.aiPurple} 60%, ${COLORS.aiBlue})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            ,
          </span>
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 110,
              background: COLORS.aiPurple,
              opacity: cursorBlink,
              borderRadius: 2,
              marginLeft: 8,
              transform: "translateY(8px)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 32,
            transform: `translateY(${subY}px)`,
            opacity: subSpring,
            fontSize: 36,
            fontWeight: 500,
            color: COLORS.textSecondary,
            letterSpacing: -0.5,
          }}
        >
          summarized.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
