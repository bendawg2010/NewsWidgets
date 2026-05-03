import React from "react";
import { Composition } from "remotion";
import { NewsWidgetsAd, AD_FPS, AD_WIDTH, AD_HEIGHT, AD_DURATION } from "./Ad";
import {
  NewsWidgetsAdVertical, V_FPS, V_WIDTH, V_HEIGHT, V_DURATION,
} from "./AdVertical";
import {
  SportsAdHorizontal, SportsAdVertical,
  SPORTS_FPS, SPORTS_H_WIDTH, SPORTS_H_HEIGHT, SPORTS_H_DURATION,
  SPORTS_V_WIDTH, SPORTS_V_HEIGHT, SPORTS_V_DURATION,
} from "./SportsAd";
import {
  F1AdHorizontal, F1AdVertical,
  F1_FPS, F1_H_WIDTH, F1_H_HEIGHT, F1_H_DURATION,
  F1_V_WIDTH, F1_V_HEIGHT, F1_V_DURATION,
} from "./F1Ad";
import {
  SportsNewsAdHorizontal, SportsNewsAdVertical,
  SN_FPS, SN_H_WIDTH, SN_H_HEIGHT, SN_H_DURATION,
  SN_V_WIDTH, SN_V_HEIGHT, SN_V_DURATION,
} from "./SportsNewsAd";

export const Root: React.FC = () => (
  <>
    {/* News Widgets */}
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

    {/* Sports tracker */}
    <Composition
      id="SportsAdHorizontal"
      component={SportsAdHorizontal}
      durationInFrames={SPORTS_H_DURATION}
      fps={SPORTS_FPS}
      width={SPORTS_H_WIDTH}
      height={SPORTS_H_HEIGHT}
    />
    <Composition
      id="SportsAdVertical"
      component={SportsAdVertical}
      durationInFrames={SPORTS_V_DURATION}
      fps={SPORTS_FPS}
      width={SPORTS_V_WIDTH}
      height={SPORTS_V_HEIGHT}
    />

    {/* F1 tracker */}
    <Composition
      id="F1AdHorizontal"
      component={F1AdHorizontal}
      durationInFrames={F1_H_DURATION}
      fps={F1_FPS}
      width={F1_H_WIDTH}
      height={F1_H_HEIGHT}
    />
    <Composition
      id="F1AdVertical"
      component={F1AdVertical}
      durationInFrames={F1_V_DURATION}
      fps={F1_FPS}
      width={F1_V_WIDTH}
      height={F1_V_HEIGHT}
    />

    {/* Sports News tracker */}
    <Composition
      id="SportsNewsAdHorizontal"
      component={SportsNewsAdHorizontal}
      durationInFrames={SN_H_DURATION}
      fps={SN_FPS}
      width={SN_H_WIDTH}
      height={SN_H_HEIGHT}
    />
    <Composition
      id="SportsNewsAdVertical"
      component={SportsNewsAdVertical}
      durationInFrames={SN_V_DURATION}
      fps={SN_FPS}
      width={SN_V_WIDTH}
      height={SN_V_HEIGHT}
    />
  </>
);
