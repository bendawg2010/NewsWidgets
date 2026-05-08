// NotchPopAd.tsx — Remotion composition for the NotchPop promo ad.
//
// Stitches together five scenes from `./scenes/NotchPopScenes` with
// fade + slide transitions, layered above a 12s trim of the NCS PRETEND
// track (`public/notchpop.mp3`, with afade in/out applied at trim time).
//
// Two variants:
//   NotchPopAdHorizontal — 1920x1080
//   NotchPopAdVertical   — 1080x1920
//
// Scene order (60+90+90+90+60 frames @ 30fps = 390f / 13s before fades).
// With 4 fade transitions of 10f each: 390 - 40 = 350f / ~11.67s.
//
// Composition IDs registered in src/Root.tsx:
//   - NotchPopAdHorizontal
//   - NotchPopAdVertical

import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  NPHookScene, NPMusicScene, NPPomodoroScene,
  NPDragShelfScene, NPOutroScene,
} from "./scenes/NotchPopScenes";
import { Watermark } from "./components/Watermark";

export const NP_FPS = 30;
const NP_MUSIC = "notchpop.mp3";
const NP_URL = "notchpop.pages.dev";
const NP_ACCENT = "#FF3CAC"; // pink anchor of the gradient

// ---- Scene durations in frames (30fps) ----
const HOOK_F     = 60; // 2.0s
const MUSIC_F    = 90; // 3.0s
const POMODORO_F = 90; // 3.0s
const SHELF_F    = 90; // 3.0s
const OUTRO_F    = 60; // 2.0s

const FADE_F = 10; // transition length

// 4 transitions between 5 scenes.
const TOTAL_RAW = HOOK_F + MUSIC_F + POMODORO_F + SHELF_F + OUTRO_F;
const TOTAL_DUR = TOTAL_RAW - FADE_F * 4;

// --- Horizontal --------------------------------------------------------

export const NP_H_WIDTH = 1920;
export const NP_H_HEIGHT = 1080;
export const NP_H_DURATION = TOTAL_DUR;

export const NotchPopAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#050507" }}>
    <Audio src={staticFile(NP_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={HOOK_F}>
        <NPHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: FADE_F })}
      />

      <TransitionSeries.Sequence durationInFrames={MUSIC_F}>
        <NPMusicScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_F })}
      />

      <TransitionSeries.Sequence durationInFrames={POMODORO_F}>
        <NPPomodoroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: FADE_F })}
      />

      <TransitionSeries.Sequence durationInFrames={SHELF_F}>
        <NPDragShelfScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_F })}
      />

      <TransitionSeries.Sequence durationInFrames={OUTRO_F}>
        <NPOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={NP_URL} accentColor={NP_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const NP_V_WIDTH = 1080;
export const NP_V_HEIGHT = 1920;
export const NP_V_DURATION = TOTAL_DUR;

export const NotchPopAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#050507" }}>
    <Audio src={staticFile(NP_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={HOOK_F}>
        <NPHookScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: FADE_F })}
      />

      <TransitionSeries.Sequence durationInFrames={MUSIC_F}>
        <NPMusicScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_F })}
      />

      <TransitionSeries.Sequence durationInFrames={POMODORO_F}>
        <NPPomodoroScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: FADE_F })}
      />

      <TransitionSeries.Sequence durationInFrames={SHELF_F}>
        <NPDragShelfScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE_F })}
      />

      <TransitionSeries.Sequence durationInFrames={OUTRO_F}>
        <NPOutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={NP_URL} accentColor={NP_ACCENT} vertical />
  </AbsoluteFill>
);
