import React from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Wallpaper } from "../components/Wallpaper";
import { COLORS, FONT_STACK } from "../tokens";

type Feature = {
  bigText: string;
  caption: string;
  accent: "ai" | "news";
};

const FEATURES: Feature[] = [
  { bigText: "Real photos.", caption: "Pulled live from every article.", accent: "news" },
  { bigText: "Real summaries.", caption: "Headlines from sources you trust.", accent: "ai" },
  { bigText: "Tap to dive in.", caption: "Article opens right in the app.", accent: "ai" },
];

const SLIDE_FRAMES = 75; // 2.5s per feature at 30fps

export const FeaturesScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Wallpaper />
      {FEATURES.map((feature, i) => (
        <Sequence
          key={i}
          from={i * SLIDE_FRAMES}
          durationInFrames={SLIDE_FRAMES + 6}
          premountFor={30}
        >
          <FeatureSlide feature={feature} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const FeatureSlide: React.FC<{ feature: Feature }> = ({ feature }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Enter
  const enter = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  // Exit (last 12 frames)
  const exit = spring({
    frame: frame - (SLIDE_FRAMES - 12),
    fps,
    config: { damping: 200 },
  });

  const opacity = enter - exit;
  const y = interpolate(enter - exit, [0, 1], [40, 0]);

  const accentGradient =
    feature.accent === "ai"
      ? `linear-gradient(135deg, ${COLORS.aiPink}, ${COLORS.aiPurple} 60%, ${COLORS.aiBlue})`
      : `linear-gradient(135deg, #ff5a5f, ${COLORS.newsRed})`;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_STACK,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <div
        style={{
          fontSize: 156,
          fontWeight: 800,
          letterSpacing: -4,
          background: accentGradient,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          lineHeight: 1,
        }}
      >
        {feature.bigText}
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 32,
          fontWeight: 500,
          color: COLORS.textSecondary,
          letterSpacing: -0.4,
        }}
      >
        {feature.caption}
      </div>
    </AbsoluteFill>
  );
};

export const FEATURES_TOTAL_FRAMES = FEATURES.length * SLIDE_FRAMES;
