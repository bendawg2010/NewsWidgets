import React from "react";
import { AbsoluteFill, staticFile, interpolate } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  F1HookScene, F1RevealScene, F1FeaturesScene,
  F1_FEATURES_TOTAL, F1OutroScene,
} from "./scenes/F1Scenes";
import { F1TrackScene } from "./scenes/F1TrackScene";
import { F1TelemetryScene } from "./scenes/F1TelemetryScene";

export const F1_FPS = 30;
const F1_MUSIC = "f1.mp3";

// --- Horizontal --------------------------------------------------------

export const F1_H_WIDTH = 1920;
export const F1_H_HEIGHT = 1080;

const H_HOOK = 2.6 * F1_FPS;
const H_REVEAL = 3.5 * F1_FPS;
const H_TELEMETRY = 5.0 * F1_FPS;
const H_TRACK = 4.0 * F1_FPS;
const H_FEATURES = F1_FEATURES_TOTAL;
const H_OUTRO = 3.0 * F1_FPS;
const FADE = 18;
const SLIDE_T = 14;

// 5 transitions: 1 fade + 1 slide + 1 fade + 1 fade + 1 fade
export const F1_H_DURATION =
  H_HOOK + H_REVEAL + H_TELEMETRY + H_TRACK + H_FEATURES + H_OUTRO - FADE * 4 - SLIDE_T;

export const F1AdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile(F1_MUSIC)}
      volume={(f) => {
        const inEnd = 0.4 * F1_FPS;
        const outStart = F1_H_DURATION - 0.8 * F1_FPS;
        if (f < inEnd) return interpolate(f, [0, inEnd], [0, 0.42]);
        if (f > outStart) return interpolate(f, [outStart, F1_H_DURATION], [0.42, 0]);
        return 0.42;
      }}
    />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_HOOK}>
        <F1HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_REVEAL}>
        <F1RevealScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={H_TELEMETRY}>
        <F1TelemetryScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_TRACK}>
        <F1TrackScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_FEATURES}>
        <F1FeaturesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <F1OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const F1_V_WIDTH = 1080;
export const F1_V_HEIGHT = 1920;

const V_HOOK = 2.6 * F1_FPS;
const V_REVEAL = 3.5 * F1_FPS;
const V_TELEMETRY = 5.0 * F1_FPS;
const V_TRACK = 4.0 * F1_FPS;
const V_FEATURES = F1_FEATURES_TOTAL;
const V_OUTRO = 3.0 * F1_FPS;

export const F1_V_DURATION =
  V_HOOK + V_REVEAL + V_TELEMETRY + V_TRACK + V_FEATURES + V_OUTRO - FADE * 4 - SLIDE_T;

export const F1AdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile(F1_MUSIC)}
      volume={(f) => {
        const inEnd = 0.4 * F1_FPS;
        const outStart = F1_V_DURATION - 0.8 * F1_FPS;
        if (f < inEnd) return interpolate(f, [0, inEnd], [0, 0.42]);
        if (f > outStart) return interpolate(f, [outStart, F1_V_DURATION], [0.42, 0]);
        return 0.42;
      }}
    />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_HOOK}>
        <F1HookScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_REVEAL}>
        <F1RevealScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={V_TELEMETRY}>
        <F1TelemetryScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_TRACK}>
        <F1TrackScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_FEATURES}>
        <F1FeaturesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <F1OutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
