import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence,
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

// ----- Wallpaper --------------------------------------------------------

const ATWallpaper: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{
      background:
        "radial-gradient(1400px 900px at 18% 12%, rgba(6, 214, 160, 0.30), transparent 65%)," +
        "radial-gradient(1200px 800px at 82% 88%, rgba(17, 138, 178, 0.32), transparent 65%)," +
        "radial-gradient(900px 600px at 60% 50%, rgba(7, 59, 76, 0.45), transparent 70%)," +
        "linear-gradient(135deg, #050d12 0%, #07141c 60%, #0a1f2a 100%)",
    }} />
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
    }} />
  </AbsoluteFill>
);

// ----- Browser frame ---------------------------------------------------

const BrowserFrame: React.FC<{
  url: string;
  width: number;
  height: number;
  children: React.ReactNode;
}> = ({ url, width, height, children }) => (
  <div style={{
    width, height,
    borderRadius: 18,
    background: "#1c1c1e",
    boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)",
    overflow: "hidden",
    position: "relative",
    fontFamily: FONT_STACK,
  }}>
    <div style={{
      height: 36, background: "#2a2a2c",
      display: "flex", alignItems: "center", padding: "0 14px",
      borderBottom: "1px solid #00000044", gap: 8,
    }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F57" }} />
      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FEBC2E" }} />
      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28C840" }} />
      <div style={{
        marginLeft: 18, flex: 1, height: 22, borderRadius: 6,
        background: "#3a3a3c", color: "#bbb",
        fontSize: 13, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        display: "flex", alignItems: "center", padding: "0 10px",
      }}>{url}</div>
    </div>
    <div style={{
      position: "absolute", top: 36, left: 0, right: 0, bottom: 0,
      overflow: "hidden",
    }}>
      {children}
    </div>
  </div>
);

// ----- Scene 1: Pain — overwhelmed student ------------------------------

export const ATPainScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t1 = spring({ frame, fps, config: { damping: 16 } });
  const t2 = spring({ frame: frame - 0.5 * fps, fps, config: { damping: 18 } });
  const t3 = spring({ frame: frame - 1.0 * fps, fps, config: { damping: 18 } });
  const t4 = spring({ frame: frame - 1.5 * fps, fps, config: { damping: 18 } });

  const fontSize = vertical ? 110 : 90;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          opacity: t1,
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          fontSize: fontSize * 0.9, fontWeight: 800, letterSpacing: -2,
          lineHeight: 1, textAlign: "center",
        }}>
          Five papers,
        </div>
        <div style={{
          marginTop: vertical ? 14 : 10,
          opacity: t2,
          transform: `translateY(${interpolate(t2, [0, 1], [40, 0])}px)`,
          fontSize: fontSize * 0.9, fontWeight: 800, letterSpacing: -2,
          lineHeight: 1, textAlign: "center",
        }}>
          three quizzes,
        </div>
        <div style={{
          marginTop: vertical ? 14 : 10,
          opacity: t3,
          transform: `translateY(${interpolate(t3, [0, 1], [40, 0])}px)`,
          fontSize: fontSize * 0.9, fontWeight: 800, letterSpacing: -2,
          lineHeight: 1, textAlign: "center",
        }}>
          two labs,
        </div>
        <div style={{
          marginTop: vertical ? 28 : 22,
          opacity: t4,
          transform: `translateY(${interpolate(t4, [0, 1], [30, 0])}px) scale(${interpolate(t4, [0, 1], [0.9, 1])})`,
          fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
          background: AT_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          one tracker.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 2: Dashboard — overview ------------------------------------

export const ATDashboardScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });

  const pageWidth = vertical ? 940 : 1400;
  const pageHeight = vertical ? 1280 : 760;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 30,
      }}>
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 60 : 48, fontWeight: 800, letterSpacing: -1.6,
          marginBottom: vertical ? 28 : 20, textAlign: "center",
        }}>
          Everything <span style={{
            background: AT_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>at a glance.</span>
        </div>

        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
        }}>
          <BrowserFrame url="assignmenttracker.pages.dev" width={pageWidth} height={pageHeight}>
            <div style={{
              padding: vertical ? "26px 26px" : "32px 40px",
              background: "transparent",
              fontFamily: FONT_STACK, color: "white",
              height: "100%",
            }}>
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: vertical ? 22 : 26,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: AT_GRADIENT,
                    display: "grid", placeItems: "center",
                    boxShadow: "0 6px 16px rgba(6,214,160,0.30)",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 8h12M5 12h10M5 16h8" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
                      <circle cx="20" cy="8" r="1.6" fill="#FFD166" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5 }}>AssignmentTracker</div>
                </div>
                <div style={{
                  display: "flex", gap: 4, padding: 4,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 999,
                }}>
                  {["Dashboard", "All", "Calendar", "Classes"].map((t, i) => (
                    <div key={t} style={{
                      padding: "6px 14px", borderRadius: 999,
                      fontSize: 12, fontWeight: 700,
                      background: i === 0 ? AT_GRADIENT : "transparent",
                      color: i === 0 ? "white" : "rgba(255,255,255,0.62)",
                    }}>{t}</div>
                  ))}
                </div>
                <div style={{
                  padding: "8px 16px", borderRadius: 12,
                  background: AT_GRADIENT,
                  fontSize: 13, fontWeight: 700,
                  boxShadow: "0 8px 24px rgba(6,214,160,0.35)",
                }}>+ New assignment</div>
              </div>

              {/* Title */}
              <div style={{
                fontSize: vertical ? 32 : 32, fontWeight: 800, letterSpacing: -1,
                marginBottom: 4,
              }}>
                Stay <span style={{
                  background: AT_GRADIENT,
                  backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
                }}>ahead.</span>
              </div>
              <div style={{
                fontSize: 14, color: "rgba(255,255,255,0.62)", fontWeight: 500,
                marginBottom: vertical ? 22 : 22,
              }}>
                Good evening — here's what's on deck.
              </div>

              {/* Stats grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: vertical ? "1fr 1fr" : "repeat(4, 1fr)",
                gap: 14, marginBottom: vertical ? 22 : 22,
              }}>
                {[
                  { label: "Due today", value: "2", meta: "Knock these out", color: AT_AMBER },
                  { label: "This week", value: "7", meta: "7 assignments", color: null },
                  { label: "Late",      value: "0", meta: "Spotless", color: AT_GREEN },
                  { label: "Done",      value: "12", meta: "12 of 24 complete", color: AT_GREEN },
                ].map((s, i) => {
                  const sp = spring({
                    frame: frame - (0.5 + i * 0.10) * fps, fps,
                    config: { damping: 18 },
                  });
                  return (
                    <div key={s.label} style={{
                      opacity: sp,
                      transform: `translateY(${interpolate(sp, [0, 1], [16, 0])}px)`,
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 14,
                      padding: "16px 18px",
                    }}>
                      <div style={{
                        fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.62)",
                        letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8,
                      }}>{s.label}</div>
                      <div style={{
                        fontSize: 32, fontWeight: 800, letterSpacing: -1,
                        color: s.color || "white",
                        marginBottom: 2,
                      }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", fontWeight: 500 }}>
                        {s.meta}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section: Due today */}
              <div style={{
                fontSize: 16, fontWeight: 800, letterSpacing: -0.4,
                marginBottom: 10, marginTop: 4,
              }}>Due today</div>
              {[
                { color: AT_AMBER, title: "Cell organelle quiz", klass: "AP Biology", priority: "high",   weight: "5%",  due: "Today" },
                { color: AT_TEAL,  title: "Problem set #14",     klass: "Calculus BC", priority: "high",   weight: "5%",  due: "Today" },
              ].map((a, i) => {
                const sp = spring({
                  frame: frame - (1.0 + i * 0.10) * fps, fps,
                  config: { damping: 18 },
                });
                return (
                  <div key={a.title} style={{
                    opacity: sp,
                    transform: `translateY(${interpolate(sp, [0, 1], [12, 0])}px)`,
                    display: "grid",
                    gridTemplateColumns: "4px 22px 1fr auto auto",
                    gap: 14, alignItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12,
                    padding: "10px 16px 10px 0",
                    marginBottom: 8,
                  }}>
                    <div style={{ width: 4, height: 36, background: a.color, borderRadius: "12px 0 0 12px" }} />
                    <div style={{
                      width: 20, height: 20, marginLeft: 12,
                      borderRadius: 5,
                      border: "1.5px solid rgba(255,255,255,0.16)",
                    }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{a.title}</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{
                          padding: "2px 8px", borderRadius: 999,
                          background: a.color + "26", color: a.color,
                          fontSize: 10, fontWeight: 800, letterSpacing: 0.3,
                        }}>{a.klass}</span>
                        <span style={{
                          padding: "2px 8px", borderRadius: 999,
                          background: "rgba(239,71,111,0.14)", color: AT_ROSE,
                          fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5,
                        }}>{a.priority}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontWeight: 700 }}>{a.weight}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.62)" }}>of grade</div>
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 700, color: AT_AMBER, paddingLeft: 12,
                    }}>{a.due}</div>
                  </div>
                );
              })}

              {/* Section: This week */}
              <div style={{
                fontSize: 16, fontWeight: 800, letterSpacing: -0.4,
                marginBottom: 10, marginTop: 18,
              }}>Coming up this week</div>
              {[
                { color: AT_AMBER,  title: "Read Ch. 12 (Civil War)",       klass: "AP US History", due: "In 2d" },
                { color: AT_MINT,   title: "Lab report: photosynthesis",    klass: "AP Biology",    due: "In 5d" },
                { color: AT_ROSE,   title: "Hamlet act 3 close read",       klass: "English Lit",   due: "In 3d" },
              ].map((a, i) => {
                const sp = spring({
                  frame: frame - (1.5 + i * 0.10) * fps, fps,
                  config: { damping: 18 },
                });
                return (
                  <div key={a.title} style={{
                    opacity: sp,
                    transform: `translateY(${interpolate(sp, [0, 1], [12, 0])}px)`,
                    display: "grid",
                    gridTemplateColumns: "4px 22px 1fr auto",
                    gap: 14, alignItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 12,
                    padding: "10px 16px 10px 0",
                    marginBottom: 8,
                  }}>
                    <div style={{ width: 4, height: 36, background: a.color, borderRadius: "12px 0 0 12px" }} />
                    <div style={{
                      width: 20, height: 20, marginLeft: 12,
                      borderRadius: 5,
                      border: "1.5px solid rgba(255,255,255,0.16)",
                    }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{a.title}</div>
                      <span style={{
                        padding: "2px 8px", borderRadius: 999,
                        background: a.color + "26", color: a.color,
                        fontSize: 10, fontWeight: 800, letterSpacing: 0.3,
                      }}>{a.klass}</span>
                    </div>
                    <div style={{
                      fontSize: 13, fontWeight: 700, paddingLeft: 12,
                    }}>{a.due}</div>
                  </div>
                );
              })}
            </div>
          </BrowserFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 3: Calendar view ------------------------------------------

export const ATCalendarScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });

  const pageWidth = vertical ? 940 : 1400;
  const pageHeight = vertical ? 1280 : 760;

  // Mock month data: highlight today (15) and place events on a few days
  const monthDays = 30;
  const startOffset = 3; // first of month is on Wed (index 3)
  const today = 15;
  const events: { [day: number]: { title: string; color: string }[] } = {
    3:  [{ title: "Quiz: derivatives", color: AT_TEAL }],
    7:  [{ title: "Map quiz: Europe", color: AT_AMBER }],
    14: [{ title: "Vocab list 4", color: AT_ROSE }],
    15: [
      { title: "Cell organelle quiz", color: AT_MINT },
      { title: "Problem set #14",     color: AT_TEAL },
    ],
    16: [{ title: "Read Ch. 12", color: AT_AMBER }],
    18: [{ title: "Hamlet act 3", color: AT_ROSE }],
    20: [{ title: "Lab report",   color: AT_MINT }],
    23: [{ title: "Practice midterm", color: AT_TEAL }],
    25: [{ title: "Essay: WWII", color: AT_AMBER }, { title: "Lab discussion", color: AT_MINT }],
    29: [{ title: "Final outline", color: AT_ROSE }],
  };

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 30,
      }}>
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 60 : 48, fontWeight: 800, letterSpacing: -1.6,
          marginBottom: vertical ? 22 : 18, textAlign: "center",
        }}>
          Every due date <span style={{
            background: AT_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>color-coded.</span>
        </div>

        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
        }}>
          <BrowserFrame url="assignmenttracker.pages.dev/#/calendar" width={pageWidth} height={pageHeight}>
            <div style={{
              padding: vertical ? "20px 20px" : "26px 36px",
              background: "transparent",
              height: "100%",
              fontFamily: FONT_STACK, color: "white",
            }}>
              {/* Calendar header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 14,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    display: "grid", placeItems: "center", color: "white", fontSize: 18,
                  }}>‹</div>
                  <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>October 2026</div>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    display: "grid", placeItems: "center", color: "white", fontSize: 18,
                  }}>›</div>
                </div>
                <div style={{
                  padding: "6px 14px", borderRadius: 999,
                  background: AT_GRADIENT,
                  fontSize: 12, fontWeight: 700,
                }}>Today</div>
              </div>

              {/* DOW row */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6,
                marginBottom: 6,
              }}>
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                  <div key={d} style={{
                    fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.62)",
                    letterSpacing: 1, textAlign: "center", padding: "6px 0",
                  }}>{d}</div>
                ))}
              </div>

              {/* Calendar grid */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6,
              }}>
                {Array.from({ length: 35 }).map((_, i) => {
                  const dayNum = i - startOffset + 1;
                  const isOther = dayNum < 1 || dayNum > monthDays;
                  const isToday = dayNum === today;
                  const isWeekend = (i % 7 === 0) || (i % 7 === 6);
                  const cellSp = spring({
                    frame: frame - (0.4 + (i * 0.012)) * fps, fps,
                    config: { damping: 18 },
                  });
                  const dayEvents = events[dayNum] || [];
                  return (
                    <div key={i} style={{
                      opacity: cellSp,
                      transform: `translateY(${interpolate(cellSp, [0, 1], [10, 0])}px)`,
                      minHeight: vertical ? 110 : 102,
                      background: isWeekend ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.07)",
                      border: isToday
                        ? `1.5px solid ${AT_MINT}`
                        : "1px solid rgba(255,255,255,0.10)",
                      borderRadius: 10, padding: "6px 8px",
                      opacity: isOther ? 0.32 : (cellSp || 1),
                      boxShadow: isToday ? `inset 0 0 0 1px rgba(6,214,160,0.30)` : "none",
                    }}>
                      <div style={{
                        fontSize: 12, fontWeight: 700,
                        color: isToday ? AT_MINT : "rgba(255,255,255,0.62)",
                        marginBottom: 4,
                      }}>{isOther ? (dayNum < 1 ? 28 + dayNum : dayNum - monthDays) : dayNum}</div>
                      {!isOther && dayEvents.slice(0, 3).map((ev, j) => (
                        <div key={j} style={{
                          fontSize: 9, fontWeight: 700,
                          padding: "2px 5px",
                          borderRadius: 3,
                          background: ev.color + "26", color: ev.color,
                          marginBottom: 2,
                          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>{ev.title}</div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </BrowserFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 4: Studying montage — checking off assignments -----------

export const ATStudyingScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });

  const pageWidth = vertical ? 940 : 1400;
  const pageHeight = vertical ? 1280 : 760;

  // 5 assignments getting checked off in sequence
  const checkTimings = [0.7, 1.2, 1.7, 2.2, 2.7].map(s => s * fps);

  const items = [
    { color: AT_MINT,  title: "Cell organelle quiz",   klass: "AP Biology",    weight: "5%",  due: "Today" },
    { color: AT_TEAL,  title: "Problem set #14",       klass: "Calculus BC",   weight: "5%",  due: "Today" },
    { color: AT_AMBER, title: "Read Ch. 12 (Civil War)", klass: "AP US History", weight: "—",   due: "Tomorrow" },
    { color: AT_ROSE,  title: "Hamlet act 3 close read", klass: "English Lit",   weight: "—",   due: "In 3d" },
    { color: AT_MINT,  title: "Lab report: photosynthesis", klass: "AP Biology", weight: "15%", due: "In 5d" },
  ];

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 30,
      }}>
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 60 : 48, fontWeight: 800, letterSpacing: -1.6,
          marginBottom: vertical ? 22 : 18, textAlign: "center",
        }}>
          Knock 'em <span style={{
            background: AT_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>down.</span>
        </div>

        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
        }}>
          <BrowserFrame url="assignmenttracker.pages.dev" width={pageWidth} height={pageHeight}>
            <div style={{
              padding: vertical ? "30px 26px" : "40px 50px",
              background: "transparent",
              fontFamily: FONT_STACK, color: "white", height: "100%",
            }}>
              <div style={{
                fontSize: vertical ? 24 : 22, fontWeight: 800, letterSpacing: -0.5,
                marginBottom: 18,
              }}>Open assignments · 5</div>

              {items.map((a, i) => {
                const checked = frame >= checkTimings[i];
                const checkSp = spring({
                  frame: frame - checkTimings[i], fps,
                  config: { damping: 14, stiffness: 200 },
                });
                const fadeSp = spring({
                  frame: frame - checkTimings[i] - 0.15 * fps, fps,
                  config: { damping: 18 },
                });
                const opacity = checked ? 1 - fadeSp * 0.55 : 1;
                const scaleVal = checked ? 1 - fadeSp * 0.02 : 1;

                return (
                  <div key={a.title} style={{
                    opacity: opacity,
                    transform: `scale(${scaleVal})`,
                    display: "grid",
                    gridTemplateColumns: "4px 28px 1fr auto auto",
                    gap: 14, alignItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 14,
                    padding: "14px 18px 14px 0",
                    marginBottom: 10,
                    transition: "none",
                    textDecoration: checked ? "line-through" : "none",
                    textDecorationColor: AT_MINT,
                  }}>
                    <div style={{ width: 4, height: 50, background: a.color, borderRadius: "14px 0 0 14px" }} />
                    <div style={{
                      width: 24, height: 24, marginLeft: 14,
                      borderRadius: 6,
                      border: checked ? "none" : "1.5px solid rgba(255,255,255,0.20)",
                      background: checked ? AT_MINT : "transparent",
                      display: "grid", placeItems: "center",
                      transform: `scale(${checked ? 1 + (1 - checkSp) * 0.4 : 1})`,
                      transition: "none",
                      boxShadow: checked ? `0 0 24px rgba(6,214,160,${0.6 * checkSp})` : "none",
                    }}>
                      {checked && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12 L10 17 L19 7"
                            stroke="white"
                            strokeWidth="3.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
                        {a.title}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{
                          padding: "2px 9px", borderRadius: 999,
                          background: a.color + "26", color: a.color,
                          fontSize: 11, fontWeight: 800, letterSpacing: 0.3,
                        }}>{a.klass}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{a.weight}</div>
                    </div>
                    <div style={{
                      fontSize: 14, fontWeight: 700, paddingLeft: 14,
                      color: checked ? "rgba(255,255,255,0.4)" : (a.due.includes("Today") ? AT_AMBER : "white"),
                    }}>
                      {a.due}
                    </div>
                  </div>
                );
              })}

              {/* "Done" badge bottom-right */}
              {frame > checkTimings[checkTimings.length - 1] + 0.3 * fps && (
                <div style={{
                  marginTop: 28,
                  padding: "14px 22px",
                  background: "rgba(52, 199, 89, 0.18)",
                  border: "1px solid rgba(52, 199, 89, 0.45)",
                  borderRadius: 14,
                  fontSize: vertical ? 18 : 18, fontWeight: 800,
                  color: AT_GREEN, letterSpacing: -0.3,
                  textAlign: "center",
                  transform: `scale(${
                    spring({ frame: frame - checkTimings[checkTimings.length - 1] - 0.3 * fps, fps, config: { damping: 12 } })
                  })`,
                }}>
                  ✓ All caught up. Take the night off.
                </div>
              )}
            </div>
          </BrowserFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 5: Features grid (text only, fast) -----------------------

const FEATURES = [
  { title: "Smart sort",   sub: "Done last, late first." },
  { title: "Late warnings", sub: "Red the second it slips." },
  { title: "Color classes", sub: "Pick a color per subject." },
  { title: "Calendar",      sub: "See the whole month." },
  { title: "Local-first",   sub: "Your data stays here." },
  { title: "JSON backup",   sub: "Export anytime." },
];

export const ATFeaturesScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <ATWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 60 : 50, fontWeight: 800, letterSpacing: -1.8,
          marginBottom: vertical ? 36 : 32, textAlign: "center",
        }}>
          And it's <span style={{
            background: AT_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>actually free.</span>
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
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 16,
                padding: vertical ? "20px 22px" : "22px 26px",
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
      <ATWallpaper />
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
          fontSize: vertical ? 80 : 64, fontWeight: 800, letterSpacing: -2,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          opacity: titleSp, textAlign: "center", lineHeight: 1.05,
        }}>
          AssignmentTracker
        </div>
        <div style={{
          marginTop: vertical ? 14 : 10,
          fontSize: vertical ? 28 : 22, fontWeight: 600, letterSpacing: -0.4,
          color: COLORS.textSecondary,
          opacity: subSp,
          transform: `translateY(${interpolate(subSp, [0, 1], [12, 0])}px)`,
          textAlign: "center",
        }}>
          Stay ahead of every due date.
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
          ★ github.com/bendawg2010/AssignmentTracker · free forever
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
