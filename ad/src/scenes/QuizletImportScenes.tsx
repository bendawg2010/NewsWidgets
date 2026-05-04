import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";

// ----- Brand tokens -----------------------------------------------------

const SD_ORANGE = "#FFB454";
const SD_PINK   = "#FF6B6B";
const SD_PURPLE = "#C147FF";
const SD_GREEN  = "#34C759";
const QUIZLET_BLUE  = "#4257B2";
const QUIZLET_DARK  = "#2C3899";
const SD_GRADIENT = `linear-gradient(135deg, ${SD_ORANGE} 0%, ${SD_PINK} 50%, ${SD_PURPLE} 100%)`;

// ----- Wallpaper --------------------------------------------------------

const QIWallpaper: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{
      background:
        "radial-gradient(1400px 900px at 22% 18%, rgba(255, 180, 84, 0.45), transparent 65%)," +
        "radial-gradient(1200px 800px at 78% 88%, rgba(193, 71, 255, 0.45), transparent 65%)," +
        "radial-gradient(900px 600px at 60% 52%, rgba(255, 107, 107, 0.30), transparent 70%)," +
        "linear-gradient(135deg, #18080a 0%, #100a18 60%, #0c041c 100%)",
    }} />
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
    }} />
  </AbsoluteFill>
);

// ----- Hook scene -------------------------------------------------------

export const QIHookScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const t2 = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const t3 = spring({ frame: frame - 0.9 * fps, fps, config: { damping: 22 } });
  const fontSize = vertical ? 150 : 110;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <QIWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          opacity: t1, fontSize: fontSize * 0.95, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
        }}>
          Your Quizlet sets,
        </div>
        <div style={{
          marginTop: vertical ? 24 : 18,
          transform: `translateY(${interpolate(t2, [0, 1], [30, 0])}px)`,
          opacity: t2, fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
          background: SD_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          imported in 2 clicks.
        </div>
        <div style={{
          marginTop: vertical ? 36 : 28,
          transform: `translateY(${interpolate(t3, [0, 1], [12, 0])}px)`,
          opacity: t3,
          fontSize: vertical ? 32 : 26,
          fontWeight: 600, color: COLORS.textSecondary, letterSpacing: -0.4,
        }}>
          No account. No copy-paste. No retyping.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Drag bookmarklet scene ------------------------------------------

export const QIDragScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });
  const labelEnter = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 22 } });

  // Drag from "modal" position to bookmarks bar between t=0.9s and t=2.4s
  const dragStart = 0.9 * fps;
  const dragEnd   = 2.4 * fps;
  const dragP = interpolate(frame, [dragStart, dragEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // After drop: show landed pill + checkmark (t > 2.4s)
  const landedSp = spring({
    frame: frame - dragEnd, fps,
    config: { damping: 12, stiffness: 200 },
  });

  const pageWidth = vertical ? 920 : 1300;
  const pageHeight = vertical ? 1280 : 760;

  // Source position (StudyDeck modal pill, near top-center of "page")
  const startX = pageWidth * 0.5;
  const startY = vertical ? 380 : 250;
  // Target position (in the bookmarks bar — top-left area)
  const endX = vertical ? 230 : 240;
  const endY = vertical ? 70 : 56;

  const cursorX = interpolate(dragP, [0, 1], [startX, endX]);
  const cursorY = interpolate(dragP, [0, 1], [startY, endY]);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <QIWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40,
      }}>
        {/* Headline */}
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 56 : 44, fontWeight: 800, letterSpacing: -1.5,
          marginBottom: vertical ? 40 : 30,
          textAlign: "center",
        }}>
          1. Drag to your bookmarks bar
        </div>

        {/* Browser window */}
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
          width: pageWidth, height: pageHeight,
          borderRadius: 18,
          background: "#1c1c1e",
          boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Title bar */}
          <div style={{
            height: 36,
            background: "#2a2a2c",
            display: "flex", alignItems: "center", padding: "0 14px",
            borderBottom: "1px solid #00000044",
            gap: 8,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FF5F57" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#FEBC2E" }} />
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#28C840" }} />
            <div style={{
              marginLeft: 18, flex: 1, height: 22, borderRadius: 6,
              background: "#3a3a3c", color: "#bbb",
              fontSize: 13, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              display: "flex", alignItems: "center", padding: "0 10px",
            }}>
              studydeck.pages.dev
            </div>
          </div>

          {/* Bookmarks bar */}
          <div style={{
            height: 32,
            background: "#242426",
            borderBottom: "1px solid #00000033",
            display: "flex", alignItems: "center",
            padding: "0 14px", gap: 14,
            fontSize: 12, color: "#bbb",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          }}>
            <span>★ Reading List</span>
            <span>★ News</span>
            <span>★ Github</span>
            <span style={{ opacity: 0.5 }}>★ Quizlet</span>
            {/* Drop slot — appears highlighted when cursor is near the end */}
            <div style={{
              width: 4, height: 22, marginLeft: -2,
              background: dragP > 0.6 ? SD_PURPLE : "transparent",
              borderRadius: 2,
              opacity: dragP > 0.6 ? 1 - Math.max(0, (dragP - 0.95) * 8) : 0,
            }} />
            {/* The landed bookmark pill */}
            {landedSp > 0.05 && (
              <div style={{
                opacity: landedSp,
                transform: `scale(${interpolate(landedSp, [0, 1], [0.6, 1])})`,
                padding: "3px 10px",
                borderRadius: 6,
                background: SD_GRADIENT,
                fontSize: 11, fontWeight: 700, color: "white",
                letterSpacing: -0.2, marginLeft: -10,
                whiteSpace: "nowrap",
              }}>
                ⭐ Send to StudyDeck
              </div>
            )}
          </div>

          {/* Page content area */}
          <div style={{
            position: "absolute", top: 68, left: 0, right: 0, bottom: 0,
            background:
              "radial-gradient(900px 500px at 50% 30%, rgba(193,71,255,0.18), transparent 70%)," +
              "linear-gradient(180deg, #0c041c 0%, #18080a 100%)",
            padding: vertical ? 40 : 60,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "flex-start",
            gap: vertical ? 28 : 24,
          }}>
            <div style={{
              fontSize: vertical ? 30 : 26, fontWeight: 700, color: "white", marginTop: 8,
              opacity: 0.9,
            }}>
              Import from Quizlet
            </div>
            <div style={{
              fontSize: vertical ? 18 : 16, color: COLORS.textSecondary, fontWeight: 500,
              opacity: 0.7, textAlign: "center", maxWidth: 600,
            }}>
              Drag the button below to your bookmarks bar.
            </div>
            {/* The pill being dragged FROM (still visible at source until drop completes) */}
            <div style={{
              marginTop: vertical ? 28 : 20,
              padding: vertical ? "26px 56px" : "22px 44px",
              borderRadius: 16,
              background: SD_GRADIENT,
              fontSize: vertical ? 38 : 30,
              fontWeight: 800, color: "white", letterSpacing: -0.5,
              boxShadow: "0 16px 48px rgba(193, 71, 255, 0.45)",
              opacity: dragP < 0.05 ? 1 : 0.35,
              transform: dragP < 0.05 ? "scale(1)" : "scale(0.96)",
              transition: "none",
            }}>
              ⭐ Send to StudyDeck
            </div>
          </div>

          {/* The dragged "ghost" pill flying with the cursor */}
          {dragP > 0.02 && dragP < 0.99 && (
            <div style={{
              position: "absolute",
              left: cursorX, top: cursorY,
              transform: "translate(-50%, -50%)",
              padding: "10px 18px",
              borderRadius: 10,
              background: SD_GRADIENT,
              fontSize: vertical ? 18 : 14,
              fontWeight: 800, color: "white",
              opacity: 0.92,
              boxShadow: "0 12px 28px rgba(0,0,0,0.55)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}>
              ⭐ Send to StudyDeck
            </div>
          )}

          {/* Cursor arrow */}
          {dragP > 0.02 && (
            <svg
              width="28" height="28" viewBox="0 0 24 24"
              style={{
                position: "absolute",
                left: cursorX + 8, top: cursorY + 8,
                pointerEvents: "none",
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.55))",
              }}
            >
              <path
                d="M2 2 L20 12 L12 13 L9 22 Z"
                fill="white" stroke="#000" strokeWidth="1.5"
              />
            </svg>
          )}
        </div>

        {/* Caption underneath */}
        <div style={{
          opacity: labelEnter,
          transform: `translateY(${interpolate(labelEnter, [0, 1], [12, 0])}px)`,
          marginTop: vertical ? 36 : 28,
          fontSize: vertical ? 26 : 22,
          fontWeight: 600, color: COLORS.textSecondary,
          textAlign: "center", letterSpacing: -0.3,
        }}>
          One-time setup. Works on any browser.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Click + scrape scene --------------------------------------------

export const QIClickScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });

  // Click happens at t=0.6s, after that the counter ramps up
  const clickFrame = 0.6 * fps;
  const clickPulse = interpolate(
    frame, [clickFrame - 4, clickFrame, clickFrame + 12],
    [1, 1.12, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Counter ramps from 0 → 247 between clickFrame+8 and clickFrame+ ~2.5s
  const rampStart = clickFrame + 8;
  const rampEnd   = clickFrame + 2.4 * fps;
  const ramp = interpolate(frame, [rampStart, rampEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // Snappy easing
  const eased = 1 - Math.pow(1 - ramp, 3);
  const counter = Math.round(eased * 247);

  // After ramp, badge text changes to "Got 247 cards! Opening…"
  const doneSp = spring({
    frame: frame - rampEnd, fps,
    config: { damping: 18 },
  });

  const pageWidth = vertical ? 920 : 1300;
  const pageHeight = vertical ? 1280 : 760;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <QIWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40,
      }}>
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 56 : 44, fontWeight: 800, letterSpacing: -1.5,
          marginBottom: vertical ? 40 : 30,
          textAlign: "center",
        }}>
          2. Click it on any Quizlet set
        </div>

        {/* Mock browser showing Quizlet */}
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
          width: pageWidth, height: pageHeight,
          borderRadius: 18,
          background: "#1c1c1e",
          boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Title bar */}
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
            }}>
              quizlet.com/501234567/french-vocab
            </div>
          </div>

          {/* Bookmarks bar — with our pill */}
          <div style={{
            height: 32, background: "#242426",
            borderBottom: "1px solid #00000033",
            display: "flex", alignItems: "center",
            padding: "0 14px", gap: 14,
            fontSize: 12, color: "#bbb",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            position: "relative",
          }}>
            <span>★ Reading List</span>
            <span>★ News</span>
            <span>★ Github</span>
            <span style={{ opacity: 0.5 }}>★ Quizlet</span>
            <div style={{
              padding: "3px 10px", borderRadius: 6,
              background: SD_GRADIENT,
              fontSize: 11, fontWeight: 700, color: "white",
              letterSpacing: -0.2, whiteSpace: "nowrap",
              transform: `scale(${clickPulse})`,
              boxShadow: clickPulse > 1.05
                ? "0 0 0 4px rgba(193, 71, 255, 0.35), 0 0 24px rgba(255, 107, 107, 0.45)"
                : "none",
            }}>
              ⭐ Send to StudyDeck
            </div>
            {/* Cursor pointing at the pill, lands at clickFrame */}
            {(() => {
              const startY = vertical ? 220 : 180;
              const cy = interpolate(
                frame, [0, clickFrame],
                [startY, 24],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              const cx = interpolate(
                frame, [0, clickFrame],
                [vertical ? 460 : 600, 280],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              );
              return (
                <svg
                  width="28" height="28" viewBox="0 0 24 24"
                  style={{
                    position: "absolute", left: cx, top: cy,
                    pointerEvents: "none",
                    filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.55))",
                  }}
                >
                  <path
                    d="M2 2 L20 12 L12 13 L9 22 Z"
                    fill="white" stroke="#000" strokeWidth="1.5"
                  />
                </svg>
              );
            })()}
          </div>

          {/* Page area: Quizlet branded background + StudyDeck progress badge */}
          <div style={{
            position: "absolute", top: 68, left: 0, right: 0, bottom: 0,
            background: `linear-gradient(180deg, ${QUIZLET_BLUE} 0%, ${QUIZLET_DARK} 100%)`,
            padding: vertical ? 40 : 60,
            overflow: "hidden",
          }}>
            {/* Mock Quizlet header */}
            <div style={{
              fontSize: vertical ? 36 : 30, fontWeight: 800, color: "white",
              letterSpacing: -1, marginBottom: 8,
            }}>
              French Vocab — A1
            </div>
            <div style={{
              fontSize: vertical ? 20 : 16, color: "rgba(255,255,255,0.65)",
              fontWeight: 500, marginBottom: vertical ? 32 : 24,
            }}>
              247 terms · created by mme.dupont
            </div>
            {/* Mock card list (scrollable feel) */}
            {[
              ["bonjour", "hello"],
              ["merci", "thank you"],
              ["s'il vous plaît", "please"],
              ["au revoir", "goodbye"],
              ["chat", "cat"],
              ["chien", "dog"],
            ].map(([a, b], i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: vertical ? "16px 24px" : "12px 22px",
                marginBottom: 10, color: "white",
                fontSize: vertical ? 24 : 18, fontWeight: 600,
              }}>
                <span>{a}</span>
                <span style={{ opacity: 0.75 }}>{b}</span>
              </div>
            ))}

            {/* StudyDeck floating badge (top-right, brand gradient) */}
            {frame >= clickFrame - 4 && (
              <div style={{
                position: "absolute",
                top: vertical ? 24 : 20,
                right: vertical ? 24 : 20,
                padding: "14px 20px",
                borderRadius: 12,
                background: SD_GRADIENT,
                color: "white",
                fontFamily: FONT_STACK,
                fontWeight: 700,
                fontSize: vertical ? 20 : 16,
                boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                maxWidth: vertical ? 380 : 340,
                transform: `scale(${interpolate(frame, [clickFrame - 4, clickFrame], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
              }}>
                {doneSp > 0.4
                  ? `StudyDeck: got ${counter} cards! Opening…`
                  : `StudyDeck: scanning page… ${counter}`}
              </div>
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Result scene -----------------------------------------------------

export const QIResultScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSp = spring({ frame, fps, config: { damping: 18 } });

  // Cards fade/stagger in
  const cards = [
    ["bonjour", "hello"],
    ["merci", "thank you"],
    ["s'il vous plaît", "please"],
    ["au revoir", "goodbye"],
    ["chat", "cat"],
    ["chien", "dog"],
  ];

  const checkSp = spring({
    frame: frame - 1.6 * fps, fps,
    config: { damping: 12, stiffness: 180 },
  });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <QIWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40,
      }}>
        <div style={{
          opacity: headerSp,
          transform: `translateY(${interpolate(headerSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 56 : 44, fontWeight: 800, letterSpacing: -1.5,
          marginBottom: vertical ? 36 : 28,
          textAlign: "center",
        }}>
          3. Done. Cards in StudyDeck.
        </div>

        {/* StudyDeck-styled card list */}
        <div style={{
          opacity: headerSp,
          transform: `translateY(${interpolate(headerSp, [0, 1], [40, 0])}px)`,
          width: vertical ? 880 : 1100,
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 24,
          padding: vertical ? 28 : 36,
          backdropFilter: "blur(40px) saturate(180%)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
          position: "relative",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: vertical ? 24 : 20,
          }}>
            <div style={{
              fontSize: vertical ? 30 : 26, fontWeight: 800, letterSpacing: -0.6,
            }}>
              French Vocab — A1
            </div>
            <div style={{
              padding: "6px 14px", borderRadius: 999,
              background: "rgba(52, 199, 89, 0.18)",
              border: "1px solid rgba(52, 199, 89, 0.35)",
              fontSize: vertical ? 18 : 15, fontWeight: 700, color: SD_GREEN,
            }}>
              247 cards
            </div>
          </div>

          {cards.map(([t, d], i) => {
            const cardSp = spring({
              frame: frame - (0.5 + i * 0.12) * fps, fps,
              config: { damping: 16, stiffness: 120 },
            });
            return (
              <div key={i} style={{
                opacity: cardSp,
                transform: `translateY(${interpolate(cardSp, [0, 1], [16, 0])}px) scale(${interpolate(cardSp, [0, 1], [0.96, 1])})`,
                display: "flex", alignItems: "center",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: vertical ? "16px 20px" : "14px 22px",
                marginBottom: 10,
                gap: vertical ? 16 : 20,
              }}>
                <div style={{ color: "#666", fontSize: vertical ? 20 : 16, width: 20 }}>⋮⋮</div>
                <div style={{
                  flex: 1, fontSize: vertical ? 24 : 20, fontWeight: 600, letterSpacing: -0.3,
                }}>
                  {t}
                </div>
                <div style={{
                  flex: 1, fontSize: vertical ? 22 : 18,
                  color: COLORS.textSecondary, letterSpacing: -0.2,
                }}>
                  {d}
                </div>
              </div>
            );
          })}

          <div style={{
            textAlign: "center", marginTop: vertical ? 16 : 14,
            fontSize: vertical ? 18 : 15, color: COLORS.textSecondary,
            fontWeight: 600, letterSpacing: -0.2,
            opacity: spring({ frame: frame - 1.5 * fps, fps, config: { damping: 22 } }),
          }}>
            …and 241 more
          </div>

          {/* Big check */}
          <div style={{
            position: "absolute",
            top: vertical ? -28 : -32,
            right: vertical ? -16 : -24,
            width: vertical ? 76 : 64, height: vertical ? 76 : 64,
            borderRadius: vertical ? 38 : 32,
            background: SD_GREEN,
            display: "grid", placeItems: "center",
            transform: `scale(${interpolate(checkSp, [0, 1], [0, 1])}) rotate(${interpolate(checkSp, [0, 1], [-90, 0])}deg)`,
            boxShadow: "0 12px 32px rgba(52,199,89,0.55)",
            opacity: checkSp,
          }}>
            <svg width={vertical ? 40 : 34} height={vertical ? 40 : 34} viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12 L10 17 L19 7"
                stroke="white" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Outro scene ------------------------------------------------------

export const QIOutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconSp = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
  const titleSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const ctaSp = spring({ frame: frame - 0.8 * fps, fps, config: { damping: 22 } });
  const urlSp = spring({ frame: frame - 1.1 * fps, fps, config: { damping: 22 } });

  const iconSize = vertical ? 220 : 160;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <QIWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          transform: `scale(${interpolate(iconSp, [0, 1], [0.4, 1])}) rotate(${interpolate(iconSp, [0, 1], [-20, 0])}deg)`,
          opacity: iconSp,
          width: iconSize, height: iconSize, borderRadius: iconSize * 0.22,
          background: SD_GRADIENT,
          display: "grid", placeItems: "center",
          boxShadow: `inset 0 ${iconSize * 0.012}px 0 rgba(255,255,255,0.18), 0 ${iconSize * 0.16}px ${iconSize * 0.32}px rgba(0,0,0,0.45)`,
        }}>
          <svg width={iconSize * 0.6} height={iconSize * 0.6} viewBox="0 0 60 60" fill="white">
            <rect x="10" y="14" width="34" height="40" rx="5" opacity="0.45" />
            <rect x="14" y="10" width="34" height="40" rx="5" opacity="0.7" />
            <rect x="18" y="6" width="34" height="40" rx="5" />
            <text x="35" y="32" fontSize="20" fontWeight="800" textAnchor="middle" fill="#FF6B6B">A</text>
          </svg>
        </div>
        <div style={{
          marginTop: vertical ? 40 : 32,
          fontSize: vertical ? 84 : 68, fontWeight: 800, letterSpacing: -2,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          opacity: titleSp, textAlign: "center",
        }}>
          Bring your decks.
        </div>
        <div style={{
          fontSize: vertical ? 84 : 68, fontWeight: 800, letterSpacing: -2,
          transform: `translateY(${interpolate(ctaSp, [0, 1], [20, 0])}px)`,
          opacity: ctaSp, textAlign: "center",
          background: SD_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          Pay $0.
        </div>
        <div style={{
          marginTop: vertical ? 56 : 40,
          padding: vertical ? "18px 36px" : "14px 28px",
          borderRadius: 999,
          background: SD_GRADIENT,
          boxShadow: `0 12px 48px rgba(193, 71, 255, 0.45)`,
          opacity: urlSp,
          transform: `translateY(${interpolate(urlSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 30 : 24,
          fontWeight: 700, letterSpacing: -0.5,
        }}>
          studydeck.pages.dev
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
          ★ github.com/bendawg2010/StudyDeck
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
