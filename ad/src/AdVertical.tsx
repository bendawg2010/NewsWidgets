import React from "react";
import { AbsoluteFill, staticFile, interpolate } from "remotion";
import { Audio } from "@remotion/media";
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
import { SourcePickerScene } from "./scenes/SourcePickerScene";
import { WebsiteScene } from "./scenes/WebsiteScene";
import { VerticalOutroScene } from "./scenes/VerticalOutroScene";

export const V_FPS = 30;
export const V_WIDTH = 1080;
export const V_HEIGHT = 1920;

const HOOK = 2.6 * V_FPS;
const REVEAL = 4.0 * V_FPS;
const FEATURES = V_FEATURES_TOTAL;
const SOURCES = 4.5 * V_FPS;
const WEBSITE = 3.5 * V_FPS;
const OUTRO = 3.0 * V_FPS;
const FADE = 18;
const SLIDE_T = 14;

// 5 transitions between 6 sequences (one slide, four fades)
export const V_DURATION =
  HOOK + REVEAL + FEATURES + SOURCES + WEBSITE + OUTRO - FADE * 4 - SLIDE_T;

export const NewsWidgetsAdVertical: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Audio
      src={staticFile("news.mp3")}
      volume={(f) => {
        const fadeInEnd = 0.4 * V_FPS;
        const fadeOutStart = V_DURATION - 0.8 * V_FPS;
        if (f < fadeInEnd) return interpolate(f, [0, fadeInEnd], [0, 0.42]);
        if (f > fadeOutStart) return interpolate(f, [fadeOutStart, V_DURATION], [0.42, 0]);
        return 0.42;
      }}
    />
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

      <TransitionSeries.Sequence durationInFrames={SOURCES}>
        <SourcePickerScene vertical />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: FADE })}
      />

      <TransitionSeries.Sequence durationInFrames={WEBSITE}>
        <WebsiteScene vertical />
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
