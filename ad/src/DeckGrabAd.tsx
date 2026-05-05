import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  DGAdsScene, DGDropScene, DGImportScene, DGExportScene, DGOutroScene,
} from "./scenes/DeckGrabScenes";
import { Watermark } from "./components/Watermark";

export const DG_FPS = 30;
const DG_MUSIC = "deckgrab.mp3";
const DG_URL = "deckgrab.pages.dev";
const DG_ACCENT = "#C147FF";
const FADE = 16;
const SLIDE_T = 14;

// --- Horizontal --------------------------------------------------------

export const DG_H_WIDTH = 1920;
export const DG_H_HEIGHT = 1080;

const H_ADS    = 4.6 * DG_FPS;
const H_DROP   = 3.6 * DG_FPS;
const H_IMPORT = 4.0 * DG_FPS;
const H_EXPORT = 3.6 * DG_FPS;
const H_OUTRO  = 3.4 * DG_FPS;

export const DG_H_DURATION =
  H_ADS + H_DROP + H_IMPORT + H_EXPORT + H_OUTRO - FADE * 3 - SLIDE_T;

export const DeckGrabAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(DG_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_ADS}>
        <DGAdsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_DROP}>
        <DGDropScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={H_IMPORT}>
        <DGImportScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_EXPORT}>
        <DGExportScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <DGOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={DG_URL} accentColor={DG_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const DG_V_WIDTH = 1080;
export const DG_V_HEIGHT = 1920;

const V_ADS    = 4.6 * DG_FPS;
const V_DROP   = 3.6 * DG_FPS;
const V_IMPORT = 4.0 * DG_FPS;
const V_EXPORT = 3.6 * DG_FPS;
const V_OUTRO  = 3.4 * DG_FPS;

export const DG_V_DURATION =
  V_ADS + V_DROP + V_IMPORT + V_EXPORT + V_OUTRO - FADE * 3 - SLIDE_T;

export const DeckGrabAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(DG_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_ADS}>
        <DGAdsScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_DROP}>
        <DGDropScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={V_IMPORT}>
        <DGImportScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_EXPORT}>
        <DGExportScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <DGOutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={DG_URL} accentColor={DG_ACCENT} vertical />
  </AbsoluteFill>
);
