import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  SDHookScene, SDRevealScene, SDImportScene, SDModesScene,
  SD_MODES_TOTAL, SDOutroScene,
} from "./scenes/StudyDeckScenes";
import { Watermark } from "./components/Watermark";

export const SD_FPS = 30;
const SD_MUSIC = "studydeck.mp3";
const SD_URL = "studydeck.pages.dev";
const SD_ACCENT = "#C147FF";
const FADE = 18;
const SLIDE_T = 14;

// --- Horizontal --------------------------------------------------------

export const SD_H_WIDTH = 1920;
export const SD_H_HEIGHT = 1080;

const H_HOOK = 2.6 * SD_FPS;
const H_REVEAL = 4.2 * SD_FPS;
const H_IMPORT = 3.5 * SD_FPS;
const H_MODES = SD_MODES_TOTAL;
const H_OUTRO = 3.0 * SD_FPS;

export const SD_H_DURATION =
  H_HOOK + H_REVEAL + H_IMPORT + H_MODES + H_OUTRO - FADE * 3 - SLIDE_T;

export const SDAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(SD_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_HOOK}>
        <SDHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_REVEAL}>
        <SDRevealScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={H_IMPORT}>
        <SDImportScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_MODES}>
        <SDModesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <SDOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={SD_URL} accentColor={SD_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const SD_V_WIDTH = 1080;
export const SD_V_HEIGHT = 1920;

const V_HOOK = 2.6 * SD_FPS;
const V_REVEAL = 4.2 * SD_FPS;
const V_IMPORT = 3.5 * SD_FPS;
const V_MODES = SD_MODES_TOTAL;
const V_OUTRO = 3.0 * SD_FPS;

export const SD_V_DURATION =
  V_HOOK + V_REVEAL + V_IMPORT + V_MODES + V_OUTRO - FADE * 3 - SLIDE_T;

export const SDAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(SD_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_HOOK}>
        <SDHookScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_REVEAL}>
        <SDRevealScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={V_IMPORT}>
        <SDImportScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_MODES}>
        <SDModesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <SDOutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={SD_URL} accentColor={SD_ACCENT} vertical />
  </AbsoluteFill>
);
