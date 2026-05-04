import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  QIHookScene, QIDragScene, QIClickScene, QIResultScene, QIOutroScene,
} from "./scenes/QuizletImportScenes";
import { Watermark } from "./components/Watermark";

export const QI_FPS = 30;
const QI_MUSIC = "quizletimport.mp3";
const QI_URL = "studydeck.pages.dev";
const QI_ACCENT = "#C147FF";
const FADE = 16;
const SLIDE_T = 14;

// --- Horizontal --------------------------------------------------------

export const QI_H_WIDTH = 1920;
export const QI_H_HEIGHT = 1080;

const H_HOOK = 3.0 * QI_FPS;
const H_DRAG = 4.2 * QI_FPS;
const H_CLICK = 4.0 * QI_FPS;
const H_RESULT = 3.4 * QI_FPS;
const H_OUTRO = 3.4 * QI_FPS;

export const QI_H_DURATION =
  H_HOOK + H_DRAG + H_CLICK + H_RESULT + H_OUTRO - FADE * 3 - SLIDE_T;

export const QuizletImportAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(QI_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_HOOK}>
        <QIHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_DRAG}>
        <QIDragScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={H_CLICK}>
        <QIClickScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_RESULT}>
        <QIResultScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <QIOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={QI_URL} accentColor={QI_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const QI_V_WIDTH = 1080;
export const QI_V_HEIGHT = 1920;

const V_HOOK = 3.0 * QI_FPS;
const V_DRAG = 4.2 * QI_FPS;
const V_CLICK = 4.0 * QI_FPS;
const V_RESULT = 3.4 * QI_FPS;
const V_OUTRO = 3.4 * QI_FPS;

export const QI_V_DURATION =
  V_HOOK + V_DRAG + V_CLICK + V_RESULT + V_OUTRO - FADE * 3 - SLIDE_T;

export const QuizletImportAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(QI_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_HOOK}>
        <QIHookScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_DRAG}>
        <QIDragScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={V_CLICK}>
        <QIClickScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_RESULT}>
        <QIResultScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <QIOutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={QI_URL} accentColor={QI_ACCENT} vertical />
  </AbsoluteFill>
);
