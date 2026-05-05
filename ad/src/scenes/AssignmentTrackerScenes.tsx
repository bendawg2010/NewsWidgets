import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";

// ----- Brand tokens -----------------------------------------------------

const AT_MINT  = "#06D6A0";
const AT_TEAL  = "#118AB2";
const AT_DEEP  = "#073B4C";
const AT_AMBER = "#FFD166";
const AT_ROSE  = "#EF476F";
const AT_GREEN = "#34C759";
const AT_GRADIENT = `linear-gradient(135deg, ${AT_MINT} 0%, ${AT_TEAL} 50%, ${AT_DEEP} 100%)`;

// ----- macOS-style wallpaper ------------------------------------------

const ATDesktop: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{
      background:
        "radial-gradient(1600px 1100px at 18% 15%, rgba(6, 214, 160, 0.55), transparent 60%)," +
        "radial-gradient(1400px 900px at 82% 88%, rgba(17, 138, 178, 0.55), transparent 65%)," +
        "radial-gradient(1100px 800px at 60% 45%, rgba(7, 59, 76, 0.45), transparent 70%)," +
        "linear-gradient(135deg, #042128 0%, #021118 60%, #052934 100%)",
    }} />
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
    }} />
  </AbsoluteFill>
);

// ----- macOS menu bar (custom for AssignmentTracker) ------------------

const MenuBar: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => (
  <div style={{
    position: "absolute", top: 0, left: 0, right: 0,
    height: vertical ? 44 : 36,
    background: "rgba(0,0,0,0.32)",
    backdropFilter: "blur(20px)",
    display: "flex", alignItems: "center",
    padding: vertical ? "0 22px" : "0 18px",
    gap: vertical ? 28 : 22,
    fontFamily: FONT_STACK,
    fontSize: vertical ? 16 : 14, fontWeight: 500,
    color: "rgba(255,255,255,0.96)",
    zIndex: 5,
  }}>
    <svg width={vertical ? 18 : 16} height={vertical ? 20 : 18} viewBox="0 0 14 16" fill="white">
      <path d="M11.624 5.81c-.046-2.85 2.327-4.224 2.434-4.293-1.327-1.94-3.39-2.207-4.124-2.236-1.756-.178-3.43 1.034-4.32 1.034-.892 0-2.27-1.008-3.736-.98C-.025-.633-1.69.353-2.62 1.991c-1.118 1.94-.286 4.81.806 6.387.534.769 1.17 1.633 2.005 1.602.806-.032 1.111-.522 2.085-.522.974 0 1.247.522 2.099.504.866-.014 1.415-.78 1.946-1.554.616-.892.87-1.756.884-1.802-.02-.008-1.696-.652-1.713-2.585.005.054 1.346.802 1.342 2.39z" />
    </svg>
    <span style={{ fontWeight: 700 }}>AssignmentTracker</span>
    <span style={{ opacity: 0.85 }}>File</span>
    <span style={{ opacity: 0.85 }}>Edit</span>
    <span style={{ opacity: 0.85 }}>View</span>
    <span style={{ opacity: 0.85 }}>Window</span>
    <span style={{ opacity: 0.85 }}>Help</span>
    <div style={{ flex: 1 }} />
    <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>Sat 9:42 PM</span>
  </div>
);

// ----- Widget primitives ----------------------------------------------

const WidgetFrame: React.FC<{
  size: "small" | "medium" | "large";
  vertical?: boolean;
  children: React.ReactNode;
}> = ({ size, vertical = false, children }) => {
  // Sizing — scale up for video legibility
  const dims = {
    small:  { w: vertical ? 280 : 260, h: vertical ? 280 : 260 },
    medium: { w: vertical ? 580 : 540, h: vertical ? 280 : 260 },
    large:  { w: vertical ? 580 : 540, h: vertical ? 580 : 540 },
  }[size];
  return (
    <div style={{
      width: dims.w, height: dims.h,
      borderRadius: 22,
      background: "rgba(20, 30, 38, 0.78)",
      backdropFilter: "blur(40px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.10)",
      boxShadow:
        "inset 0 1px 0 rgba(255,255,255,0.08)," +
        "0 24px 60px rgba(0,0,0,0.55)," +
        "0 4px 12px rgba(0,0,0,0.35)",
      padding: 16,
      fontFamily: FONT_STACK,
      color: "white",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "relative",
    }}>
      {children}
    </div>
  );
};

const WidgetHeader: React.FC<{ label: string; small?: boolean }> = ({ label, small = false }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 6,
    marginBottom: small ? 10 : 12,
  }}>
    <div style={{
      width: small ? 14 : 16, height: small ? 14 : 16,
      borderRadius: small ? 4 : 4.5,
      background: AT_GRADIENT,
      display: "grid", placeItems: "center",
    }}>
      <svg width={small ? 9 : 10} height={small ? 9 : 10} viewBox="0 0 24 24" fill="none">
        <path d="M5 8h12M5 12h10M5 16h8" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
    <div style={{
      fontSize: 10,
      fontWeight: 800,
      letterSpacing: 1,
      color: "rgba(255,255,255,0.62)",
      textTransform: "uppercase",
    }}>
      {label}
    </div>
  </div>
);

// Small widget — "Next assignment"
const SmallWidget: React.FC<{ vertical?: boolean; checkedCount?: number }> = ({ vertical, checkedCount = 0 }) => {
  const items = [
    { color: AT_AMBER, title: "Cell organelle quiz",   klass: "AP Biology",   due: "Today" },
    { color: AT_TEAL,  title: "Problem set #14",       klass: "Calc BC",      due: "Today" },
    { color: AT_AMBER, title: "Read Ch. 12",           klass: "AP US History",due: "Tomorrow" },
  ];
  const current = items[Math.min(checkedCount, items.length - 1)];
  return (
    <WidgetFrame size="small" vertical={vertical}>
      <WidgetHeader label="DUE NEXT" small />
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        flex: 1,
      }}>
        <div>
          <div style={{
            fontSize: 18, fontWeight: 800, letterSpacing: -0.5,
            lineHeight: 1.15, marginBottom: 12,
          }}>
            {current.title}
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center",
            padding: "3px 10px", borderRadius: 999,
            background: current.color + "26", color: current.color,
            fontSize: 11, fontWeight: 800, letterSpacing: 0.3,
          }}>
            {current.klass}
          </div>
        </div>
        <div style={{
          marginTop: "auto",
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
        }}>
          <div style={{
            fontSize: 30, fontWeight: 900, letterSpacing: -1.2,
            color: current.due === "Today" ? AT_AMBER : "white",
          }}>
            {current.due}
          </div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
            {Math.max(items.length - checkedCount, 0)} left
          </div>
        </div>
      </div>
    </WidgetFrame>
  );
};

// Medium widget — Today's list
const MediumWidget: React.FC<{ vertical?: boolean; checkedCount?: number }> = ({ vertical, checkedCount = 0 }) => {
  const items = [
    { color: AT_AMBER, title: "Cell organelle quiz",   klass: "AP Biology",    due: "5pm" },
    { color: AT_TEAL,  title: "Problem set #14",       klass: "Calc BC",       due: "9pm" },
    { color: AT_AMBER, title: "Read Ch. 12",           klass: "AP US History", due: "Tomorrow" },
  ];
  return (
    <WidgetFrame size="medium" vertical={vertical}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 8,
      }}>
        <WidgetHeader label="TODAY · SAT MAY 4" />
        <div style={{
          padding: "3px 10px", borderRadius: 999,
          background: "rgba(255, 209, 102, 0.18)",
          border: "1px solid rgba(255, 209, 102, 0.40)",
          color: AT_AMBER,
          fontSize: 11, fontWeight: 800, letterSpacing: 0.3,
          marginBottom: 12,
        }}>
          {Math.max(items.length - checkedCount, 0)} due
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {items.map((a, i) => {
          const checked = i < checkedCount;
          return (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "3px 18px 1fr auto",
              gap: 10, alignItems: "center",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 8,
              padding: "8px 10px 8px 0",
              opacity: checked ? 0.45 : 1,
              transition: "none",
            }}>
              <div style={{ width: 3, height: 28, background: a.color, borderRadius: "8px 0 0 8px" }} />
              <div style={{
                width: 14, height: 14, marginLeft: 10,
                borderRadius: 4,
                background: checked ? AT_MINT : "transparent",
                border: checked ? "none" : "1.2px solid rgba(255,255,255,0.20)",
                display: "grid", placeItems: "center",
              }}>
                {checked && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12 L10 17 L19 7" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
                  textDecoration: checked ? "line-through" : "none",
                  textDecorationColor: AT_MINT,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>{a.title}</div>
                <div style={{
                  fontSize: 10, fontWeight: 700,
                  color: a.color, letterSpacing: 0.2, marginTop: 2,
                }}>{a.klass}</div>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 800,
                color: a.due === "5pm" || a.due === "9pm" ? "white" : "rgba(255,255,255,0.55)",
                paddingLeft: 8,
              }}>
                {a.due}
              </div>
            </div>
          );
        })}
      </div>
    </WidgetFrame>
  );
};

// Large widget — This week
const LargeWidget: React.FC<{ vertical?: boolean }> = ({ vertical }) => {
  // 7-day strip with assignments grouped by day
  const days = [
    { dow: "MON", date: 5, n: 0, items: [] as { color: string, title: string }[] },
    { dow: "TUE", date: 6, n: 1, items: [{ color: AT_AMBER, title: "AP Biology quiz" }] },
    { dow: "WED", date: 7, n: 0, items: [] },
    { dow: "THU", date: 8, n: 2, items: [{ color: AT_TEAL, title: "Calc midterm" }, { color: AT_ROSE, title: "Hamlet act 3" }] },
    { dow: "FRI", date: 9, n: 1, items: [{ color: AT_MINT, title: "Lab report" }] },
    { dow: "SAT", date: 10, n: 0, items: [] },
    { dow: "SUN", date: 11, n: 1, items: [{ color: AT_AMBER, title: "Essay outline" }] },
  ];
  return (
    <WidgetFrame size="large" vertical={vertical}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "baseline",
        marginBottom: 10,
      }}>
        <WidgetHeader label="THIS WEEK · MAY 5–11" />
        <div style={{
          fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)",
          marginBottom: 12, letterSpacing: 0.2,
        }}>
          5 due
        </div>
      </div>

      {/* Days strip */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5,
        marginBottom: 14,
      }}>
        {days.map((d, i) => {
          const isToday = i === 0;
          return (
            <div key={d.dow} style={{
              borderRadius: 8,
              background: isToday ? "rgba(6,214,160,0.14)" : "rgba(255,255,255,0.04)",
              border: isToday ? `1px solid ${AT_MINT}` : "1px solid rgba(255,255,255,0.10)",
              padding: "8px 4px",
              textAlign: "center",
            }}>
              <div style={{
                fontSize: 8, fontWeight: 800, letterSpacing: 0.6,
                color: isToday ? AT_MINT : "rgba(255,255,255,0.62)",
              }}>{d.dow}</div>
              <div style={{
                fontSize: 16, fontWeight: 800,
                color: isToday ? AT_MINT : "white",
                marginTop: 2,
              }}>{d.date}</div>
              <div style={{
                marginTop: 6, height: 4, display: "flex", gap: 1.5,
                justifyContent: "center",
              }}>
                {d.items.slice(0, 3).map((it, j) => (
                  <div key={j} style={{
                    width: 4, height: 4, borderRadius: 2, background: it.color,
                  }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming list */}
      <div style={{
        fontSize: 10, fontWeight: 800, letterSpacing: 1,
        color: "rgba(255,255,255,0.62)",
        textTransform: "uppercase",
        marginBottom: 8,
      }}>UPCOMING</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        {[
          { color: AT_AMBER, title: "AP Biology quiz",         klass: "AP Biology",    when: "Tue · 8:30 AM" },
          { color: AT_TEAL,  title: "Calc midterm",            klass: "Calc BC",       when: "Thu · 11:00 AM" },
          { color: AT_ROSE,  title: "Hamlet act 3 close read", klass: "English Lit",   when: "Thu · 11:59 PM" },
          { color: AT_MINT,  title: "Lab report",              klass: "AP Biology",    when: "Fri · 5:00 PM" },
        ].map((a, i) => (
          <div key={i} style={{
            display: "grid",
            gridTemplateColumns: "3px 1fr auto",
            gap: 10, alignItems: "center",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 8,
            padding: "8px 12px 8px 0",
          }}>
            <div style={{ width: 3, height: 30, background: a.color, borderRadius: "8px 0 0 8px" }} />
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{a.title}</div>
              <div style={{
                fontSize: 10, fontWeight: 700,
                color: a.color, letterSpacing: 0.2, marginTop: 2,
              }}>{a.klass}</div>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: "rgba(255,255,255,0.78)",
            }}>{a.when}</div>
          </div>
        ))}
      </div>
    </WidgetFrame>
  );
};

// ----- Scene 1: Hook ---------------------------------------------------

export const ATPainScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t1 = spring({ frame, fps, config: { damping: 16 } });
  const t2 = spring({ frame: frame - 0.5 * fps, fps, config: { damping: 18 } });
  const widgetSp = spring({ frame: frame - 1.5 * fps, fps, config: { damping: 16 } });

  const fontSize = vertical ? 110 : 92;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATDesktop />
      <MenuBar vertical={vertical} />

      {/* Floating peek widget in background */}
      <div style={{
        position: "absolute",
        right: vertical ? 60 : 80,
        bottom: vertical ? 100 : 80,
        opacity: widgetSp * 0.55,
        transform: `translateY(${interpolate(widgetSp, [0, 1], [60, 0])}px) rotate(-2deg) scale(0.9)`,
      }}>
        <SmallWidget vertical={vertical} />
      </div>

      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
        zIndex: 4,
      }}>
        <div style={{
          opacity: t1,
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
          textShadow: "0 8px 32px rgba(0,0,0,0.55)",
        }}>
          Your assignments.
        </div>
        <div style={{
          marginTop: vertical ? 22 : 16,
          opacity: t2,
          transform: `translateY(${interpolate(t2, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
          background: AT_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          On your desktop.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 2: Single medium widget reveal ---------------------------

export const ATDashboardScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const captionSp = spring({ frame, fps, config: { damping: 18 } });
  const widgetSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 14, stiffness: 110 } });
  // Subtle hover/breathe on the widget
  const breathe = 1 + Math.sin(frame / 30) * 0.012;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATDesktop />
      <MenuBar vertical={vertical} />

      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
        zIndex: 4, paddingTop: vertical ? 80 : 60,
      }}>
        <div style={{
          opacity: captionSp,
          transform: `translateY(${interpolate(captionSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 56 : 46, fontWeight: 800, letterSpacing: -1.6,
          textAlign: "center", marginBottom: vertical ? 40 : 36,
          textShadow: "0 4px 16px rgba(0,0,0,0.45)",
        }}>
          Stop opening apps to <span style={{
            background: AT_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>check what's due.</span>
        </div>

        <div style={{
          opacity: widgetSp,
          transform: `translateY(${interpolate(widgetSp, [0, 1], [60, 0])}px) scale(${interpolate(widgetSp, [0, 1], [0.85, breathe])})`,
        }}>
          <MediumWidget vertical={vertical} />
        </div>

        <div style={{
          marginTop: vertical ? 36 : 26,
          opacity: spring({ frame: frame - 1.4 * fps, fps, config: { damping: 22 } }),
          fontSize: vertical ? 24 : 20,
          fontWeight: 600,
          color: "rgba(255,255,255,0.78)",
          letterSpacing: -0.3,
          textAlign: "center",
        }}>
          Native macOS widget · Updates live · Local-first.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 3: Three sizes gallery -----------------------------------

export const ATCalendarScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const captionSp = spring({ frame, fps, config: { damping: 18 } });
  const smallSp  = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 14, stiffness: 130 } });
  const medSp    = spring({ frame: frame - 0.7 * fps, fps, config: { damping: 14, stiffness: 130 } });
  const largeSp  = spring({ frame: frame - 1.0 * fps, fps, config: { damping: 14, stiffness: 130 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATDesktop />
      <MenuBar vertical={vertical} />

      <AbsoluteFill style={{
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
        zIndex: 4, paddingTop: vertical ? 80 : 60,
      }}>
        <div style={{
          opacity: captionSp,
          transform: `translateY(${interpolate(captionSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 56 : 46, fontWeight: 800, letterSpacing: -1.6,
          textAlign: "center", marginBottom: vertical ? 36 : 32,
          textShadow: "0 4px 16px rgba(0,0,0,0.45)",
        }}>
          Three sizes. <span style={{
            background: AT_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>Stack 'em up.</span>
        </div>

        {vertical ? (
          // Vertical: stacked
          <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{
                opacity: smallSp,
                transform: `translateY(${interpolate(smallSp, [0, 1], [60, 0])}px) scale(${interpolate(smallSp, [0, 1], [0.85, 1])})`,
              }}>
                <SmallWidget vertical />
              </div>
            </div>
            <div style={{
              opacity: medSp,
              transform: `translateY(${interpolate(medSp, [0, 1], [60, 0])}px) scale(${interpolate(medSp, [0, 1], [0.85, 1])})`,
            }}>
              <MediumWidget vertical />
            </div>
            <div style={{
              opacity: largeSp,
              transform: `translateY(${interpolate(largeSp, [0, 1], [60, 0])}px) scale(${interpolate(largeSp, [0, 1], [0.85, 0.85])})`,
            }}>
              <LargeWidget vertical />
            </div>
          </div>
        ) : (
          // Horizontal: side by side, large on right
          <div style={{
            display: "flex", gap: 22, alignItems: "flex-start",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={{
                opacity: smallSp,
                transform: `translateY(${interpolate(smallSp, [0, 1], [60, 0])}px) scale(${interpolate(smallSp, [0, 1], [0.85, 1])})`,
              }}>
                <SmallWidget />
              </div>
              <div style={{
                opacity: medSp,
                transform: `translateY(${interpolate(medSp, [0, 1], [60, 0])}px) scale(${interpolate(medSp, [0, 1], [0.85, 1])})`,
              }}>
                <MediumWidget />
              </div>
            </div>
            <div style={{
              opacity: largeSp,
              transform: `translateY(${interpolate(largeSp, [0, 1], [60, 0])}px) scale(${interpolate(largeSp, [0, 1], [0.85, 1])})`,
            }}>
              <LargeWidget />
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 4: Live update — checking off ----------------------------

export const ATStudyingScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const captionSp = spring({ frame, fps, config: { damping: 18 } });
  const widgetSp = spring({ frame: frame - 0.3 * fps, fps, config: { damping: 14 } });

  // Sequential check-offs at 1.2s, 2.2s, 3.2s
  const c1 = frame > 1.2 * fps;
  const c2 = frame > 2.4 * fps;
  const c3 = frame > 3.6 * fps;
  const checkedCount = (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0);

  // Cursor moves to each checkbox in sequence
  const baseCheckboxes = vertical
    ? [{ x: 320, y: 700 }, { x: 320, y: 770 }, { x: 320, y: 840 }]
    : [{ x: 880, y: 470 }, { x: 880, y: 530 }, { x: 880, y: 590 }];
  const cursorTarget = baseCheckboxes[Math.min(checkedCount, baseCheckboxes.length - 1)];
  const cursorStart = vertical ? { x: 540, y: 1000 } : { x: 1300, y: 700 };

  // Animate cursor moving toward each target
  let cx, cy;
  if (frame < 0.4 * fps) {
    const p = interpolate(frame, [0, 0.4 * fps], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    cx = interpolate(p, [0, 1], [cursorStart.x, baseCheckboxes[0].x]);
    cy = interpolate(p, [0, 1], [cursorStart.y, baseCheckboxes[0].y]);
  } else if (checkedCount < baseCheckboxes.length) {
    cx = baseCheckboxes[checkedCount].x;
    cy = baseCheckboxes[checkedCount].y;
  } else {
    cx = baseCheckboxes[baseCheckboxes.length - 1].x;
    cy = baseCheckboxes[baseCheckboxes.length - 1].y + 60;
  }

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATDesktop />
      <MenuBar vertical={vertical} />

      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40,
        zIndex: 4, paddingTop: vertical ? 80 : 60,
      }}>
        <div style={{
          opacity: captionSp,
          transform: `translateY(${interpolate(captionSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 56 : 46, fontWeight: 800, letterSpacing: -1.6,
          textAlign: "center", marginBottom: vertical ? 36 : 30,
          textShadow: "0 4px 16px rgba(0,0,0,0.45)",
        }}>
          Check it off. <span style={{
            background: AT_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>Widget knows.</span>
        </div>

        <div style={{
          opacity: widgetSp,
          transform: `translateY(${interpolate(widgetSp, [0, 1], [40, 0])}px) scale(${interpolate(widgetSp, [0, 1], [0.92, 1])})`,
          position: "relative",
        }}>
          <MediumWidget vertical={vertical} checkedCount={checkedCount} />
        </div>

        {checkedCount === 3 && (
          <div style={{
            marginTop: vertical ? 36 : 26,
            padding: vertical ? "14px 28px" : "12px 24px",
            background: "rgba(52, 199, 89, 0.20)",
            border: "1px solid rgba(52, 199, 89, 0.45)",
            borderRadius: 999,
            fontSize: vertical ? 22 : 18, fontWeight: 800,
            color: AT_GREEN, letterSpacing: -0.2,
            transform: `scale(${spring({ frame: frame - 3.7 * fps, fps, config: { damping: 12 } })})`,
            opacity: spring({ frame: frame - 3.7 * fps, fps, config: { damping: 14 } }),
          }}>
            ✓ All caught up.
          </div>
        )}
      </AbsoluteFill>

      {/* Cursor */}
      <svg
        width={vertical ? 36 : 30}
        height={vertical ? 36 : 30}
        viewBox="0 0 24 24"
        style={{
          position: "absolute", left: cx, top: cy, zIndex: 10,
          pointerEvents: "none",
          filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.65))",
        }}
      >
        <path
          d="M2 2 L20 12 L12 13 L9 22 Z"
          fill="white" stroke="#000" strokeWidth="1.5"
        />
      </svg>
    </AbsoluteFill>
  );
};

// ----- Scene 5: Features grid (text only) -----------------------------

const FEATURES = [
  { title: "Native macOS",   sub: "Built with WidgetKit." },
  { title: "Three sizes",    sub: "Small, medium, large." },
  { title: "Live updates",   sub: "Checks reflect instantly." },
  { title: "Color classes",  sub: "One color per subject." },
  { title: "Local-first",    sub: "Your data stays on device." },
  { title: "Free forever",   sub: "Open source. No accounts." },
];

export const ATFeaturesScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATDesktop />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 60 : 50, fontWeight: 800, letterSpacing: -1.8,
          marginBottom: vertical ? 36 : 32, textAlign: "center",
          textShadow: "0 4px 16px rgba(0,0,0,0.45)",
        }}>
          Native. Free. <span style={{
            background: AT_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>Open source.</span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: vertical ? "1fr 1fr" : "repeat(3, 1fr)",
          gap: vertical ? 16 : 18,
          width: vertical ? 880 : 1200,
        }}>
          {FEATURES.map((f, i) => {
            const sp = spring({
              frame: frame - (0.4 + i * 0.10) * fps, fps,
              config: { damping: 16, stiffness: 130 },
            });
            return (
              <div key={f.title} style={{
                opacity: sp,
                transform: `translateY(${interpolate(sp, [0, 1], [20, 0])}px) scale(${interpolate(sp, [0, 1], [0.95, 1])})`,
                background: "rgba(20, 30, 38, 0.78)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 16,
                padding: vertical ? "20px 22px" : "22px 26px",
                backdropFilter: "blur(40px)",
              }}>
                <div style={{
                  fontSize: vertical ? 22 : 22, fontWeight: 800, letterSpacing: -0.5,
                  marginBottom: 6,
                  background: AT_GRADIENT,
                  backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                }}>{f.title}</div>
                <div style={{
                  fontSize: vertical ? 16 : 15, color: COLORS.textSecondary,
                  fontWeight: 500, letterSpacing: -0.2, lineHeight: 1.4,
                }}>{f.sub}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 6: Outro --------------------------------------------------

export const ATOutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const iconSp = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
  const titleSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const subSp = spring({ frame: frame - 0.7 * fps, fps, config: { damping: 22 } });
  const ctaSp = spring({ frame: frame - 1.0 * fps, fps, config: { damping: 22 } });
  const urlSp = spring({ frame: frame - 1.3 * fps, fps, config: { damping: 22 } });

  const iconSize = vertical ? 220 : 160;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATDesktop />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          transform: `scale(${interpolate(iconSp, [0, 1], [0.4, 1])}) rotate(${interpolate(iconSp, [0, 1], [-20, 0])}deg)`,
          opacity: iconSp,
          width: iconSize, height: iconSize, borderRadius: iconSize * 0.22,
          background: AT_GRADIENT,
          display: "grid", placeItems: "center",
          boxShadow: `inset 0 ${iconSize * 0.012}px 0 rgba(255,255,255,0.18), 0 ${iconSize * 0.16}px ${iconSize * 0.32}px rgba(6,214,160,0.40)`,
        }}>
          <svg width={iconSize * 0.62} height={iconSize * 0.62} viewBox="0 0 24 24" fill="none">
            <path d="M5 8h12M5 12h10M5 16h8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="20" cy="8" r="1.6" fill="#FFD166" />
          </svg>
        </div>
        <div style={{
          marginTop: vertical ? 40 : 32,
          fontSize: vertical ? 78 : 62, fontWeight: 800, letterSpacing: -2,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          opacity: titleSp, textAlign: "center", lineHeight: 1.05,
        }}>
          AssignmentTracker
        </div>
        <div style={{
          marginTop: vertical ? 14 : 10,
          fontSize: vertical ? 30 : 24, fontWeight: 600, letterSpacing: -0.4,
          color: COLORS.textSecondary,
          opacity: subSp,
          transform: `translateY(${interpolate(subSp, [0, 1], [12, 0])}px)`,
          textAlign: "center",
        }}>
          for macOS · Free · Open source.
        </div>
        <div style={{
          marginTop: vertical ? 56 : 40,
          padding: vertical ? "18px 40px" : "16px 32px",
          borderRadius: 999,
          background: AT_GRADIENT,
          boxShadow: "0 12px 48px rgba(6,214,160,0.40)",
          opacity: ctaSp,
          transform: `translateY(${interpolate(ctaSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 32 : 26,
          fontWeight: 700, letterSpacing: -0.5,
        }}>
          assignmenttracker.pages.dev
        </div>
        <div style={{
          marginTop: vertical ? 16 : 12,
          opacity: urlSp,
          transform: `translateY(${interpolate(urlSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 22 : 18,
          fontWeight: 600,
          color: COLORS.textSecondary,
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          letterSpacing: -0.2,
        }}>
          ★ github.com/bendawg2010/AssignmentTracker
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
