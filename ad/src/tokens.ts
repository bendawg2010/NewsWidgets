// Design tokens shared across the ad — mirror the SwiftUI widget palette.

export const COLORS = {
  bgDeep: "#000000",
  bgGlass: "rgba(28, 28, 30, 0.72)",
  textPrimary: "rgba(255,255,255,0.96)",
  textSecondary: "rgba(235,235,245,0.6)",
  textTertiary: "rgba(235,235,245,0.4)",
  separator: "rgba(255,255,255,0.10)",

  newsRed: "#FA2D48",
  newsRedSoft: "rgba(250, 45, 72, 0.13)",
  newsRedBorder: "rgba(250, 45, 72, 0.25)",

  aiPink: "#ED4799",
  aiPurple: "#A856F7",
  aiBlue: "#3B82F6",
  aiPurpleSoft: "rgba(168, 85, 247, 0.18)",
  aiPurpleBorder: "rgba(168, 85, 247, 0.25)",
} as const;

export const FONT_STACK =
  '-apple-system, "SF Pro Display", "SF Pro Text", BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif';
