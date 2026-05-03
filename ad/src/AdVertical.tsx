import React from "react";
import { AbsoluteFill } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { VerticalHookScene } from "./scenes/VerticalHookScene";
import { VerticalRevealScene } from "./scenes/VerticalRevealScene";
import { VerticalFeaturesScene, V_FEATURES_TOTAL } from "./scenes/VerticalFeaturesScene";
import { VerticalOutroScene } from "./scenes/VerticalOutroScene";

export const V_FPS = 30;
export const V_WIDTH = 1080;
export const V_HEIGHT = 1920;

const HOOK = 2.6 * V_FPS;
const REVEAL = 4.0 * V_FPS;
const FEATURES = V_FEATURES_TOTAL;
const OUTRO = 3.0 * V_FPS;
const FADE = 18;
const SLIDE_T = 14;

export const V_DURATION =
  HOOK + REVEAL + FEATURES + OUTRO - FADE * 2 - SLIDE_T;

export const NewsWidgetsAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={HOOK}>
        <VerticalHookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      <TransitionSeries.Sequence durationInFrames={REVEAL}>
        <VerticalRevealScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={springTiming({
          config: { damping: 200 },
          durationInFrames: SLIDE_T,
        })}
      />

      <TransitionSeries.Sequence durationInFrames={FEATURES}>
        <VerticalFeaturesScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      <TransitionSeries.Sequence durationInFrames={OUTRO}>
        <VerticalOutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
