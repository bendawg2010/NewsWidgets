import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  DIHookScene, DISingleWidgetScene, DIGalleryScene,
  DIAddingScene, DIFeaturesScene, DIOutroScene,
} from "./scenes/DueInScenes";
import { Watermark } from "./components/Watermark";

export const DI_FPS = 30;
const DI_MUSIC = "duein.mp3";
const DI_URL = "duein.pages.dev";
const DI_ACCENT = "#FF7A45";
const FADE = 16;
const SLIDE_T = 14;

// --- Horizontal --------------------------------------------------------

export const DI_H_WIDTH = 1920;
export const DI_H_HEIGHT = 1080;

const H_HOOK     = 4.0 * DI_FPS;
const H_SINGLE   = 4.6 * DI_FPS;
const H_GALLERY  = 4.6 * DI_FPS;
const H_ADD      = 5.2 * DI_FPS;
const H_FEATURES = 3.6 * DI_FPS;
const H_OUTRO    = 4.0 * DI_FPS;

export const DI_H_DURATION =
  H_HOOK + H_SINGLE + H_GALLERY + H_ADD + H_FEATURES + H_OUTRO - FADE * 4 - SLIDE_T;

export const DueInAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(DI_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_HOOK}>
        <DIHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_SINGLE}>
        <DISingleWidgetScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={H_GALLERY}>
        <DIGalleryScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_ADD}>
        <DIAddingScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_FEATURES}>
        <DIFeaturesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <DIOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={DI_URL} accentColor={DI_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const DI_V_WIDTH = 1080;
export const DI_V_HEIGHT = 1920;

const V_HOOK     = 4.0 * DI_FPS;
const V_SINGLE   = 4.6 * DI_FPS;
const V_GALLERY  = 4.6 * DI_FPS;
const V_ADD      = 5.2 * DI_FPS;
const V_FEATURES = 3.6 * DI_FPS;
const V_OUTRO    = 4.0 * DI_FPS;

export const DI_V_DURATION =
  V_HOOK + V_SINGLE + V_GALLERY + V_ADD + V_FEATURES + V_OUTRO - FADE * 4 - SLIDE_T;

export const DueInAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(DI_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_HOOK}>
        <DIHookScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_SINGLE}>
        <DISingleWidgetScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={V_GALLERY}>
        <DIGalleryScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_ADD}>
        <DIAddingScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_FEATURES}>
        <DIFeaturesScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <DIOutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={DI_URL} accentColor={DI_ACCENT} vertical />
  </AbsoluteFill>
);
