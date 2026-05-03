import React from "react";
import { COLORS, FONT_STACK } from "../tokens";

export type NewsStory = {
  source: string;
  ageLabel: string;
  title: string;
};

const NEWS_RED_GRADIENT =
  `linear-gradient(135deg, #FF5A5F 0%, ${COLORS.newsRed} 100%)`;

const HERO_PHOTO_GRADIENT =
  `radial-gradient(circle at 70% 30%, ${COLORS.newsRed}E0 0%, transparent 60%),` +
  `linear-gradient(135deg, #1f2937 0%, #7f1d1d 100%)`;

type Props = {
  stories: NewsStory[];
  topStoryTitle: string;
  time: string;
  size?: "large" | "xl";
  overlayProgress?: number;
};

export const NewsWidget: React.FC<Props> = ({
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
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: NEWS_RED_GRADIENT,
            display: "grid",
            placeItems: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
          }}
        >
          <NewspaperIcon />
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>News</div>
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
          background: HERO_PHOTO_GRADIENT,
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
              background: COLORS.newsRed,
              color: "white",
              textShadow: "0 1px 2px rgba(0,0,0,0.4)",
            }}
          >
            BREAKING
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

      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {stories.map((s, i) => (
          <StoryRow key={i} story={s} accent={COLORS.newsRed} />
        ))}
      </div>
    </div>
  );
};

const StoryRow: React.FC<{ story: NewsStory; accent: string }> = ({
  story,
  accent,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: 0.7,
          color: accent,
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

const NewspaperIcon: React.FC = () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="white">
    <path d="M3 5.5C3 4.67 3.67 4 4.5 4h13c.83 0 1.5.67 1.5 1.5V18c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5.5zM5 6v12h12V6H5zm1.5 2h9v1.5h-9V8zm0 3h5.5v4.5H6.5V11zm6.5 0h2.5v1.5H13V11zm0 2h2.5v1.5H13V13zm0 2h2.5v1.5H13V15zM6.5 17h9v1H6.5v-1z" />
  </svg>
);
