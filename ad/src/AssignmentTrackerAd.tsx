import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import {
  TransitionSeries, linearTiming, springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import {
  ATPainScene, ATDashboardScene, ATCalendarScene,
  ATStudyingScene, ATFeaturesScene, ATOutroScene,
} from "./scenes/AssignmentTrackerScenes";
import { Watermark } from "./components/Watermark";

export const AT_FPS = 30;
const AT_MUSIC = "assignmenttracker.mp3";
const AT_URL = "assignmenttracker.pages.dev";
const AT_ACCENT = "#06D6A0";
const FADE = 16;
const SLIDE_T = 14;

// --- Horizontal --------------------------------------------------------

export const AT_H_WIDTH = 1920;
export const AT_H_HEIGHT = 1080;

const H_PAIN     = 3.6 * AT_FPS;
const H_DASH     = 5.6 * AT_FPS;
const H_CAL      = 4.4 * AT_FPS;
const H_STUDY    = 6.6 * AT_FPS;
const H_FEATURES = 3.6 * AT_FPS;
const H_OUTRO    = 4.0 * AT_FPS;

export const AT_H_DURATION =
  H_PAIN + H_DASH + H_CAL + H_STUDY + H_FEATURES + H_OUTRO - FADE * 4 - SLIDE_T;

export const AssignmentTrackerAdHorizontal: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(AT_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={H_PAIN}>
        <ATPainScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_DASH}>
        <ATDashboardScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={H_CAL}>
        <ATCalendarScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_STUDY}>
        <ATStudyingScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_FEATURES}>
        <ATFeaturesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={H_OUTRO}>
        <ATOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={AT_URL} accentColor={AT_ACCENT} />
  </AbsoluteFill>
);

// --- Vertical ----------------------------------------------------------

export const AT_V_WIDTH = 1080;
export const AT_V_HEIGHT = 1920;

const V_PAIN     = 3.6 * AT_FPS;
const V_DASH     = 5.6 * AT_FPS;
const V_CAL      = 4.4 * AT_FPS;
const V_STUDY    = 6.6 * AT_FPS;
const V_FEATURES = 3.6 * AT_FPS;
const V_OUTRO    = 4.0 * AT_FPS;

export const AT_V_DURATION =
  V_PAIN + V_DASH + V_CAL + V_STUDY + V_FEATURES + V_OUTRO - FADE * 4 - SLIDE_T;

export const AssignmentTrackerAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio src={staticFile(AT_MUSIC)} volume={0.45} />
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={V_PAIN}>
        <ATPainScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_DASH}>
        <ATDashboardScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: SLIDE_T })}
      />

      <TransitionSeries.Sequence durationInFrames={V_CAL}>
        <ATCalendarScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_STUDY}>
        <ATStudyingScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_FEATURES}>
        <ATFeaturesScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: FADE })} />

      <TransitionSeries.Sequence durationInFrames={V_OUTRO}>
        <ATOutroScene vertical />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Watermark url={AT_URL} accentColor={AT_ACCENT} vertical />
  </AbsoluteFill>
);
