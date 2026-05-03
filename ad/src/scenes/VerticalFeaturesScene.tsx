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
  big: string;
  caption: string;
  accent: "ai" | "news";
};

const FEATURES: Feature[] = [
  { big: "Real photos.",     caption: "Pulled live from each article.",      accent: "news" },
  { big: "Pick your sources.", caption: "TechCrunch, Verge, Fox, BBC, more.", accent: "ai" },
  { big: "Tap to read.",     caption: "Article opens right in the app.",     accent: "news" },
];

const SLIDE = 75;
export const V_FEATURES_TOTAL = FEATURES.length * SLIDE;

export const VerticalFeaturesScene: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Wallpaper />
    {FEATURES.map((f, i) => (
      <Sequence
        key={i}
        from={i * SLIDE}
        durationInFrames={SLIDE + 6}
        premountFor={30}
      >
        <Slide feature={f} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const Slide: React.FC<{ feature: Feature }> = ({ feature }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const exit = spring({
    frame: frame - (SLIDE - 12),
    fps,
    config: { damping: 200 },
  });
  const opacity = enter - exit;
  const y = interpolate(enter - exit, [0, 1], [40, 0]);

  const gradient =
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
        padding: 40,
      }}
    >
      <div
        style={{
          fontSize: 160,
          fontWeight: 800,
          letterSpacing: -4,
          background: gradient,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          lineHeight: 1.05,
          textAlign: "center",
        }}
      >
        {feature.big}
      </div>
      <div
        style={{
          marginTop: 24,
          fontSize: 36,
          fontWeight: 500,
          color: COLORS.textSecondary,
          letterSpacing: -0.4,
          textAlign: "center",
        }}
      >
        {feature.caption}
      </div>
    </AbsoluteFill>
  );
};
