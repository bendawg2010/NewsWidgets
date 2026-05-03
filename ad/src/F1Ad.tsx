import React from "react";
import { AbsoluteFill, staticFile, interpolate } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  F1HookScene, F1RevealScene, F1OutroScene,
} from "./scenes/F1Scenes";
import { F1TrackScene } from "./scenes/F1TrackScene";
import { F1TelemetryScene } from "./scenes/F1TelemetryScene";
import { F1PositionsScene } from "./scenes/F1PositionsScene";
import { Watermark } from "./components/Watermark";

export const F1_FPS = 30;
const F1_MUSIC = "f1.mp3";
const F1_URL = "f1widget.pages.dev";
const F1_ACCENT = "#E10600";

// --- Horizontal --------------------------------------------------------

export const F1_H_WIDTH = 1920;
export const F1_H_HEIGHT = 1080;

const H_HOOK = 2.6 * F1_FPS;
const H_REVEAL = 3.0 * F1_FPS;
const H_POSITIONS = 5.5 * F1_FPS;     // NEW — biggest scene, focused on standings
const H_TELEMETRY = 4.0 * F1_FPS;
const H_TRACK = 4.0 * F1_FPS;
const H_OUTRO = 3.0 * F1_FPS;
const FADE = 18;
const SLIDE_T = 14;

// 5 transitions: 1 fade + 1 slide + 1 fade + 1 fade + 1 fade
export const F1_H_DURATION =
  H_HOOK + H_REVEAL + H_POSITIONS + H_TELEMETRY + H_TRACK + H_OUTRO - FADE * 4 - SLIDE_T;

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

      <TransitionSeries.Sequence durationInFrames={H_POSITIONS}>
        <F1PositionsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_TELEMETRY}>
        <F1TelemetryScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_TRACK}>
        <F1TrackScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <F1OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    {/* Persistent watermark above all scenes */}
    <Watermark url={F1_URL} accentColor={F1_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const F1_V_WIDTH = 1080;
export const F1_V_HEIGHT = 1920;

const V_HOOK = 2.6 * F1_FPS;
const V_REVEAL = 3.0 * F1_FPS;
const V_POSITIONS = 5.5 * F1_FPS;
const V_TELEMETRY = 4.0 * F1_FPS;
const V_TRACK = 4.0 * F1_FPS;
const V_OUTRO = 3.0 * F1_FPS;

export const F1_V_DURATION =
  V_HOOK + V_REVEAL + V_POSITIONS + V_TELEMETRY + V_TRACK + V_OUTRO - FADE * 4 - SLIDE_T;

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

      <TransitionSeries.Sequence durationInFrames={V_POSITIONS}>
        <F1PositionsScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_TELEMETRY}>
        <F1TelemetryScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_TRACK}>
        <F1TrackScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <F1OutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>

    {/* Persistent watermark above all scenes */}
    <Watermark url={F1_URL} accentColor={F1_ACCENT} vertical />
  </AbsoluteFill>
);
