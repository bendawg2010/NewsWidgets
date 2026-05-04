import React from "react";
import { AbsoluteFill, staticFile, interpolate } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  SportsHookScene, SportsRevealScene, SportsFeaturesScene,
  SPORTS_FEATURES_TOTAL, SportsOutroScene,
} from "./scenes/SportsScenes";
import { Watermark } from "./components/Watermark";

export const SPORTS_FPS = 30;
const SPORTS_URL = "scorewidget.pages.dev";
const SPORTS_ACCENT = "#34C759";

// --- Horizontal --------------------------------------------------------

export const SPORTS_H_WIDTH = 1920;
export const SPORTS_H_HEIGHT = 1080;

const H_HOOK = 2.6 * SPORTS_FPS;
const H_REVEAL = 4.0 * SPORTS_FPS;
const H_FEATURES = SPORTS_FEATURES_TOTAL;
const H_OUTRO = 3.0 * SPORTS_FPS;
const FADE = 18;
const SLIDE_T = 14;

export const SPORTS_H_DURATION =
  H_HOOK + H_REVEAL + H_FEATURES + H_OUTRO - FADE * 2 - SLIDE_T;

export const SportsAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile("sports.mp3")}
      volume={0.45}
    />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_HOOK}>
        <SportsHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_REVEAL}>
        <SportsRevealScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={H_FEATURES}>
        <SportsFeaturesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <SportsOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={SPORTS_URL} accentColor={SPORTS_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const SPORTS_V_WIDTH = 1080;
export const SPORTS_V_HEIGHT = 1920;

const V_HOOK = 2.6 * SPORTS_FPS;
const V_REVEAL = 4.0 * SPORTS_FPS;
const V_FEATURES = SPORTS_FEATURES_TOTAL;
const V_OUTRO = 3.0 * SPORTS_FPS;

export const SPORTS_V_DURATION =
  V_HOOK + V_REVEAL + V_FEATURES + V_OUTRO - FADE * 2 - SLIDE_T;

export const SportsAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile("sports.mp3")}
      volume={0.45}
    />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_HOOK}>
        <SportsHookScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_REVEAL}>
        <SportsRevealScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={V_FEATURES}>
        <SportsFeaturesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <SportsOutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={SPORTS_URL} accentColor={SPORTS_ACCENT} vertical />
  </AbsoluteFill>
);
