import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Wallpaper } from "../components/Wallpaper";
import { AppIcon } from "../components/AppIcon";
import { COLORS, FONT_STACK } from "../tokens";

export const VerticalOutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconSpring = spring({
    frame, fps,
    config: { damping: 12, stiffness: 130 },
  });
  const titleSpring = spring({
    frame: frame - 0.4 * fps, fps,
    config: { damping: 18 },
  });
  const ctaSpring = spring({
    frame: frame - 0.8 * fps, fps,
    config: { damping: 22 },
  });
  const urlSpring = spring({
    frame: frame - 1.1 * fps, fps,
    config: { damping: 22 },
  });

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
            transform: `scale(${interpolate(iconSpring, [0, 1], [0.4, 1])}) rotate(${interpolate(iconSpring, [0, 1], [-20, 0])}deg)`,
            opacity: iconSpring,
          }}
        >
          <AppIcon size={260} />
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 110,
            fontWeight: 800,
            letterSpacing: -3,
            transform: `translateY(${interpolate(titleSpring, [0, 1], [20, 0])}px)`,
            opacity: titleSpring,
            textAlign: "center",
          }}
        >
          News Widgets
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 36,
            fontWeight: 500,
            color: COLORS.textSecondary,
            opacity: ctaSpring,
            textAlign: "center",
          }}
        >
          Free. Open source. Beautiful.
        </div>
        <div
          style={{
            marginTop: 80,
            padding: "20px 40px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${COLORS.aiPink}, ${COLORS.aiPurple} 60%, ${COLORS.aiBlue})`,
            boxShadow: "0 12px 48px rgba(168,85,247,0.45)",
            opacity: urlSpring,
            transform: `translateY(${interpolate(urlSpring, [0, 1], [12, 0])}px)`,
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          newswidgets.pages.dev
        </div>
        <div
          style={{
            marginTop: 16,
            opacity: urlSpring,
            transform: `translateY(${interpolate(urlSpring, [0, 1], [12, 0])}px)`,
            fontSize: 22,
            fontWeight: 600,
            color: COLORS.textSecondary,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            letterSpacing: -0.2,
          }}
        >
          ★ github.com/bendawg2010/NewsWidgets
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
