import React from "react";
import {
  AbsoluteFill,
  Series,
  staticFile,
  interpolate,
} from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { HookScene } from "./scenes/HookScene";
import { RevealScene } from "./scenes/RevealScene";
import { FeaturesScene, FEATURES_TOTAL_FRAMES } from "./scenes/FeaturesScene";
import { SourcePickerScene } from "./scenes/SourcePickerScene";
import { ClickScene } from "./scenes/ClickScene";
import { WebsiteScene } from "./scenes/WebsiteScene";
import { OutroScene } from "./scenes/OutroScene";

// 30 fps, 1920x1080
export const AD_FPS = 30;
export const AD_WIDTH = 1920;
export const AD_HEIGHT = 1080;

const HOOK = 2.6 * AD_FPS;        // ≈ 78
const REVEAL = 4.2 * AD_FPS;      // ≈ 126
const FEATURES = FEATURES_TOTAL_FRAMES; // 3 × 75 = 225 (≈ 7.5s)
const SOURCES = 4.5 * AD_FPS;     // ≈ 135
const CLICK = 4.5 * AD_FPS;       // ≈ 135
const WEBSITE = 3.5 * AD_FPS;     // ≈ 105
const OUTRO = 3.0 * AD_FPS;       // 90

const FADE = 18; // 0.6s
const SLIDE_T = 14;

// 6 transitions between 7 sequences
export const AD_DURATION =
  HOOK + REVEAL + FEATURES + SOURCES + CLICK + WEBSITE + OUTRO - FADE * 6;

export const NewsWidgetsAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Background music — generated ambient track. Fades in over 0.4s,
          stays at -8 dB to leave headroom, fades out over the last 0.8s. */}
      <Audio
        src={staticFile("news.mp3")}
        volume={(f) => {
          const fadeInEnd = 0.4 * AD_FPS;
          const fadeOutStart = AD_DURATION - 0.8 * AD_FPS;
          if (f < fadeInEnd) return interpolate(f, [0, fadeInEnd], [0, 0.42]);
          if (f > fadeOutStart) return interpolate(f, [fadeOutStart, AD_DURATION], [0.42, 0]);
          return 0.42;
        }}
      />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={HOOK}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={REVEAL}>
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({
            config: { damping: 200 },
            durationInFrames: SLIDE_T,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={FEATURES}>
          <FeaturesScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={SOURCES}>
          <SourcePickerScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={CLICK}>
          <ClickScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={WEBSITE}>
          <WebsiteScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE })}
        />

        <TransitionSeries.Sequence durationInFrames={OUTRO}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
