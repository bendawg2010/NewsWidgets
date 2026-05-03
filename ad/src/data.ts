import { AIStory } from "./widgets/AIWidget";
import { NewsStory } from "./widgets/NewsWidget";

export const AI_STORIES: AIStory[] = [
  { source: "ARS TECHNICA", ageLabel: "18 hr", title: "Study: AI models that consider user feeling" },
  { source: "TECHCRUNCH",   ageLabel: "19 hr", title: "Meta buys robotics startup to bolster its humanoid AI" },
  { source: "TECHCRUNCH",   ageLabel: "23 hr", title: "Did you know you can't steal a charity?" },
];

export const NEWS_STORIES: NewsStory[] = [
  { source: "FOX NEWS", ageLabel: "3 hr",  title: "ICE lines up to boot illegal immigrant child sex…" },
  { source: "FOX NEWS", ageLabel: "4 hr",  title: "Beloved crossing guard killed by alleged drunk driver" },
  { source: "FOX NEWS", ageLabel: "5 hr",  title: "Bryan Kohberger's mother called him 'my angel'" },
];

export const AI_DATA = {
  stories: AI_STORIES,
  topStoryTitle: "Replit's Amjad Masad on the Cursor deal, fighting Apple",
  time: "1:14 PM",
};

export const NEWS_DATA = {
  stories: NEWS_STORIES,
  topStoryTitle: "Senate passes sweeping budget framework after marathon overnight session",
  time: "1:14 PM",
};
