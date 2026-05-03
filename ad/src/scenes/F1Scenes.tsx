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
import { F1WidgetMock, F1Driver, F1_RED } from "../widgets/F1WidgetMock";

const F1_GRADIENT = `linear-gradient(135deg, #FF3333 0%, ${F1_RED} 100%)`;

export const SAMPLE_DRIVERS: F1Driver[] = [
  { pos: 1, abbrev: "VER", team: "Red Bull",   teamColor: "#3671C6", lastLap: "1:30.512", gap: "LEADER"  },
  { pos: 2, abbrev: "NOR", team: "McLaren",    teamColor: "#FF8000", lastLap: "1:30.834", gap: "+0.4s"   },
  { pos: 3, abbrev: "LEC", team: "Ferrari",    teamColor: "#E80020", lastLap: "1:31.022", gap: "+1.8s"   },
  { pos: 4, abbrev: "PIA", team: "McLaren",    teamColor: "#FF8000", lastLap: "1:31.156", gap: "+3.6s"   },
  { pos: 5, abbrev: "HAM", team: "Mercedes",   teamColor: "#27F4D2", lastLap: "1:31.420", gap: "+5.1s"   },
];

// MARK: - F1 wallpaper (red tint)

const F1Wallpaper: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(1400px 900px at 25% 15%, rgba(225, 6, 0, 0.55), transparent 65%)," +
          "radial-gradient(1200px 800px at 80% 90%, rgba(120, 10, 10, 0.50), transparent 65%)," +
          "radial-gradient(900px 600px at 60% 50%, rgba(255, 80, 80, 0.20), transparent 70%)," +
          "linear-gradient(135deg, #1a0405 0%, #0a0a0a 60%, #200608 100%)",
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

export const F1HookScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const t2 = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const fontSize = vertical ? 180 : 130;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <F1Wallpaper />
      <AbsoluteFill
        style={{
          alignItems: "center", justifyContent: "center",
          fontFamily: FONT_STACK, color: "white", padding: 60,
        }}
      >
        <div
          style={{
            transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
            opacity: t1,
            fontSize, fontWeight: 800, letterSpacing: -3,
            lineHeight: 1, textAlign: "center",
          }}
        >
          Lights out.
        </div>
        <div
          style={{
            marginTop: vertical ? 24 : 18,
            transform: `translateY(${interpolate(t2, [0, 1], [30, 0])}px)`,
            opacity: t2,
            fontSize, fontWeight: 800, letterSpacing: -3,
            lineHeight: 1, textAlign: "center",
            background: F1_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}
        >
          Away we go.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// MARK: - Reveal

export const F1RevealScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 14, stiffness: 90, mass: 1.1 } });
  const x = interpolate(sp, [0, 1], [vertical ? 0 : 400, 0]);
  const y = interpolate(sp, [0, 1], [vertical ? 600 : 0, 0]);
  const scale = interpolate(sp, [0, 1], [0.85, 1]);

  const captionOp = interpolate(frame, [1.4 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <F1Wallpaper />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            opacity: sp,
          }}
        >
          <F1WidgetMock
            drivers={SAMPLE_DRIVERS}
            circuit="Miami"
            sessionName="Race"
            isLive
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
          Live driver positions.
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: vertical ? 28 : 22,
            color: COLORS.textSecondary,
            fontWeight: 500,
          }}
        >
          Updated every 90 seconds during a race.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// MARK: - Features

const FEATURES = [
  { big: "Live laps.",       sub: "Every driver, every gap, refreshed in real time." },
  { big: "Full schedule.",   sub: "Next race, when it starts, where it's held." },
  { big: "Free. Open source.", sub: "Powered by OpenF1. No accounts, no ads." },
];
const SLIDE = 75;
export const F1_FEATURES_TOTAL = FEATURES.length * SLIDE;

export const F1FeaturesScene: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <F1Wallpaper />
    {FEATURES.map((f, i) => (
      <Sequence key={i} from={i * SLIDE} durationInFrames={SLIDE + 6} premountFor={30}>
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
        background: F1_GRADIENT,
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

export const F1OutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconSp = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
  const titleSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const ctaSp = spring({ frame: frame - 0.8 * fps, fps, config: { damping: 22 } });
  const urlSp = spring({ frame: frame - 1.1 * fps, fps, config: { damping: 22 } });

  const iconSize = vertical ? 220 : 160;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <F1Wallpaper />
      <AbsoluteFill
        style={{
          alignItems: "center", justifyContent: "center",
          fontFamily: FONT_STACK, color: "white", padding: 60,
        }}
      >
        <div
          style={{
            width: iconSize, height: iconSize,
            borderRadius: iconSize * 0.22,
            background: F1_GRADIENT,
            display: "grid", placeItems: "center",
            boxShadow:
              `inset 0 ${iconSize * 0.012}px 0 rgba(255,255,255,0.18),` +
              `0 ${iconSize * 0.16}px ${iconSize * 0.32}px rgba(225,6,0,0.5)`,
            transform: `scale(${interpolate(iconSp, [0, 1], [0.4, 1])}) rotate(${interpolate(iconSp, [0, 1], [-20, 0])}deg)`,
            opacity: iconSp,
          }}
        >
          <svg width={iconSize * 0.55} height={iconSize * 0.55} viewBox="0 0 24 24" fill="white">
            <path d="M5 3v18h2v-7h12V3H5zm4 9H7V9h2v3zm0-3V6h2v3H9zm0 3h2v3H9v-3zm4 0h-2V9h2v3zm0-3V6h2v3h-2zm0 6V12h2v3h-2zm4-3h-2V9h2v3zm0-3V6h2v3h-2z"/>
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
          F1 Live
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
            background: F1_GRADIENT,
            boxShadow: "0 12px 48px rgba(225,6,0,0.45)",
            opacity: urlSp,
            transform: `translateY(${interpolate(urlSp, [0, 1], [12, 0])}px)`,
            fontSize: vertical ? 30 : 24,
            fontWeight: 700, letterSpacing: -0.5,
          }}
        >
          f1widget.pages.dev
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
