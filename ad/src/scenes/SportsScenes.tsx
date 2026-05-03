import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { Wallpaper } from "../components/Wallpaper";
import { COLORS, FONT_STACK } from "../tokens";
import { SportsWidgetMock, SportsGame, SPORTS_GREEN } from "../widgets/SportsWidgetMock";

const SPORTS_GRADIENT = `linear-gradient(135deg, ${SPORTS_GREEN}, #0d8c47)`;

export const SAMPLE_GAMES: SportsGame[] = [
  { league: "NBA", leagueColor: "#C8102E", teams: "BOS 112 @ LAL 108", status: "Q4 2:14",  isLive: true  },
  { league: "NFL", leagueColor: "#013369", teams: "SEA 29 @ NE 13",    status: "Final"                    },
  { league: "MLB", leagueColor: "#0E3386", teams: "NYY 5 @ BOS 3",     status: "Top 7th",  isLive: true  },
  { league: "NHL", leagueColor: "#000000", teams: "TOR 4 @ MTL 1",     status: "8:00 PM EDT"             },
];

export const SAMPLE_GAMES_LIVE = SAMPLE_GAMES.filter(g => g.isLive).length;

// MARK: - Sports wallpaper (green tint)

const SportsWallpaper: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(1400px 900px at 25% 15%, rgba(52, 199, 89, 0.55), transparent 65%)," +
          "radial-gradient(1200px 800px at 80% 90%, rgba(13, 140, 71, 0.50), transparent 65%)," +
          "radial-gradient(900px 600px at 55% 50%, rgba(80, 200, 110, 0.30), transparent 70%)," +
          "linear-gradient(135deg, #062812 0%, #0a1a14 60%, #02180a 100%)",
      }}
    />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  </AbsoluteFill>
);

// MARK: - Hook

export const SportsHookScene: React.FC<{ vertical?: boolean }> = ({
  vertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const t2 = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });

  const fontSize = vertical ? 180 : 130;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SportsWallpaper />
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
            fontSize,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          Every score.
        </div>
        <div
          style={{
            marginTop: vertical ? 24 : 18,
            transform: `translateY(${interpolate(t2, [0, 1], [30, 0])}px)`,
            opacity: t2,
            fontSize,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1,
            textAlign: "center",
            background: SPORTS_GRADIENT,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Live.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// MARK: - Reveal

export const SportsRevealScene: React.FC<{ vertical?: boolean }> = ({
  vertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 14, stiffness: 90, mass: 1.1 } });
  const y = interpolate(sp, [0, 1], [vertical ? 600 : 0, 0]);
  const x = interpolate(sp, [0, 1], [vertical ? 0 : -400, 0]);
  const scale = interpolate(sp, [0, 1], [0.85, 1]);

  const captionOp = interpolate(frame, [1.4 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SportsWallpaper />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            opacity: sp,
          }}
        >
          <SportsWidgetMock
            games={SAMPLE_GAMES}
            time="9:41 PM"
            liveCount={SAMPLE_GAMES_LIVE}
            size={vertical ? "large" : "xl"}
          />
        </div>
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          [vertical ? "top" : "bottom"]: vertical ? 100 : 90,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_STACK,
          color: "white",
          opacity: captionOp,
        }}
      >
        <div style={{ fontSize: vertical ? 60 : 48, fontWeight: 700, letterSpacing: -1.5 }}>
          NFL · NBA · MLB · NHL · EPL
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: vertical ? 28 : 22,
            color: COLORS.textSecondary,
            fontWeight: 500,
          }}
        >
          One widget, every league.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// MARK: - Features (3 sliding cards)

const FEATURES = [
  { big: "Live updates.",   sub: "Refreshed every 5 minutes when games are on." },
  { big: "Tap a game.",     sub: "Opens the matchup right in your browser." },
  { big: "All sports.",     sub: "Football. Basketball. Baseball. Hockey. Soccer." },
];
const SLIDE = 75;
export const SPORTS_FEATURES_TOTAL = FEATURES.length * SLIDE;

export const SportsFeaturesScene: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <SportsWallpaper />
    {FEATURES.map((f, i) => (
      <Sequence
        key={i}
        from={i * SLIDE}
        durationInFrames={SLIDE + 6}
        premountFor={30}
      >
        <FeatureSlide feature={f} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const FeatureSlide: React.FC<{ feature: { big: string; sub: string } }> = ({ feature }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const exit  = spring({ frame: frame - (SLIDE - 12), fps, config: { damping: 200 } });
  const opacity = enter - exit;
  const y = interpolate(enter - exit, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_STACK, opacity, transform: `translateY(${y}px)`,
      padding: 40,
    }}>
      <div style={{
        fontSize: 156, fontWeight: 800, letterSpacing: -4,
        background: SPORTS_GRADIENT,
        backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        lineHeight: 1.05, textAlign: "center",
      }}>
        {feature.big}
      </div>
      <div style={{
        marginTop: 22, fontSize: 32, fontWeight: 500,
        color: COLORS.textSecondary, letterSpacing: -0.4, textAlign: "center",
      }}>
        {feature.sub}
      </div>
    </AbsoluteFill>
  );
};

// MARK: - Outro

export const SportsOutroScene: React.FC<{ vertical?: boolean }> = ({
  vertical = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconSp = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
  const titleSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const ctaSp = spring({ frame: frame - 0.8 * fps, fps, config: { damping: 22 } });
  const urlSp = spring({ frame: frame - 1.1 * fps, fps, config: { damping: 22 } });

  const iconSize = vertical ? 220 : 160;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SportsWallpaper />
      <AbsoluteFill
        style={{
          alignItems: "center", justifyContent: "center",
          fontFamily: FONT_STACK, color: "white", padding: 60,
        }}
      >
        {/* Sports icon */}
        <div
          style={{
            width: iconSize, height: iconSize,
            borderRadius: iconSize * 0.22,
            background: SPORTS_GRADIENT,
            display: "grid", placeItems: "center",
            boxShadow:
              `inset 0 ${iconSize * 0.012}px 0 rgba(255,255,255,0.18),` +
              `0 ${iconSize * 0.16}px ${iconSize * 0.32}px rgba(13,140,71,0.5)`,
            transform: `scale(${interpolate(iconSp, [0, 1], [0.4, 1])}) rotate(${interpolate(iconSp, [0, 1], [-20, 0])}deg)`,
            opacity: iconSp,
          }}
        >
          <svg width={iconSize * 0.55} height={iconSize * 0.55} viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm5.5 15.4c-.4-1.1-1.4-1.9-2.6-2-.4-.4-.6-1-.6-1.6 0-.6.2-1.2.6-1.6 1.2-.1 2.2-.9 2.6-2 .9 1.1 1.5 2.5 1.5 4 0 1.5-.6 2.9-1.5 4z"/>
          </svg>
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: vertical ? 100 : 76,
            fontWeight: 800, letterSpacing: -2,
            transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
            opacity: titleSp,
            textAlign: "center",
          }}
        >
          Scores
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: vertical ? 32 : 24,
            fontWeight: 500, color: COLORS.textSecondary,
            opacity: ctaSp, textAlign: "center",
          }}
        >
          A free macOS widget. Open source.
        </div>
        <div
          style={{
            marginTop: vertical ? 60 : 40,
            padding: vertical ? "18px 36px" : "14px 28px",
            borderRadius: 999,
            background: SPORTS_GRADIENT,
            boxShadow: "0 12px 48px rgba(52,199,89,0.45)",
            opacity: urlSp,
            transform: `translateY(${interpolate(urlSp, [0, 1], [12, 0])}px)`,
            fontSize: vertical ? 30 : 24,
            fontWeight: 700, letterSpacing: -0.5,
          }}
        >
          scorewidget.pages.dev
        </div>
        <div
          style={{
            marginTop: vertical ? 16 : 12,
            opacity: urlSp,
            transform: `translateY(${interpolate(urlSp, [0, 1], [12, 0])}px)`,
            fontSize: vertical ? 20 : 16,
            fontWeight: 600,
            color: COLORS.textSecondary,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            letterSpacing: -0.2,
          }}
        >
          ★ github.com/bendawg2010/Scores
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
