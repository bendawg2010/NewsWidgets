import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  CSHookScene, CSRevealScene, CSSetupScene, CS_SETUP_TOTAL, CSOutroScene,
} from "./scenes/ClassScheduleScenes";
import { Watermark } from "./components/Watermark";

export const CS_FPS = 30;
const CS_MUSIC = "classschedule.mp3";
const CS_URL = "classschedulewidget.pages.dev";
const CS_ACCENT = "#7B61FF";

const FADE = 18;
const SLIDE_T = 14;

// --- Horizontal --------------------------------------------------------

export const CS_H_WIDTH = 1920;
export const CS_H_HEIGHT = 1080;

const H_HOOK = 2.6 * CS_FPS;
const H_REVEAL = 4.5 * CS_FPS;
const H_SETUP = CS_SETUP_TOTAL;
const H_OUTRO = 3.0 * CS_FPS;

export const CS_H_DURATION =
  H_HOOK + H_REVEAL + H_SETUP + H_OUTRO - FADE * 2 - SLIDE_T;

export const CSAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(CS_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_HOOK}>
        <CSHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_REVEAL}>
        <CSRevealScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={H_SETUP}>
        <CSSetupScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <CSOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={CS_URL} accentColor={CS_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const CS_V_WIDTH = 1080;
export const CS_V_HEIGHT = 1920;

const V_HOOK = 2.6 * CS_FPS;
const V_REVEAL = 4.5 * CS_FPS;
const V_SETUP = CS_SETUP_TOTAL;
const V_OUTRO = 3.0 * CS_FPS;

export const CS_V_DURATION =
  V_HOOK + V_REVEAL + V_SETUP + V_OUTRO - FADE * 2 - SLIDE_T;

export const CSAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(CS_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_HOOK}>
        <CSHookScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_REVEAL}>
        <CSRevealScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={V_SETUP}>
        <CSSetupScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <CSOutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={CS_URL} accentColor={CS_ACCENT} vertical />
  </AbsoluteFill>
);
