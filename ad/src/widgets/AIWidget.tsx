import React from "react";
import { COLORS, FONT_STACK } from "../tokens";

export type AIStory = {
  source: string;
  ageLabel: string;
  title: string;
};

export const AI_GRADIENT =
  `linear-gradient(135deg, ${COLORS.aiPink} 0%, ${COLORS.aiPurple} 55%, ${COLORS.aiBlue} 100%)`;

const HERO_GRADIENT =
  `radial-gradient(circle at 30% 30%, ${COLORS.aiPink}D9 0%, transparent 55%),` +
  `radial-gradient(circle at 70% 65%, ${COLORS.aiBlue}D9 0%, transparent 60%),` +
  `linear-gradient(135deg, #582089 0%, #1f3a8a 100%)`;

type Props = {
  stories: AIStory[];
  topStoryTitle: string;
  time: string;
  size?: "large" | "xl";
  /** 0 → 1; controls overlay text reveal */
  overlayProgress?: number;
};

export const AIWidget: React.FC<Props> = ({
  stories,
  topStoryTitle,
  time,
  size = "large",
  overlayProgress = 1,
}) => {
  const width = size === "xl" ? 720 : 480;
  const height = size === "xl" ? 480 : 480;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 32,
        padding: 22,
        background: COLORS.bgGlass,
        backdropFilter: "blur(48px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 48px rgba(0,0,0,0.55)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        fontFamily: FONT_STACK,
        color: COLORS.textPrimary,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: AI_GRADIENT,
            display: "grid",
            placeItems: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          }}
        >
          <SparklesIcon />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>AI Today</div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: COLORS.textSecondary,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {time}
        </div>
      </div>

      {/* Photo hero */}
      <div
        style={{
          position: "relative",
          borderRadius: 16,
          height: 130,
          overflow: "hidden",
          background: HERO_GRADIENT,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: overlayProgress,
            transform: `translateY(${(1 - overlayProgress) * 6}px)`,
          }}
        >
          <div
            style={{
              alignSelf: "flex-start",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1.0,
              padding: "5px 9px",
              borderRadius: 6,
              background: AI_GRADIENT,
              color: "white",
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            TOP STORY
          </div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              lineHeight: 1.2,
              color: "white",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            {topStoryTitle}
          </div>
        </div>
      </div>

      {/* Story list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {stories.map((s, i) => (
          <StoryRow key={i} story={s} accentBg={AI_GRADIENT} />
        ))}
      </div>
    </div>
  );
};

const StoryRow: React.FC<{ story: AIStory; accentBg: string }> = ({
  story,
  accentBg,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 0.7,
          background: accentBg,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textTransform: "uppercase",
        }}
      >
        {story.source}
      </span>
      <span
        style={{
          width: 3,
          height: 3,
          borderRadius: "50%",
          background: COLORS.textTertiary,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.6,
          color: COLORS.textTertiary,
          textTransform: "uppercase",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {story.ageLabel}
      </span>
    </div>
    <div
      style={{
        fontSize: 15,
        fontWeight: 600,
        lineHeight: 1.25,
        letterSpacing: -0.1,
        color: COLORS.textPrimary,
      }}
    >
      {story.title}
    </div>
  </div>
);

const SparklesIcon: React.FC = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="white">
    <path d="M12 2.5l1.5 4.5 4.5 1.5-4.5 1.5L12 14.5 10.5 10 6 8.5 10.5 7 12 2.5zM18.5 13l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6zM5.5 14.5l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1L2.7 17.3l2.1-.7.7-2.1z" />
  </svg>
);
