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
import {
  CSAdHorizontal, CSAdVertical,
  CS_FPS, CS_H_WIDTH, CS_H_HEIGHT, CS_H_DURATION,
  CS_V_WIDTH, CS_V_HEIGHT, CS_V_DURATION,
} from "./CSAd";
import {
  SDAdHorizontal, SDAdVertical,
  SD_FPS, SD_H_WIDTH, SD_H_HEIGHT, SD_H_DURATION,
  SD_V_WIDTH, SD_V_HEIGHT, SD_V_DURATION,
} from "./SDAd";
import {
  DeckGrabAdHorizontal, DeckGrabAdVertical,
  DG_FPS, DG_H_WIDTH, DG_H_HEIGHT, DG_H_DURATION,
  DG_V_WIDTH, DG_V_HEIGHT, DG_V_DURATION,
} from "./DeckGrabAd";
import {
  AssignmentTrackerAdHorizontal, AssignmentTrackerAdVertical,
  AT_FPS, AT_H_WIDTH, AT_H_HEIGHT, AT_H_DURATION,
  AT_V_WIDTH, AT_V_HEIGHT, AT_V_DURATION,
} from "./AssignmentTrackerAd";
import {
  DueInAdHorizontal, DueInAdVertical,
  DI_FPS, DI_H_WIDTH, DI_H_HEIGHT, DI_H_DURATION,
  DI_V_WIDTH, DI_V_HEIGHT, DI_V_DURATION,
} from "./DueInAd";
import {
  DeckGrabDemoAdHorizontal, DeckGrabDemoAdVertical,
  DGD_FPS, DGD_H_WIDTH, DGD_H_HEIGHT, DGD_H_DURATION,
  DGD_V_WIDTH, DGD_V_HEIGHT, DGD_V_DURATION,
} from "./DeckGrabDemoAd";
import {
  StudyDeckModesAdHorizontal, StudyDeckModesAdVertical,
  SDM_FPS, SDM_H_WIDTH, SDM_H_HEIGHT, SDM_H_DURATION,
  SDM_V_WIDTH, SDM_V_HEIGHT, SDM_V_DURATION,
} from "./StudyDeckModesAd";
import {
  NotchPopAdHorizontal, NotchPopAdVertical,
  NP_FPS, NP_H_WIDTH, NP_H_HEIGHT, NP_H_DURATION,
  NP_V_WIDTH, NP_V_HEIGHT, NP_V_DURATION,
} from "./NotchPopAd";

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

    {/* Class Schedule */}
    <Composition
      id="CSAdHorizontal"
      component={CSAdHorizontal}
      durationInFrames={CS_H_DURATION}
      fps={CS_FPS}
      width={CS_H_WIDTH}
      height={CS_H_HEIGHT}
    />
    <Composition
      id="CSAdVertical"
      component={CSAdVertical}
      durationInFrames={CS_V_DURATION}
      fps={CS_FPS}
      width={CS_V_WIDTH}
      height={CS_V_HEIGHT}
    />

    {/* StudyDeck — Quizlet alternative */}
    <Composition
      id="SDAdHorizontal"
      component={SDAdHorizontal}
      durationInFrames={SD_H_DURATION}
      fps={SD_FPS}
      width={SD_H_WIDTH}
      height={SD_H_HEIGHT}
    />
    <Composition
      id="SDAdVertical"
      component={SDAdVertical}
      durationInFrames={SD_V_DURATION}
      fps={SD_FPS}
      width={SD_V_WIDTH}
      height={SD_V_HEIGHT}
    />

    {/* DeckGrab — Quizlet bookmarklet exporter */}
    <Composition
      id="DeckGrabAdHorizontal"
      component={DeckGrabAdHorizontal}
      durationInFrames={DG_H_DURATION}
      fps={DG_FPS}
      width={DG_H_WIDTH}
      height={DG_H_HEIGHT}
    />
    <Composition
      id="DeckGrabAdVertical"
      component={DeckGrabAdVertical}
      durationInFrames={DG_V_DURATION}
      fps={DG_FPS}
      width={DG_V_WIDTH}
      height={DG_V_HEIGHT}
    />

    {/* AssignmentTracker — student assignment manager */}
    <Composition
      id="AssignmentTrackerAdHorizontal"
      component={AssignmentTrackerAdHorizontal}
      durationInFrames={AT_H_DURATION}
      fps={AT_FPS}
      width={AT_H_WIDTH}
      height={AT_H_HEIGHT}
    />
    <Composition
      id="AssignmentTrackerAdVertical"
      component={AssignmentTrackerAdVertical}
      durationInFrames={AT_V_DURATION}
      fps={AT_FPS}
      width={AT_V_WIDTH}
      height={AT_V_HEIGHT}
    />

    {/* DueIn — macOS countdown widget */}
    <Composition
      id="DueInAdHorizontal"
      component={DueInAdHorizontal}
      durationInFrames={DI_H_DURATION}
      fps={DI_FPS}
      width={DI_H_WIDTH}
      height={DI_H_HEIGHT}
    />
    <Composition
      id="DueInAdVertical"
      component={DueInAdVertical}
      durationInFrames={DI_V_DURATION}
      fps={DI_FPS}
      width={DI_V_WIDTH}
      height={DI_V_HEIGHT}
    />

    {/* DeckGrab — live demo from screen recording */}
    <Composition
      id="DeckGrabDemoAdHorizontal"
      component={DeckGrabDemoAdHorizontal}
      durationInFrames={DGD_H_DURATION}
      fps={DGD_FPS}
      width={DGD_H_WIDTH}
      height={DGD_H_HEIGHT}
    />
    <Composition
      id="DeckGrabDemoAdVertical"
      component={DeckGrabDemoAdVertical}
      durationInFrames={DGD_V_DURATION}
      fps={DGD_FPS}
      width={DGD_V_WIDTH}
      height={DGD_V_HEIGHT}
    />

    {/* StudyDeck — all six game modes showcase */}
    <Composition
      id="StudyDeckModesAdHorizontal"
      component={StudyDeckModesAdHorizontal}
      durationInFrames={SDM_H_DURATION}
      fps={SDM_FPS}
      width={SDM_H_WIDTH}
      height={SDM_H_HEIGHT}
    />
    <Composition
      id="StudyDeckModesAdVertical"
      component={StudyDeckModesAdVertical}
      durationInFrames={SDM_V_DURATION}
      fps={SDM_FPS}
      width={SDM_V_WIDTH}
      height={SDM_V_HEIGHT}
    />

    {/* NotchPop — macOS notch utility */}
    <Composition
      id="NotchPopAdHorizontal"
      component={NotchPopAdHorizontal}
      durationInFrames={NP_H_DURATION}
      fps={NP_FPS}
      width={NP_H_WIDTH}
      height={NP_H_HEIGHT}
    />
    <Composition
      id="NotchPopAdVertical"
      component={NotchPopAdVertical}
      durationInFrames={NP_V_DURATION}
      fps={NP_FPS}
      width={NP_V_WIDTH}
      height={NP_V_HEIGHT}
    />
  </>
);
