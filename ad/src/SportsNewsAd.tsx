import React from "react";
import { AbsoluteFill, staticFile, interpolate } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import {
  SNHookScene, SNRevealScene, SNFeaturesScene, SN_FEATURES_TOTAL, SNOutroScene,
} from "./scenes/SportsNewsScenes";
import { Watermark } from "./components/Watermark";

export const SN_FPS = 30;
const SN_MUSIC = "sportsnews.mp3";
const SN_URL = "sportsnewswidget.pages.dev";
const SN_ACCENT = "#1FA85B";

// --- Horizontal --------------------------------------------------------

export const SN_H_WIDTH = 1920;
export const SN_H_HEIGHT = 1080;

const H_HOOK = 2.6 * SN_FPS;
const H_REVEAL = 4.0 * SN_FPS;
const H_FEATURES = SN_FEATURES_TOTAL;
const H_OUTRO = 3.0 * SN_FPS;
const FADE = 18;
const SLIDE_T = 14;

export const SN_H_DURATION =
  H_HOOK + H_REVEAL + H_FEATURES + H_OUTRO - FADE * 2 - SLIDE_T;

export const SportsNewsAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile(SN_MUSIC)}
      volume={0.45}
    />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_HOOK}>
        <SNHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_REVEAL}>
        <SNRevealScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={H_FEATURES}>
        <SNFeaturesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <SNOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={SN_URL} accentColor={SN_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const SN_V_WIDTH = 1080;
export const SN_V_HEIGHT = 1920;

const V_HOOK = 2.6 * SN_FPS;
const V_REVEAL = 4.0 * SN_FPS;
const V_FEATURES = SN_FEATURES_TOTAL;
const V_OUTRO = 3.0 * SN_FPS;

export const SN_V_DURATION =
  V_HOOK + V_REVEAL + V_FEATURES + V_OUTRO - FADE * 2 - SLIDE_T;

export const SportsNewsAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile(SN_MUSIC)}
      volume={0.45}
    />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_HOOK}>
        <SNHookScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_REVEAL}>
        <SNRevealScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={V_FEATURES}>
        <SNFeaturesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <SNOutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={SN_URL} accentColor={SN_ACCENT} vertical />
  </AbsoluteFill>
);
