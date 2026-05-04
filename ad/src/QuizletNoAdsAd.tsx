import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  QNAAdsScene, QNADropScene, QNAImportScene,
  QNAModesScene, QNAFinaleScene, QNA_MODES_DURATION,
} from "./scenes/QuizletNoAdsScenes";
import { Watermark } from "./components/Watermark";

export const QNA_FPS = 30;
const QNA_MUSIC = "quizletnoads.mp3";
const QNA_URL = "studydeck.pages.dev";
const QNA_ACCENT = "#C147FF";
const FADE = 16;
const SLIDE_T = 14;

// --- Horizontal --------------------------------------------------------

export const QNA_H_WIDTH = 1920;
export const QNA_H_HEIGHT = 1080;

const H_ADS    = 3.6 * QNA_FPS;
const H_DROP   = 3.6 * QNA_FPS;
const H_IMPORT = 4.0 * QNA_FPS;
const H_MODES  = QNA_MODES_DURATION;
const H_FINALE = 3.5 * QNA_FPS;

export const QNA_H_DURATION =
  H_ADS + H_DROP + H_IMPORT + H_MODES + H_FINALE - FADE * 3 - SLIDE_T;

export const QuizletNoAdsAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(QNA_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_ADS}>
        <QNAAdsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_DROP}>
        <QNADropScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={H_IMPORT}>
        <QNAImportScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_MODES}>
        <QNAModesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_FINALE}>
        <QNAFinaleScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={QNA_URL} accentColor={QNA_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const QNA_V_WIDTH = 1080;
export const QNA_V_HEIGHT = 1920;

const V_ADS    = 3.6 * QNA_FPS;
const V_DROP   = 3.6 * QNA_FPS;
const V_IMPORT = 4.0 * QNA_FPS;
const V_MODES  = QNA_MODES_DURATION;
const V_FINALE = 3.5 * QNA_FPS;

export const QNA_V_DURATION =
  V_ADS + V_DROP + V_IMPORT + V_MODES + V_FINALE - FADE * 3 - SLIDE_T;

export const QuizletNoAdsAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(QNA_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_ADS}>
        <QNAAdsScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_DROP}>
        <QNADropScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={V_IMPORT}>
        <QNAImportScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_MODES}>
        <QNAModesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_FINALE}>
        <QNAFinaleScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={QNA_URL} accentColor={QNA_ACCENT} vertical />
  </AbsoluteFill>
);
