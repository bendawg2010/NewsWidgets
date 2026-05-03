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
import { AIWidget } from "../widgets/AIWidget";
import { NewsWidget } from "../widgets/NewsWidget";
import { COLORS, FONT_STACK } from "../tokens";
import { AI_DATA, NEWS_DATA } from "../data";

/** Scene 2 — both widgets fly in onto the desktop. */
export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const newsSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 1.1 },
  });
  const aiSpring = spring({
    frame: frame - 0.25 * fps,
    fps,
    config: { damping: 14, stiffness: 90, mass: 1.1 },
  });

  const newsX = interpolate(newsSpring, [0, 1], [-700, 0]);
  const newsScale = interpolate(newsSpring, [0, 1], [0.85, 1]);
  const newsOpacity = interpolate(newsSpring, [0, 1], [0, 1]);

  const aiX = interpolate(aiSpring, [0, 1], [700, 0]);
  const aiScale = interpolate(aiSpring, [0, 1], [0.85, 1]);
  const aiOpacity = interpolate(aiSpring, [0, 1], [0, 1]);

  const captionOpacity = interpolate(frame, [1.4 * fps, 1.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const captionY = interpolate(captionOpacity, [0, 1], [12, 0]);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Wallpaper />
      <MenuBar time="9:41" />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          flexDirection: "row",
          paddingTop: 36,
        }}
      >
        <div
          style={{
            transform: `translateX(${newsX}px) scale(${newsScale})`,
            opacity: newsOpacity,
          }}
        >
          <NewsWidget {...NEWS_DATA} />
        </div>
        <div
          style={{
            transform: `translateX(${aiX}px) scale(${aiScale})`,
            opacity: aiOpacity,
          }}
        >
          <AIWidget {...AI_DATA} />
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: "absolute",
          bottom: 90,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_STACK,
          color: COLORS.textPrimary,
          opacity: captionOpacity,
          transform: `translateY(${captionY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          Two widgets. Live data.
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 22,
            color: COLORS.textSecondary,
            fontWeight: 500,
          }}
        >
          Right on your desktop.
        </div>
      </div>
    </AbsoluteFill>
  );
};
