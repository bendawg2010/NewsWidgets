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

/** Final scene — logo lockup, app name, tagline. */
export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 130 },
  });
  const iconScale = interpolate(iconSpring, [0, 1], [0.4, 1]);
  const iconRotate = interpolate(iconSpring, [0, 1], [-20, 0]);

  const titleSpring = spring({
    frame: frame - 0.4 * fps,
    fps,
    config: { damping: 18 },
  });
  const titleY = interpolate(titleSpring, [0, 1], [20, 0]);

  const tagSpring = spring({
    frame: frame - 0.7 * fps,
    fps,
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
        }}
      >
        <div
          style={{
            transform: `scale(${iconScale}) rotate(${iconRotate}deg)`,
            opacity: iconSpring,
          }}
        >
          <AppIcon size={200} />
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: -2,
            transform: `translateY(${titleY}px)`,
            opacity: titleSpring,
          }}
        >
          News Widgets
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 26,
            fontWeight: 500,
            color: COLORS.textSecondary,
            opacity: tagSpring,
          }}
        >
          For macOS Tahoe.
        </div>
        <div
          style={{
            marginTop: 36,
            padding: "14px 28px",
            borderRadius: 999,
            background: `linear-gradient(135deg, #ED4799, #A856F7 60%, #3B82F6)`,
            boxShadow: "0 12px 48px rgba(168,85,247,0.45)",
            opacity: tagSpring,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          newswidgets.pages.dev
        </div>
        <div
          style={{
            marginTop: 12,
            opacity: tagSpring,
            fontSize: 16,
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
