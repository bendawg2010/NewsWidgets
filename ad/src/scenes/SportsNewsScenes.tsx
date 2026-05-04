import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";
import { MacBadge } from "../components/MacBadge";
import { MacOSChrome } from "../components/MacOSChrome";

const SN_GREEN = "#1FA85B";
const SN_GRADIENT = `linear-gradient(135deg, ${SN_GREEN}, #0A6B36)`;

// Sample sports news headlines
type Headline = { source: string; ageLabel: string; title: string };
const HEADLINES: Headline[] = [
  { source: "ESPN",      ageLabel: "21 min", title: "Lakers stun Celtics in OT thriller behind Reaves' career-high 38" },
  { source: "FOX SPORTS",ageLabel: "1 hr",   title: "Trade deadline winners: which contender just got the steal of the year" },
  { source: "BBC SPORT", ageLabel: "2 hr",   title: "Champions League draw delivers heavyweight semifinal matchup" },
  { source: "CBS SPORTS",ageLabel: "3 hr",   title: "Mahomes back at practice, listed as full participant for Sunday" },
];

const SNWallpaper: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{
      background:
        "radial-gradient(1400px 900px at 25% 15%, rgba(31, 168, 91, 0.55), transparent 65%)," +
        "radial-gradient(1200px 800px at 80% 90%, rgba(10, 107, 54, 0.50), transparent 65%)," +
        "radial-gradient(900px 600px at 55% 50%, rgba(80, 200, 110, 0.25), transparent 70%)," +
        "linear-gradient(135deg, #032010 0%, #051a10 60%, #02180a 100%)",
    }} />
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
    }} />
  </AbsoluteFill>
);

// MARK: - Hook

export const SNHookScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const t2 = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const fontSize = vertical ? 170 : 130;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SNWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <MacBadge vertical={vertical} opacity={t1} />
        <div style={{
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          opacity: t1, fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
        }}>
          Your sports.
        </div>
        <div style={{
          marginTop: vertical ? 24 : 18,
          transform: `translateY(${interpolate(t2, [0, 1], [30, 0])}px)`,
          opacity: t2, fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
          background: SN_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          Your picks.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// MARK: - Reveal — sports-news widget mock

const SportsNewsWidgetMock: React.FC<{ time: string; size: "large" | "xl" }> = ({ time, size }) => {
  const width = size === "xl" ? 720 : 480;
  const height = size === "xl" ? 480 : 480;

  return (
    <div style={{
      width, height,
      borderRadius: 32, padding: 22,
      background: COLORS.bgGlass,
      backdropFilter: "blur(48px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 48px rgba(0,0,0,0.55)",
      display: "flex", flexDirection: "column", gap: 14,
      fontFamily: FONT_STACK, color: COLORS.textPrimary, overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: SN_GRADIENT, display: "grid", placeItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.25)",
        }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="white">
            <path d="M5 4h14v3a4 4 0 0 1-4 4 3 3 0 0 1-3 3 3 3 0 0 1-3-3 4 4 0 0 1-4-4V4zm-2 0h2v3c0 1.1.4 2.1 1 2.8V11H4V4zm15 0h2v7h-2V9.8c.6-.7 1-1.7 1-2.8V4zM10 16h4v2h2l1 3H7l1-3h2v-2z"/>
          </svg>
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, flex: 1 }}>Sports News</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: COLORS.textSecondary }}>{time}</div>
      </div>

      {/* Hero card */}
      <div style={{
        position: "relative", borderRadius: 16, height: 130, overflow: "hidden",
        background:
          "radial-gradient(circle at 70% 30%, rgba(31,168,91,0.95) 0%, transparent 60%)," +
          "linear-gradient(135deg, #052015 0%, #073a22 100%)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, padding: 14,
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div style={{
            alignSelf: "flex-start", fontSize: 11, fontWeight: 800, letterSpacing: 1,
            padding: "5px 9px", borderRadius: 6,
            background: SN_GRADIENT, color: "white",
            textShadow: "0 1px 2px rgba(0,0,0,0.4)",
          }}>
            TOP STORY
          </div>
          <div style={{
            fontSize: 16, fontWeight: 700, lineHeight: 1.2, color: "white",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}>
            Lakers stun Celtics in OT thriller behind Reaves' career-high 38
          </div>
        </div>
      </div>

      {/* Story rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {HEADLINES.slice(1, 4).map((h, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                fontSize: 11, fontWeight: 800, letterSpacing: 0.7,
                color: SN_GREEN, textTransform: "uppercase",
              }}>{h.source}</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: COLORS.textTertiary }} />
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
                color: COLORS.textTertiary, textTransform: "uppercase",
              }}>{h.ageLabel}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25 }}>
              {h.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SNRevealScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 14, stiffness: 90, mass: 1.1 } });
  const x = interpolate(sp, [0, 1], [vertical ? 0 : -400, 0]);
  const y = interpolate(sp, [0, 1], [vertical ? 600 : 0, 0]);
  const scale = interpolate(sp, [0, 1], [0.85, 1]);
  const captionOp = interpolate(frame, [1.4 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SNWallpaper />
      <MacOSChrome appName="Sports News" vertical={vertical}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          opacity: sp,
        }}>
          <SportsNewsWidgetMock time="9:41 PM" size={vertical ? "large" : "xl"} />
        </div>
      </AbsoluteFill>
      </MacOSChrome>
      <div style={{
        position: "absolute",
        [vertical ? "top" : "bottom"]: vertical ? 130 : 130,
        left: 0, right: 0, textAlign: "center",
        fontFamily: FONT_STACK, color: "white", opacity: captionOp,
        zIndex: 60,
      }}>
        <div style={{ fontSize: vertical ? 60 : 48, fontWeight: 700, letterSpacing: -1.5 }}>
          ESPN · Fox · BBC · CBS
        </div>
        <div style={{
          marginTop: 6, fontSize: vertical ? 28 : 22,
          color: COLORS.textSecondary, fontWeight: 500,
        }}>
          The sports you actually watch.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// MARK: - Features

const FEATURES = [
  { big: "Real photos.", sub: "Pulled live from each article." },
  { big: "Real headlines.", sub: "From the sources you actually read." },
  { big: "Tap to read.", sub: "Article opens right in the app." },
];
const SLIDE = 75;
export const SN_FEATURES_TOTAL = FEATURES.length * SLIDE;

export const SNFeaturesScene: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <SNWallpaper />
    {FEATURES.map((f, i) => (
      <Sequence key={i} from={i * SLIDE} durationInFrames={SLIDE + 6} premountFor={30}>
        <Slide feature={f} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const Slide: React.FC<{ feature: { big: string; sub: string } }> = ({ feature }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const exit  = spring({ frame: frame - (SLIDE - 12), fps, config: { damping: 200 } });
  const opacity = enter - exit;
  const y = interpolate(enter - exit, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_STACK, opacity, transform: `translateY(${y}px)`, padding: 40,
    }}>
      <div style={{
        fontSize: 156, fontWeight: 800, letterSpacing: -4,
        background: SN_GRADIENT,
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

export const SNOutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconSp = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
  const titleSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const ctaSp = spring({ frame: frame - 0.8 * fps, fps, config: { damping: 22 } });
  const urlSp = spring({ frame: frame - 1.1 * fps, fps, config: { damping: 22 } });
  const iconSize = vertical ? 220 : 160;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SNWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          width: iconSize, height: iconSize,
          borderRadius: iconSize * 0.22,
          background: SN_GRADIENT,
          display: "grid", placeItems: "center",
          boxShadow:
            `inset 0 ${iconSize * 0.012}px 0 rgba(255,255,255,0.18),` +
            `0 ${iconSize * 0.16}px ${iconSize * 0.32}px rgba(31,168,91,0.5)`,
          transform: `scale(${interpolate(iconSp, [0, 1], [0.4, 1])}) rotate(${interpolate(iconSp, [0, 1], [-20, 0])}deg)`,
          opacity: iconSp,
        }}>
          <svg width={iconSize * 0.55} height={iconSize * 0.55} viewBox="0 0 24 24" fill="white">
            <path d="M5 4h14v3a4 4 0 0 1-4 4 3 3 0 0 1-3 3 3 3 0 0 1-3-3 4 4 0 0 1-4-4V4zM3 4h2v3c0 1.1.4 2.1 1 2.8V11H4V4zm15 0h2v7h-2V9.8c.6-.7 1-1.7 1-2.8V4zM10 16h4v2h2l1 3H7l1-3h2v-2z"/>
          </svg>
        </div>
        <div style={{
          marginTop: 36, fontSize: vertical ? 100 : 76,
          fontWeight: 800, letterSpacing: -2,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          opacity: titleSp, textAlign: "center",
        }}>
          Sports News
        </div>
        <div style={{
          marginTop: 12, fontSize: vertical ? 32 : 24,
          fontWeight: 500, color: COLORS.textSecondary,
          opacity: ctaSp, textAlign: "center",
        }}>
          A free macOS widget. Open source.
        </div>
        <div style={{
          marginTop: vertical ? 60 : 40,
          padding: vertical ? "18px 36px" : "14px 28px",
          borderRadius: 999, background: SN_GRADIENT,
          boxShadow: "0 12px 48px rgba(31,168,91,0.45)",
          opacity: urlSp,
          transform: `translateY(${interpolate(urlSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 30 : 24, fontWeight: 700, letterSpacing: -0.5,
        }}>
          sportsnewswidget.pages.dev
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
          ★ github.com/bendawg2010/SportsNews
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
