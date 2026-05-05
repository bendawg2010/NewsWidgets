import React from "react";
import {
  AbsoluteFill, OffthreadVideo, Sequence, staticFile,
  interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { COLORS, FONT_STACK } from "./tokens";
import { Watermark } from "./components/Watermark";

export const DGD_FPS = 30;
const DGD_MUSIC = "duein.mp3"; // reuse warm sunset music — fits the brand
const DGD_URL = "deckgrab.pages.dev";
const DGD_ACCENT = "#C147FF";
const FADE = 14;

// DeckGrab brand
const DG_ORANGE = "#FFB454";
const DG_PINK   = "#FF6B6B";
const DG_PURPLE = "#C147FF";
const DG_GRADIENT = `linear-gradient(135deg, ${DG_ORANGE} 0%, ${DG_PINK} 50%, ${DG_PURPLE} 100%)`;

// Trim the 47s screen recording down to a 14-second highlight reel.
// (Adjust startFrom/endAt to taste in the playback window.)
const DEMO_TRIM_FROM_S = 0;
const DEMO_TRIM_TO_S   = 14;

// ----- Wallpaper -------------------------------------------------------

const DGDWallpaper: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{
      background:
        "radial-gradient(1400px 900px at 22% 18%, rgba(255, 180, 84, 0.45), transparent 65%)," +
        "radial-gradient(1200px 800px at 78% 88%, rgba(193, 71, 255, 0.45), transparent 65%)," +
        "radial-gradient(900px 600px at 60% 52%, rgba(255, 107, 107, 0.30), transparent 70%)," +
        "linear-gradient(135deg, #18080a 0%, #100a18 60%, #0c041c 100%)",
    }} />
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
    }} />
  </AbsoluteFill>
);

// ----- Scene 1 — Hook --------------------------------------------------

const HookScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame, fps, config: { damping: 16 } });
  const t2 = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const fontSize = vertical ? 130 : 110;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DGDWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          opacity: t1,
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
        }}>
          Yoinking flashcards,
        </div>
        <div style={{
          marginTop: vertical ? 18 : 12,
          opacity: t2,
          transform: `translateY(${interpolate(t2, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
          background: DG_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          live in 14s.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 2 — The actual screen recording ---------------------------

const DemoScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps, width: compWidth, height: compHeight } = useVideoConfig();

  // Subtle frame intro (scale-in)
  const intro = spring({ frame, fps, config: { damping: 16 } });

  // Caption that gives the audience a north star
  const captionSp = spring({ frame: frame - 0.3 * fps, fps, config: { damping: 18 } });

  // Video native dims: 1280x800 (4:2.5)
  const vidNativeW = 1280;
  const vidNativeH = 800;

  // Pick a video size that fits the composition with margin.
  let vidW: number, vidH: number;
  if (vertical) {
    // Vertical 1080x1920 — fit width, letterbox vertically
    vidW = compWidth - 80;
    vidH = vidW * (vidNativeH / vidNativeW);
  } else {
    // Horizontal 1920x1080 — fit width with caption space underneath
    vidW = compWidth - 200;
    vidH = vidW * (vidNativeH / vidNativeW);
    // Don't blow past available height (leave 220px for caption)
    const maxH = compHeight - 220;
    if (vidH > maxH) {
      vidH = maxH;
      vidW = vidH * (vidNativeW / vidNativeH);
    }
  }

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DGDWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white",
      }}>
        {/* Caption above */}
        <div style={{
          opacity: captionSp,
          transform: `translateY(${interpolate(captionSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 50 : 38,
          fontWeight: 800, letterSpacing: -1.2, textAlign: "center",
          marginBottom: vertical ? 28 : 22,
          textShadow: "0 4px 16px rgba(0,0,0,0.45)",
          maxWidth: vertical ? 940 : 1400,
          padding: "0 40px",
        }}>
          One drag. One click. <span style={{
            background: DG_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>Cards in your hand.</span>
        </div>

        {/* The framed video */}
        <div style={{
          opacity: intro,
          transform: `scale(${interpolate(intro, [0, 1], [0.94, 1])})`,
          padding: 6,
          borderRadius: 22,
          background: DG_GRADIENT,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.18)," +
            "0 32px 80px rgba(0,0,0,0.55)," +
            "0 0 0 1px rgba(255,255,255,0.08)",
          width: vidW + 12,
          height: vidH + 12,
        }}>
          <div style={{
            width: vidW, height: vidH,
            borderRadius: 18,
            background: "#000",
            overflow: "hidden",
            position: "relative",
          }}>
            <OffthreadVideo
              src={staticFile("deckgrab-demo.mp4")}
              startFrom={DEMO_TRIM_FROM_S * DGD_FPS}
              endAt={DEMO_TRIM_TO_S * DGD_FPS}
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                background: "#000",
              }}
            />
            {/* Subtle inset stroke for premium feel */}
            <div style={{
              position: "absolute", inset: 0,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
              borderRadius: 18,
              pointerEvents: "none",
            }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 3 — Outro -------------------------------------------------

const OutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconSp = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
  const titleSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const subSp = spring({ frame: frame - 0.7 * fps, fps, config: { damping: 22 } });
  const ctaSp = spring({ frame: frame - 1.0 * fps, fps, config: { damping: 22 } });
  const iconSize = vertical ? 220 : 160;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DGDWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          transform: `scale(${interpolate(iconSp, [0, 1], [0.4, 1])}) rotate(${interpolate(iconSp, [0, 1], [-20, 0])}deg)`,
          opacity: iconSp,
          width: iconSize, height: iconSize, borderRadius: iconSize * 0.22,
          background: DG_GRADIENT,
          display: "grid", placeItems: "center",
          boxShadow: `inset 0 ${iconSize * 0.012}px 0 rgba(255,255,255,0.18), 0 ${iconSize * 0.16}px ${iconSize * 0.32}px rgba(0,0,0,0.45)`,
        }}>
          <svg width={iconSize * 0.6} height={iconSize * 0.6} viewBox="0 0 24 24" fill="none">
            <path d="M5 6h10a3 3 0 013 3v3M5 6l4 4M5 6l4-4" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="11" y="12" width="9" height="8" rx="1.5" fill="white" />
          </svg>
        </div>
        <div style={{
          marginTop: vertical ? 40 : 32,
          fontSize: vertical ? 100 : 84, fontWeight: 800, letterSpacing: -2.5,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          opacity: titleSp, textAlign: "center", lineHeight: 1.05,
        }}>
          DeckGrab
        </div>
        <div style={{
          marginTop: vertical ? 14 : 10,
          fontSize: vertical ? 30 : 24, fontWeight: 600, letterSpacing: -0.4,
          color: COLORS.textSecondary,
          opacity: subSp,
          transform: `translateY(${interpolate(subSp, [0, 1], [12, 0])}px)`,
          textAlign: "center",
        }}>
          Free flashcards. Open source.
        </div>
        <div style={{
          marginTop: vertical ? 56 : 40,
          padding: vertical ? "18px 40px" : "16px 32px",
          borderRadius: 999,
          background: DG_GRADIENT,
          boxShadow: "0 12px 48px rgba(193, 71, 255, 0.45)",
          opacity: ctaSp,
          transform: `translateY(${interpolate(ctaSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 32 : 26,
          fontWeight: 700, letterSpacing: -0.5,
        }}>
          deckgrab.pages.dev
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Compositions ----------------------------------------------------

const DEMO_DUR_S = DEMO_TRIM_TO_S - DEMO_TRIM_FROM_S; // 14s

export const DGD_H_WIDTH = 1920;
export const DGD_H_HEIGHT = 1080;

const H_HOOK  = 2.6 * DGD_FPS;
const H_DEMO  = DEMO_DUR_S * DGD_FPS;
const H_OUTRO = 3.4 * DGD_FPS;

export const DGD_H_DURATION =
  H_HOOK + H_DEMO + H_OUTRO - FADE * 2;

export const DeckGrabDemoAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(DGD_MUSIC)} volume={0.40} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_HOOK}>
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_DEMO}>
        <DemoScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={DGD_URL} accentColor={DGD_ACCENT} />
  </AbsoluteFill>
);

export const DGD_V_WIDTH = 1080;
export const DGD_V_HEIGHT = 1920;

const V_HOOK  = 2.6 * DGD_FPS;
const V_DEMO  = DEMO_DUR_S * DGD_FPS;
const V_OUTRO = 3.4 * DGD_FPS;

export const DGD_V_DURATION =
  V_HOOK + V_DEMO + V_OUTRO - FADE * 2;

export const DeckGrabDemoAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(DGD_MUSIC)} volume={0.40} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_HOOK}>
        <HookScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_DEMO}>
        <DemoScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <OutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={DGD_URL} accentColor={DGD_ACCENT} vertical />
  </AbsoluteFill>
);
