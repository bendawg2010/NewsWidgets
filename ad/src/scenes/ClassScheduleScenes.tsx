import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";
import { MacBadge } from "../components/MacBadge";
import { ScheduleWidgetMock, ClassRow, CS_GRADIENT, CS_GRAD_START, CS_GRAD_MID, CS_GRAD_END, LIVE_GREEN } from "../widgets/ScheduleWidgetMock";

const SAMPLE_ROWS: ClassRow[] = [
  { index: 1, time: "8:00 AM", name: "English",   room: "204",     status: "past",     accent: "#FF6B6B" },
  { index: 2, time: "9:00 AM", name: "Calculus",  room: "Math 3",  status: "past",     accent: CS_GRAD_START },
  { index: 3, time: "10:00 AM", name: "Chemistry",room: "Lab B",   status: "live",     accent: LIVE_GREEN },
  { index: 4, time: "11:00 AM", name: "History",  room: "118",     status: "upcoming", accent: "#FFD60A" },
  { index: 5, time: "12:00 PM", name: "Lunch",    room: "Cafeteria", status: "upcoming", accent: "#A8A8A8" },
  { index: 6, time: "1:00 PM",  name: "Spanish",  room: "212",     status: "upcoming", accent: "#FF9500" },
];

// MARK: - Wallpaper

const CSWallpaper: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{
      background:
        "radial-gradient(1400px 900px at 25% 15%, rgba(79, 139, 255, 0.45), transparent 65%)," +
        "radial-gradient(1200px 800px at 80% 90%, rgba(123, 97, 255, 0.45), transparent 65%)," +
        "radial-gradient(900px 600px at 60% 50%, rgba(200, 85, 232, 0.30), transparent 70%)," +
        "linear-gradient(135deg, #0d0a25 0%, #100a18 60%, #1a0820 100%)",
    }} />
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
    }} />
  </AbsoluteFill>
);

// MARK: - Hook

export const CSHookScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const t2 = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const fontSize = vertical ? 180 : 130;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CSWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <MacBadge vertical={vertical} opacity={t1} />
        <div style={{
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          opacity: t1, fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
        }}>
          Your week.
        </div>
        <div style={{
          marginTop: vertical ? 24 : 18,
          transform: `translateY(${interpolate(t2, [0, 1], [30, 0])}px)`,
          opacity: t2, fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
          background: CS_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          Your widget.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// MARK: - Reveal

export const CSRevealScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 14, stiffness: 90, mass: 1.1 } });
  const x = interpolate(sp, [0, 1], [vertical ? 0 : -400, 0]);
  const y = interpolate(sp, [0, 1], [vertical ? 600 : 0, 0]);
  const scale = interpolate(sp, [0, 1], [0.85, 1]);

  // Tick the LIVE countdown to feel real-time
  const liveMins = Math.max(1, 44 - Math.floor(frame / fps / 5));
  const liveTimeLeft = `${liveMins}m`;

  const captionOp = interpolate(frame, [1.4 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CSWallpaper />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
          opacity: sp,
        }}>
          <ScheduleWidgetMock
            rows={SAMPLE_ROWS}
            cycleLabel="Day 3 of 6"
            weekday="Tuesday"
            time="10:16 AM"
            liveTimeLeft={liveTimeLeft}
            size={vertical ? "large" : "xl"}
          />
        </div>
      </AbsoluteFill>
      <div style={{
        position: "absolute",
        [vertical ? "top" : "bottom"]: vertical ? 100 : 90,
        left: 0, right: 0, textAlign: "center",
        fontFamily: FONT_STACK, color: "white", opacity: captionOp,
      }}>
        <div style={{ fontSize: vertical ? 60 : 48, fontWeight: 700, letterSpacing: -1.5 }}>
          Knows what's live.
        </div>
        <div style={{
          marginTop: 6, fontSize: vertical ? 28 : 22,
          color: COLORS.textSecondary, fontWeight: 500,
        }}>
          The current period pulses green. Time remaining ticks down.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// MARK: - Setup walkthrough — three slides

const SETUP_STEPS: { title: string; sub: string }[] = [
  { title: "Add your classes.",     sub: "Name. Teacher. Room. A color. That's it." },
  { title: "Set day templates.",    sub: "Regular days, long-block Wednesday, half-days — your call." },
  { title: "Pick your rotation.",   sub: "A/B days. 4-day. 6-day. 8-day. Anchor it to a date." },
];
const STEP_FRAMES = 75;
export const CS_SETUP_TOTAL = SETUP_STEPS.length * STEP_FRAMES;

export const CSSetupScene: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <CSWallpaper />
    {SETUP_STEPS.map((step, i) => (
      <Sequence key={i} from={i * STEP_FRAMES} durationInFrames={STEP_FRAMES + 6} premountFor={30}>
        <Slide step={step} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const Slide: React.FC<{ step: { title: string; sub: string } }> = ({ step }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const exit  = spring({ frame: frame - (STEP_FRAMES - 12), fps, config: { damping: 200 } });
  const opacity = enter - exit;
  const y = interpolate(enter - exit, [0, 1], [40, 0]);

  return (
    <AbsoluteFill style={{
      alignItems: "center", justifyContent: "center",
      fontFamily: FONT_STACK, opacity, transform: `translateY(${y}px)`,
      padding: 40,
    }}>
      <div style={{
        fontSize: 156, fontWeight: 800, letterSpacing: -4,
        background: CS_GRADIENT,
        backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        lineHeight: 1.05, textAlign: "center",
      }}>
        {step.title}
      </div>
      <div style={{
        marginTop: 22, fontSize: 32, fontWeight: 500,
        color: COLORS.textSecondary, letterSpacing: -0.4, textAlign: "center",
      }}>
        {step.sub}
      </div>
    </AbsoluteFill>
  );
};

// MARK: - Outro

export const CSOutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconSp = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
  const titleSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const ctaSp = spring({ frame: frame - 0.8 * fps, fps, config: { damping: 22 } });
  const urlSp = spring({ frame: frame - 1.1 * fps, fps, config: { damping: 22 } });

  const iconSize = vertical ? 220 : 160;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <CSWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          transform: `scale(${interpolate(iconSp, [0, 1], [0.4, 1])}) rotate(${interpolate(iconSp, [0, 1], [-20, 0])}deg)`,
          opacity: iconSp,
          width: iconSize, height: iconSize, borderRadius: iconSize * 0.22,
          background: CS_GRADIENT,
          display: "grid", placeItems: "center",
          boxShadow: `inset 0 ${iconSize * 0.012}px 0 rgba(255,255,255,0.18), 0 ${iconSize * 0.16}px ${iconSize * 0.32}px rgba(0,0,0,0.45)`,
        }}>
          <svg width={iconSize * 0.55} height={iconSize * 0.55} viewBox="0 0 24 24" fill="white">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <rect x="3" y="3" width="18" height="4" rx="2" fill="rgba(0,0,0,0.25)"/>
            <circle cx="16" cy="14" r="3.5" fill={CS_GRAD_START} />
            <path d="M16 11.5v2.5l1.5 1" stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <div style={{
          marginTop: vertical ? 48 : 36,
          fontSize: vertical ? 100 : 78, fontWeight: 800, letterSpacing: -2.5,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          opacity: titleSp, textAlign: "center",
        }}>
          Class Schedule
        </div>
        <div style={{
          marginTop: 12, fontSize: vertical ? 32 : 24,
          fontWeight: 500, color: COLORS.textSecondary,
          opacity: ctaSp, textAlign: "center",
        }}>
          A free macOS widget. Open source.
        </div>
        <div style={{
          marginTop: vertical ? 60 : 40,
          padding: vertical ? "18px 36px" : "14px 28px",
          borderRadius: 999,
          background: CS_GRADIENT,
          boxShadow: `0 12px 48px ${CS_GRAD_MID}55`,
          opacity: urlSp,
          transform: `translateY(${interpolate(urlSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 30 : 24,
          fontWeight: 700, letterSpacing: -0.5,
        }}>
          classschedulewidget.pages.dev
        </div>
        <div style={{
          marginTop: vertical ? 16 : 12,
          opacity: urlSp,
          transform: `translateY(${interpolate(urlSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 20 : 16,
          fontWeight: 600,
          color: COLORS.textSecondary,
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          letterSpacing: -0.2,
        }}>
          ★ github.com/bendawg2010/ClassSchedule
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
