import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import {
  SDMHookScene, SDMFlashcardsScene, SDMSpellScene, SDMMatchScene,
  SDMBlocksScene, SDMBlockBlastScene, SDMTestScene, SDMOutroScene,
} from "./scenes/StudyDeckModesScenes";
import { Watermark } from "./components/Watermark";

export const SDM_FPS = 30;
const SDM_MUSIC = "studydeckmodes.mp3";
const SDM_URL = "studydeck.pages.dev";
const SDM_ACCENT = "#C147FF";
const FADE = 14;

// 3.0 hook + 6 × 4.0 modes + 3.5 outro = 30.5s, minus 7 fades.

const HOOK_S   = 3.0;
const MODE_S   = 4.0;
const OUTRO_S  = 3.5;

// --- Horizontal --------------------------------------------------------

export const SDM_H_WIDTH = 1920;
export const SDM_H_HEIGHT = 1080;

export const SDM_H_DURATION =
  (HOOK_S + 6 * MODE_S + OUTRO_S) * SDM_FPS - FADE * 7;

export const StudyDeckModesAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(SDM_MUSIC)} volume={0.40} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={HOOK_S * SDM_FPS}>
        <SDMHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMFlashcardsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMSpellScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMMatchScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMBlocksScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMBlockBlastScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMTestScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={OUTRO_S * SDM_FPS}>
        <SDMOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={SDM_URL} accentColor={SDM_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const SDM_V_WIDTH = 1080;
export const SDM_V_HEIGHT = 1920;

export const SDM_V_DURATION =
  (HOOK_S + 6 * MODE_S + OUTRO_S) * SDM_FPS - FADE * 7;

export const StudyDeckModesAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(SDM_MUSIC)} volume={0.40} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={HOOK_S * SDM_FPS}>
        <SDMHookScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMFlashcardsScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMSpellScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMMatchScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMBlocksScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMBlockBlastScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={MODE_S * SDM_FPS}>
        <SDMTestScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={OUTRO_S * SDM_FPS}>
        <SDMOutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={SDM_URL} accentColor={SDM_ACCENT} vertical />
  </AbsoluteFill>
);
