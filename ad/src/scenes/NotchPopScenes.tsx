// NotchPopScenes.tsx — five scenes for the NotchPop promo ad.
// NotchPop is a macOS notch utility: hover the MacBook notch and it expands
// into a tabbed surface (Music, Pomodoro, Shelf, Timers, World Clock, Notes,
// Battery). Each scene below renders one tab + chrome on a black-first
// gradient backdrop. The notch itself is always pure #000.
//
// Scene durations (30fps):
//   NPHookScene      — 60f / 2s
//   NPMusicScene     — 90f / 3s
//   NPPomodoroScene  — 90f / 3s
//   NPDragShelfScene — 90f / 3s
//   NPOutroScene     — 60f / 2s
//
// Linked together via TransitionSeries in NotchPopAd.tsx.

import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { FONT_STACK } from "../tokens";

// ---------------------------------------------------------------------------
// Brand palette (locked)
// ---------------------------------------------------------------------------

export const NP_BG       = "#050507";
export const NP_PINK     = "#FF3CAC";
export const NP_PURPLE   = "#784BA0";
export const NP_BLUE     = "#2B86C5";
export const NP_GRADIENT = `linear-gradient(135deg, ${NP_PINK} 0%, ${NP_PURPLE} 50%, ${NP_BLUE} 100%)`;
export const NP_GRADIENT_HORIZ = `linear-gradient(90deg, ${NP_PINK} 0%, ${NP_PURPLE} 50%, ${NP_BLUE} 100%)`;

// Continuous-corner squircle approximation: a rounded rect whose radius is
// proportionally large + uses the largest single radius value the browser
// will smoothly anti-alias. The trick is keeping radius/min-dim ratio < 0.5
// and applying the same to all four corners.
const squircleRadius = (w: number, h: number, ratio = 0.32) =>
  Math.min(w, h) * ratio;

// ---------------------------------------------------------------------------
// Wallpaper backdrop
// ---------------------------------------------------------------------------

const NPWallpaper: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{ background: NP_BG }} />
    <AbsoluteFill style={{
      background:
        `radial-gradient(1400px 900px at 22% 18%, ${NP_PINK}33, transparent 65%),` +
        `radial-gradient(1200px 800px at 78% 88%, ${NP_BLUE}33, transparent 65%),` +
        `radial-gradient(900px 600px at 50% 50%, ${NP_PURPLE}26, transparent 70%)`,
    }} />
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
    }} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// MacBook + notch chrome
// ---------------------------------------------------------------------------

/**
 * Renders the top portion of a MacBook lid — a black bar with the notch
 * cut into it. `notchW` and `notchH` control the notch's expanded size.
 * When collapsed, pass the default ~ (200, 32).
 */
const MacNotch: React.FC<{
  notchW: number;
  notchH: number;
  vertical: boolean;
  children?: React.ReactNode;
  /** 0..1 — how "open" the notch is. Used purely for shadow/gradient pulse. */
  openness?: number;
}> = ({ notchW, notchH, vertical, children, openness = 0 }) => {
  const lidW  = vertical ? 980 : 1280;
  const lidH  = vertical ? 90  : 110;
  const radius = squircleRadius(notchW, notchH, 0.28);
  return (
    <div style={{
      position: "relative",
      width: lidW,
      height: Math.max(lidH, notchH + 30),
      display: "flex", justifyContent: "center", alignItems: "flex-start",
    }}>
      {/* The lid bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: lidH,
        background: "#000",
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        boxShadow:
          `inset 0 -2px 4px rgba(255,255,255,0.04),` +
          ` 0 24px 60px rgba(0,0,0,0.55)`,
      }} />
      {/* The notch */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: notchW,
        height: notchH,
        background: "#000",
        borderBottomLeftRadius: radius,
        borderBottomRightRadius: radius,
        // Subtle accent halo while expanded
        boxShadow: openness > 0
          ? `0 0 ${40 * openness}px ${10 * openness}px ${NP_PURPLE}33,` +
            ` 0 24px 60px rgba(0,0,0,0.6)`
          : `0 6px 18px rgba(0,0,0,0.6)`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        color: "white",
        fontFamily: FONT_STACK,
      }}>
        {children}
      </div>
    </div>
  );
};

/** Battery indicator inline (top-right of notch when expanded). */
const BatteryChip: React.FC<{ percent: number }> = ({ percent }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    color: "rgba(255,255,255,0.86)",
    fontSize: 14, fontWeight: 700, letterSpacing: -0.2,
  }}>
    <div style={{
      width: 28, height: 13, borderRadius: 4,
      border: "1.5px solid rgba(255,255,255,0.55)",
      position: "relative",
      padding: 1.5,
    }}>
      <div style={{
        width: `${percent}%`, height: "100%",
        background: percent > 20 ? "#34C759" : NP_PINK,
        borderRadius: 2,
      }} />
      <div style={{
        position: "absolute",
        right: -3, top: 3, bottom: 3, width: 2,
        background: "rgba(255,255,255,0.55)",
        borderRadius: 1,
      }} />
    </div>
    <span style={{ fontVariantNumeric: "tabular-nums" }}>{percent}%</span>
  </div>
);

/** Tiny transport buttons used by Music + Pomodoro tabs. */
const TransportButtons: React.FC<{ centerKind?: "play" | "pause" }> = ({
  centerKind = "pause",
}) => (
  <div style={{
    display: "flex", gap: 14, alignItems: "center", justifyContent: "center",
  }}>
    <TransportBtn>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="white">
        <path d="M6 4h2v16H6zM10 12L20 4v16z" />
      </svg>
    </TransportBtn>
    <TransportBtn primary>
      {centerKind === "pause" ? (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="white">
          <rect x="6" y="4" width="4" height="16" rx="1.2" />
          <rect x="14" y="4" width="4" height="16" rx="1.2" />
        </svg>
      ) : (
        <svg width={20} height={20} viewBox="0 0 24 24" fill="white">
          <path d="M6 4l14 8-14 8z" />
        </svg>
      )}
    </TransportBtn>
    <TransportBtn>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="white">
        <path d="M16 4h2v16h-2zM4 4l10 8-10 8z" />
      </svg>
    </TransportBtn>
  </div>
);

const TransportBtn: React.FC<{ primary?: boolean; children: React.ReactNode }> = ({
  primary, children,
}) => (
  <div style={{
    width: primary ? 44 : 36,
    height: primary ? 44 : 36,
    borderRadius: primary ? 14 : 11,
    background: primary ? NP_GRADIENT : "rgba(255,255,255,0.08)",
    border: primary ? "none" : "1px solid rgba(255,255,255,0.12)",
    display: "grid", placeItems: "center",
    boxShadow: primary
      ? `0 6px 18px ${NP_PINK}55, inset 0 1px 0 rgba(255,255,255,0.18)`
      : "inset 0 1px 0 rgba(255,255,255,0.08)",
  }}>
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Scene 1 — Hook
// ---------------------------------------------------------------------------

export const NPHookScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame, fps, config: { damping: 18 } });
  const t2 = spring({ frame: frame - 0.35 * fps, fps, config: { damping: 20 } });
  const lidSp = spring({ frame: frame - 0.6 * fps, fps, config: { damping: 22, stiffness: 110 } });

  const fontSize = vertical ? 110 : 96;

  return (
    <AbsoluteFill style={{ background: NP_BG }}>
      <NPWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
        flexDirection: "column", gap: vertical ? 48 : 40,
      }}>
        <div style={{
          opacity: t1,
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
        }}>
          Your MacBook notch,
        </div>
        <div style={{
          opacity: t2,
          marginTop: -22,
          transform: `translateY(${interpolate(t2, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
          background: NP_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          but useful.
        </div>

        {/* MacBook silhouette with notch */}
        <div style={{
          opacity: lidSp,
          transform: `translateY(${interpolate(lidSp, [0, 1], [40, 0])}px)`,
          marginTop: vertical ? 30 : 24,
        }}>
          <MacNotch
            vertical={vertical}
            notchW={vertical ? 240 : 220}
            notchH={36}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Scene 2 — Music tab
// ---------------------------------------------------------------------------

export const NPMusicScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const expand = spring({ frame, fps, config: { damping: 20, stiffness: 110 } });
  const innerSp = spring({ frame: frame - 0.25 * fps, fps, config: { damping: 22 } });

  // Notch expands from collapsed (220x36) to a wide tabbed surface.
  const collapsedW = 220, collapsedH = 36;
  const expandedW = vertical ? 720 : 720;
  const expandedH = vertical ? 260 : 260;

  const notchW = interpolate(expand, [0, 1], [collapsedW, expandedW]);
  const notchH = interpolate(expand, [0, 1], [collapsedH, expandedH]);

  // Animated progress bar 18% -> 62%
  const prog = interpolate(frame, [0, 90], [0.18, 0.62], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: NP_BG }}>
      <NPWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "flex-start",
        fontFamily: FONT_STACK, color: "white",
        paddingTop: vertical ? 320 : 200,
      }}>
        <MacNotch
          vertical={vertical}
          notchW={notchW}
          notchH={notchH}
          openness={expand}
        >
          {/* Tab bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 18px 6px",
            opacity: innerSp,
            transform: `translateY(${interpolate(innerSp, [0, 1], [-8, 0])}px)`,
          }}>
            <Tabs active="Music" />
            <BatteryChip percent={84} />
          </div>

          {/* Music body */}
          <div style={{
            display: "flex", gap: 18, padding: "8px 20px 18px",
            alignItems: "center",
            opacity: innerSp,
          }}>
            {/* Album art (gradient placeholder) */}
            <div style={{
              width: 130, height: 130,
              borderRadius: 22,
              background: NP_GRADIENT,
              boxShadow:
                `inset 0 1px 0 rgba(255,255,255,0.20),` +
                ` 0 12px 32px ${NP_PURPLE}55`,
              flexShrink: 0,
              position: "relative",
              overflow: "hidden",
            }}>
              <svg width="60" height="60" viewBox="0 0 24 24"
                   style={{ position: "absolute", left: 35, top: 35, opacity: 0.85 }} fill="white">
                <path d="M12 3v10.55a4 4 0 1 0 2 3.45V7h4V3h-6z" />
              </svg>
            </div>
            {/* Right column */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{
                fontSize: 22, fontWeight: 800, letterSpacing: -0.6, lineHeight: 1.05,
              }}>Midnight Drive</div>
              <div style={{
                fontSize: 14, fontWeight: 600,
                color: "rgba(255,255,255,0.55)", letterSpacing: -0.1,
              }}>NotchPop FM</div>
              {/* Progress bar */}
              <div style={{ marginTop: 6 }}>
                <div style={{
                  position: "relative",
                  height: 6, borderRadius: 999,
                  background: "rgba(255,255,255,0.10)",
                  overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: `${prog * 100}%`,
                    background: NP_GRADIENT_HORIZ,
                    borderRadius: 999,
                    boxShadow: `0 0 12px ${NP_PINK}88`,
                  }} />
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  fontSize: 11, fontWeight: 600,
                  color: "rgba(255,255,255,0.5)", marginTop: 6,
                  fontVariantNumeric: "tabular-nums",
                }}>
                  <span>{formatTime(prog * 215)}</span>
                  <span>3:35</span>
                </div>
              </div>
              {/* Transport */}
              <div style={{ marginTop: 4 }}>
                <TransportButtons centerKind="pause" />
              </div>
            </div>
          </div>
        </MacNotch>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

// ---------------------------------------------------------------------------
// Scene 3 — Pomodoro tab
// ---------------------------------------------------------------------------

export const NPPomodoroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const expand = spring({ frame, fps, config: { damping: 20, stiffness: 110 } });
  const innerSp = spring({ frame: frame - 0.25 * fps, fps, config: { damping: 22 } });

  const collapsedW = 220, collapsedH = 36;
  const expandedW = 720;
  const expandedH = 280;
  const notchW = interpolate(expand, [0, 1], [collapsedW, expandedW]);
  const notchH = interpolate(expand, [0, 1], [collapsedH, expandedH]);

  // Slow rotation: 1 full turn per 8s (240 frames). Subtle.
  const ringSpin = (frame / (fps * 8)) * 360;

  return (
    <AbsoluteFill style={{ background: NP_BG }}>
      <NPWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "flex-start",
        fontFamily: FONT_STACK, color: "white",
        paddingTop: vertical ? 320 : 200,
      }}>
        <MacNotch
          vertical={vertical}
          notchW={notchW}
          notchH={notchH}
          openness={expand}
        >
          {/* Tab bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 18px 6px",
            opacity: innerSp,
            transform: `translateY(${interpolate(innerSp, [0, 1], [-8, 0])}px)`,
          }}>
            <Tabs active="Pomodoro" />
            <BatteryChip percent={84} />
          </div>
          {/* Body */}
          <div style={{
            display: "flex", gap: 22, padding: "8px 24px 18px",
            alignItems: "center", justifyContent: "space-between",
            opacity: innerSp,
          }}>
            {/* Ring */}
            <div style={{
              width: 150, height: 150, position: "relative",
              flexShrink: 0,
              transform: `rotate(${ringSpin}deg)`,
            }}>
              <svg width={150} height={150} viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="np-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={NP_PINK} />
                    <stop offset="50%" stopColor={NP_PURPLE} />
                    <stop offset="100%" stopColor={NP_BLUE} />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="none"
                        stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none"
                        stroke="url(#np-ring)" strokeWidth="9"
                        strokeLinecap="round"
                        strokeDasharray={`${0.6 * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
                        transform="rotate(-90 50 50)" />
              </svg>
              <div style={{
                position: "absolute", inset: 0,
                display: "grid", placeItems: "center",
                fontSize: 32, fontWeight: 800, letterSpacing: -1,
                color: "white",
                fontVariantNumeric: "tabular-nums",
                transform: `rotate(${-ringSpin}deg)`,
                textShadow: `0 0 24px ${NP_PURPLE}aa`,
              }}>14:32</div>
            </div>

            {/* Right column */}
            <div style={{
              flex: 1, display: "flex", flexDirection: "column", gap: 12,
              alignItems: "stretch",
            }}>
              {/* Phase pills */}
              <div style={{ display: "flex", gap: 8 }}>
                <PhasePill label="Focus" emoji="🍅" active />
                <PhasePill label="Short" emoji="☕" />
                <PhasePill label="Long" emoji="🌴" />
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: "rgba(255,255,255,0.55)", letterSpacing: -0.1,
              }}>
                Session 2 of 4 · 25 min focus
              </div>
              <TransportButtons centerKind="pause" />
            </div>
          </div>
        </MacNotch>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const PhasePill: React.FC<{ label: string; emoji: string; active?: boolean }> = ({
  label, emoji, active,
}) => (
  <div style={{
    padding: "6px 12px",
    borderRadius: 999,
    background: active ? NP_GRADIENT : "rgba(255,255,255,0.06)",
    border: active ? "none" : "1px solid rgba(255,255,255,0.12)",
    fontSize: 12, fontWeight: 800,
    color: "white",
    display: "inline-flex", gap: 6, alignItems: "center",
    boxShadow: active ? `0 4px 14px ${NP_PINK}55` : "none",
  }}>
    <span style={{ fontSize: 13 }}>{emoji}</span>
    <span style={{ letterSpacing: -0.1 }}>{label}</span>
  </div>
);

// ---------------------------------------------------------------------------
// Scene 4 — Drag a file into the Shelf
// ---------------------------------------------------------------------------

export const NPDragShelfScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phases (90 frames @ 30fps = 3s):
  //   0..30  : notch collapsed, file flies in from right toward notch
  //   30..50 : notch expands open
  //   50..90 : file thumbnail materializes inside Shelf
  const flyP = interpolate(frame, [0, 28], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const expandT = interpolate(frame, [28, 52], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const expandSp = spring({
    frame: frame - 28, fps, config: { damping: 20, stiffness: 110 },
  });
  const expand = Math.max(expandT, expandSp);

  const showThumb = frame > 50;
  const thumbSp = spring({
    frame: frame - 52, fps, config: { damping: 18, stiffness: 130 },
  });

  const collapsedW = 220, collapsedH = 36;
  const expandedW = 720;
  const expandedH = 220;
  const notchW = interpolate(expand, [0, 1], [collapsedW, expandedW]);
  const notchH = interpolate(expand, [0, 1], [collapsedH, expandedH]);

  // File icon path: starts off-screen right, ends roughly at notch center.
  const startX = vertical ? 1200 :  2200;
  const endX = vertical ? 540 : 960;
  const startY = vertical ? 200 : 100;
  const endY = vertical ? 400 : 240;
  const fileX = interpolate(flyP, [0, 1], [startX, endX]);
  const fileY = interpolate(flyP, [0, 1], [startY, endY]);
  const fileScale = interpolate(flyP, [0, 1], [1.0, 0.4]);
  const fileOpacity = interpolate(frame, [0, 4, 26, 30], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: NP_BG }}>
      <NPWallpaper />

      {/* Drag-trail breadcrumbs */}
      {Array.from({ length: 6 }).map((_, i) => {
        const tailP = Math.max(0, flyP - i * 0.07);
        const tailX = interpolate(tailP, [0, 1], [startX, endX]);
        const tailY = interpolate(tailP, [0, 1], [startY, endY]);
        const op = interpolate(tailP, [0, 1], [0, 0.4]) * (1 - i * 0.15);
        if (op <= 0 || frame > 30) return null;
        return (
          <div key={i} style={{
            position: "absolute", left: tailX + 30, top: tailY + 30,
            width: 8, height: 8, borderRadius: "50%",
            background: NP_PINK,
            opacity: op,
            filter: "blur(2px)",
            transform: `translate(-50%, -50%)`,
          }} />
        );
      })}

      {/* Flying file icon */}
      {frame < 30 && (
        <div style={{
          position: "absolute",
          left: fileX, top: fileY,
          transform: `scale(${fileScale}) rotate(${flyP * 18}deg)`,
          opacity: fileOpacity,
        }}>
          <FileIcon />
        </div>
      )}

      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "flex-start",
        fontFamily: FONT_STACK, color: "white",
        paddingTop: vertical ? 320 : 200,
      }}>
        <MacNotch
          vertical={vertical}
          notchW={notchW}
          notchH={notchH}
          openness={expand}
        >
          {/* Tab bar */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 18px 6px",
            opacity: expand,
          }}>
            <Tabs active="Shelf" />
            <BatteryChip percent={84} />
          </div>

          {/* Shelf body */}
          <div style={{
            display: "flex", gap: 14, padding: "10px 22px 18px",
            opacity: expand,
            alignItems: "center",
          }}>
            {/* Existing files */}
            <ShelfThumb label="report.pdf" tone={NP_PURPLE} />
            <ShelfThumb label="cover.png" tone={NP_BLUE} />
            <ShelfThumb label="notes.txt" tone={NP_PINK} />

            {/* The new file materializing */}
            <div style={{
              opacity: showThumb ? thumbSp : 0,
              transform: `scale(${showThumb ? interpolate(thumbSp, [0, 1], [0.4, 1]) : 0.4})`,
            }}>
              <ShelfThumb label="hero.jpg" tone="#34C759" highlight />
            </div>

            {/* "Drop here" placeholder while empty */}
            {!showThumb && (
              <div style={{
                width: 80, height: 80,
                borderRadius: 18,
                border: "2px dashed rgba(255,255,255,0.25)",
                display: "grid", placeItems: "center",
                fontSize: 12, fontWeight: 700,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: -0.2,
                textAlign: "center",
                padding: 6,
              }}>Drop here</div>
            )}
          </div>
        </MacNotch>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FileIcon: React.FC = () => (
  <div style={{
    width: 110, height: 132,
    borderRadius: 14,
    background: "linear-gradient(180deg, #ffffff 0%, #d8d8e0 100%)",
    boxShadow:
      `0 18px 60px rgba(0,0,0,0.55),` +
      `0 0 24px ${NP_PINK}66`,
    border: "1px solid rgba(255,255,255,0.4)",
    position: "relative",
    display: "flex", flexDirection: "column",
    padding: 12,
    fontFamily: FONT_STACK,
  }}>
    {/* Folded corner */}
    <div style={{
      position: "absolute", top: 0, right: 0,
      width: 28, height: 28,
      background: "rgba(0,0,0,0.10)",
      clipPath: "polygon(100% 0, 0 0, 100% 100%)",
    }} />
    <div style={{
      width: 60, height: 6, borderRadius: 3,
      background: NP_GRADIENT_HORIZ, marginBottom: 8,
    }} />
    <div style={{ width: 80, height: 4, borderRadius: 2, background: "#999", marginBottom: 4 }} />
    <div style={{ width: 64, height: 4, borderRadius: 2, background: "#bbb", marginBottom: 4 }} />
    <div style={{ width: 72, height: 4, borderRadius: 2, background: "#bbb", marginBottom: 4 }} />
    <div style={{ width: 50, height: 4, borderRadius: 2, background: "#ccc" }} />
    <div style={{
      position: "absolute", bottom: 8, left: 12,
      fontSize: 10, fontWeight: 800,
      color: NP_PURPLE,
      letterSpacing: 1,
    }}>HERO.JPG</div>
  </div>
);

const ShelfThumb: React.FC<{
  label: string; tone: string; highlight?: boolean;
}> = ({ label, tone, highlight }) => (
  <div style={{
    width: 80, height: 80,
    borderRadius: 18,
    background: highlight
      ? `linear-gradient(135deg, ${tone}cc 0%, ${tone}66 100%)`
      : `linear-gradient(135deg, ${tone}66 0%, ${tone}22 100%)`,
    border: highlight
      ? `1.5px solid ${tone}`
      : `1px solid ${tone}55`,
    boxShadow: highlight
      ? `0 0 24px ${tone}aa, inset 0 1px 0 rgba(255,255,255,0.18)`
      : "inset 0 1px 0 rgba(255,255,255,0.10)",
    display: "flex", flexDirection: "column", justifyContent: "flex-end",
    padding: 8,
    color: "white",
    fontSize: 10, fontWeight: 800,
    letterSpacing: -0.1,
    overflow: "hidden",
  }}>
    <div style={{
      flex: 1,
      background: `linear-gradient(135deg, ${tone}88, transparent)`,
      borderRadius: 10,
      marginBottom: 6,
      opacity: 0.7,
    }} />
    <div style={{
      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
    }}>{label}</div>
  </div>
);

// ---------------------------------------------------------------------------
// Tabs strip used by Music + Pomodoro + Shelf scenes
// ---------------------------------------------------------------------------

const TAB_LIST = ["Shelf", "Music", "Pomodoro", "Timers", "Clock", "Notes"];

const Tabs: React.FC<{ active: string }> = ({ active }) => (
  <div style={{ display: "flex", gap: 6 }}>
    {TAB_LIST.map((name) => {
      const isActive = name === active;
      return (
        <div key={name} style={{
          padding: "5px 10px",
          borderRadius: 999,
          background: isActive ? NP_GRADIENT : "rgba(255,255,255,0.05)",
          border: isActive ? "none" : "1px solid rgba(255,255,255,0.10)",
          fontSize: 11, fontWeight: 800,
          color: isActive ? "white" : "rgba(255,255,255,0.65)",
          letterSpacing: -0.1,
          boxShadow: isActive ? `0 4px 14px ${NP_PINK}55` : "none",
        }}>{name}</div>
      );
    })}
  </div>
);

// ---------------------------------------------------------------------------
// Scene 5 — Outro
// ---------------------------------------------------------------------------

export const NPOutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconSp = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
  const titleSp = spring({ frame: frame - 0.25 * fps, fps, config: { damping: 18 } });
  const subSp = spring({ frame: frame - 0.5 * fps, fps, config: { damping: 22 } });
  const ctaSp = spring({ frame: frame - 0.7 * fps, fps, config: { damping: 22 } });
  const iconSize = vertical ? 200 : 150;

  return (
    <AbsoluteFill style={{ background: NP_BG }}>
      <NPWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
        flexDirection: "column",
      }}>
        {/* App icon: a black squircle with a tiny notch */}
        <div style={{
          transform: `scale(${interpolate(iconSp, [0, 1], [0.5, 1])}) rotate(${interpolate(iconSp, [0, 1], [-12, 0])}deg)`,
          opacity: iconSp,
          width: iconSize, height: iconSize,
          borderRadius: iconSize * 0.28,
          background: NP_GRADIENT,
          padding: 6,
          boxShadow:
            `inset 0 ${iconSize * 0.012}px 0 rgba(255,255,255,0.18),` +
            ` 0 ${iconSize * 0.16}px ${iconSize * 0.32}px ${NP_PURPLE}66`,
        }}>
          <div style={{
            width: "100%", height: "100%",
            borderRadius: iconSize * 0.24,
            background: "#000",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Inner notch silhouette */}
            <div style={{
              position: "absolute",
              top: 0, left: "50%", transform: "translateX(-50%)",
              width: iconSize * 0.42,
              height: iconSize * 0.16,
              background: NP_GRADIENT,
              borderBottomLeftRadius: iconSize * 0.08,
              borderBottomRightRadius: iconSize * 0.08,
              opacity: 0.95,
              boxShadow: `0 0 ${iconSize * 0.12}px ${NP_PINK}88`,
            }} />
          </div>
        </div>

        {/* URL */}
        <div style={{
          marginTop: vertical ? 50 : 36,
          fontSize: vertical ? 86 : 72, fontWeight: 800, letterSpacing: -2.5,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          opacity: titleSp, textAlign: "center", lineHeight: 1.05,
          background: NP_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          notchpop.pages.dev
        </div>

        {/* Subtitle */}
        <div style={{
          marginTop: vertical ? 18 : 14,
          fontSize: vertical ? 28 : 24, fontWeight: 700, letterSpacing: -0.4,
          color: "rgba(235,235,245,0.72)",
          opacity: subSp,
          transform: `translateY(${interpolate(subSp, [0, 1], [12, 0])}px)`,
          textAlign: "center",
        }}>
          Free · Open Source · MIT
        </div>

        {/* CTA pill */}
        <div style={{
          marginTop: vertical ? 50 : 36,
          padding: vertical ? "16px 36px" : "14px 30px",
          borderRadius: 999,
          background: NP_GRADIENT,
          boxShadow: `0 12px 48px ${NP_PURPLE}66`,
          opacity: ctaSp,
          transform: `translateY(${interpolate(ctaSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 26 : 22,
          fontWeight: 800, letterSpacing: -0.4,
          color: "white",
        }}>
          Make your notch useful →
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
