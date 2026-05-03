import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Wallpaper } from "../components/Wallpaper";
import { AIWidget } from "../widgets/AIWidget";
import { NewsWidget } from "../widgets/NewsWidget";
import { COLORS, FONT_STACK } from "../tokens";
import { AI_DATA, NEWS_DATA } from "../data";

/** Stacks both widgets vertically for portrait. */
export const VerticalRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const aiSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 1.1 },
  });
  const newsSpring = spring({
    frame: frame - 0.3 * fps,
    fps,
    config: { damping: 14, stiffness: 90, mass: 1.1 },
  });

  const aiY = interpolate(aiSpring, [0, 1], [-650, 0]);
  const newsY = interpolate(newsSpring, [0, 1], [650, 0]);
  const aiOp = interpolate(aiSpring, [0, 1], [0, 1]);
  const newsOp = interpolate(newsSpring, [0, 1], [0, 1]);

  const captionOp = interpolate(frame, [1.4 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Wallpaper />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
          flexDirection: "column",
          padding: 60,
        }}
      >
        {/* AI on top */}
        <div
          style={{
            transform: `translateY(${aiY}px) scale(${interpolate(aiSpring, [0, 1], [0.85, 1])})`,
            opacity: aiOp,
          }}
        >
          <AIWidget {...AI_DATA} size="large" />
        </div>

        {/* News below */}
        <div
          style={{
            transform: `translateY(${newsY}px) scale(${interpolate(newsSpring, [0, 1], [0.85, 1])})`,
            opacity: newsOp,
          }}
        >
          <NewsWidget {...NEWS_DATA} size="large" />
        </div>
      </AbsoluteFill>

      {/* Caption near top */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_STACK,
          color: "white",
          opacity: captionOp,
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1.5 }}>
          Two widgets.
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 32,
            fontWeight: 500,
            color: COLORS.textSecondary,
          }}
        >
          Live, on your desktop.
        </div>
      </div>
    </AbsoluteFill>
  );
};
