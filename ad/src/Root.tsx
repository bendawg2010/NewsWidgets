import React from "react";
import { Composition } from "remotion";
import { NewsWidgetsAd, AD_FPS, AD_WIDTH, AD_HEIGHT, AD_DURATION } from "./Ad";
import {
  NewsWidgetsAdVertical,
  V_FPS,
  V_WIDTH,
  V_HEIGHT,
  V_DURATION,
} from "./AdVertical";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="NewsWidgetsAd"
        component={NewsWidgetsAd}
        durationInFrames={AD_DURATION}
        fps={AD_FPS}
        width={AD_WIDTH}
        height={AD_HEIGHT}
      />
      <Composition
        id="NewsWidgetsAdVertical"
        component={NewsWidgetsAdVertical}
        durationInFrames={V_DURATION}
        fps={V_FPS}
        width={V_WIDTH}
        height={V_HEIGHT}
      />
    </>
  );
};
