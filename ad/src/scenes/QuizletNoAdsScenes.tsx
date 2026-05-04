import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence,
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

const QNAWallpaper: React.FC = () => (
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

// ----- Reusable: browser frame -----------------------------------------

const BrowserFrame: React.FC<{
  url: string;
  width: number;
  height: number;
  showBookmark?: boolean;
  bookmarkPulse?: number;
  children: React.ReactNode;
}> = ({ url, width, height, showBookmark = false, bookmarkPulse = 1, children }) => (
  <div style={{
    width, height,
    borderRadius: 18,
    background: "#1c1c1e",
    boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.08)",
    overflow: "hidden",
    position: "relative",
    fontFamily: FONT_STACK,
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
        {url}
      </div>
    </div>

    {/* Bookmarks bar */}
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
      {showBookmark && (
        <div style={{
          padding: "3px 10px", borderRadius: 6,
          background: SD_GRADIENT,
          fontSize: 11, fontWeight: 700, color: "white",
          letterSpacing: -0.2, whiteSpace: "nowrap",
          transform: `scale(${bookmarkPulse})`,
          boxShadow: bookmarkPulse > 1.05
            ? "0 0 0 4px rgba(193, 71, 255, 0.35), 0 0 24px rgba(255, 107, 107, 0.45)"
            : "none",
        }}>
          ⭐ Send to StudyDeck
        </div>
      )}
    </div>

    {/* Page area */}
    <div style={{
      position: "absolute", top: 68, left: 0, right: 0, bottom: 0,
      overflow: "hidden",
    }}>
      {children}
    </div>
  </div>
);

const Cursor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg
    width="28" height="28" viewBox="0 0 24 24"
    style={{
      position: "absolute", left: x, top: y,
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

// ----- Scene 1: Quizlet drowned in ads ---------------------------------

export const QNAAdsScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSp = spring({ frame, fps, config: { damping: 18 } });

  // First ad slides up at t=0.6s, second ad pops in at t=1.6s, third at t=2.4s
  const ad1Sp = spring({ frame: frame - 0.6 * fps, fps, config: { damping: 12, stiffness: 170 } });
  const ad2Sp = spring({ frame: frame - 1.6 * fps, fps, config: { damping: 12, stiffness: 170 } });
  const ad3Sp = spring({ frame: frame - 2.4 * fps, fps, config: { damping: 12, stiffness: 170 } });

  // Cursor desperately tries to hit an X — wiggles around the screen
  const wiggle = Math.sin(frame / 4) * 12;
  const cursorX = vertical
    ? 540 + Math.sin(frame / 8) * 200
    : 1100 + Math.sin(frame / 8) * 240;
  const cursorY = vertical
    ? 1100 + Math.cos(frame / 7) * 180 + wiggle
    : 620 + Math.cos(frame / 7) * 140 + wiggle;

  const pageWidth = vertical ? 920 : 1300;
  const pageHeight = vertical ? 1280 : 760;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <QNAWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40,
      }}>
        <div style={{
          opacity: headerSp,
          transform: `translateY(${interpolate(headerSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 72 : 56, fontWeight: 800, letterSpacing: -2,
          marginBottom: vertical ? 40 : 28,
          textAlign: "center",
        }}>
          Quizlet today.
        </div>

        <BrowserFrame
          url="quizlet.com/501234567/biology-101"
          width={pageWidth} height={pageHeight}
        >
          {/* Quizlet content background */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(180deg, ${QUIZLET_BLUE} 0%, ${QUIZLET_DARK} 100%)`,
            padding: vertical ? 36 : 50,
            color: "white",
          }}>
            <div style={{
              fontSize: vertical ? 32 : 28, fontWeight: 800, letterSpacing: -1,
              marginBottom: 6,
            }}>
              Biology 101
            </div>
            <div style={{
              fontSize: vertical ? 18 : 15, color: "rgba(255,255,255,0.65)",
              fontWeight: 500, marginBottom: vertical ? 24 : 18,
            }}>
              184 terms · created by mr.smith
            </div>
            {[
              ["mitochondria", "powerhouse of the cell"],
              ["nucleus", "control center"],
              ["ribosome", "site of protein synthesis"],
              ["lysosome", "digestion organelle"],
              ["vacuole", "storage compartment"],
            ].map(([a, b], i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 10,
                padding: vertical ? "14px 22px" : "12px 22px",
                marginBottom: 10, color: "white",
                fontSize: vertical ? 22 : 18, fontWeight: 600,
              }}>
                <span>{a}</span>
                <span style={{ opacity: 0.75 }}>{b}</span>
              </div>
            ))}

            {/* AD #1 — Top banner */}
            <div style={{
              position: "absolute",
              top: 14, left: "10%", right: "10%",
              padding: vertical ? "16px 22px" : "12px 22px",
              borderRadius: 10,
              background: "linear-gradient(90deg, #FFD400, #FF6A00)",
              color: "#000", fontWeight: 800,
              fontSize: vertical ? 22 : 18,
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              transform: `translateY(${interpolate(ad1Sp, [0, 1], [-80, 0])}px)`,
              opacity: ad1Sp,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>🔥 LOSE 30 LBS WITH THIS WEIRD TRICK!</span>
              <span style={{
                fontSize: 11, opacity: 0.6, padding: "2px 6px",
                border: "1px solid #00000088", borderRadius: 3,
              }}>×</span>
            </div>

            {/* AD #2 — Big rectangle */}
            <div style={{
              position: "absolute",
              right: vertical ? 24 : 60, bottom: vertical ? 240 : 140,
              width: vertical ? 320 : 380,
              height: vertical ? 240 : 220,
              borderRadius: 10,
              background: "linear-gradient(135deg, #FF1744, #C62828)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.55)",
              transform: `scale(${ad2Sp}) rotate(${interpolate(ad2Sp, [0, 1], [-8, 0])}deg)`,
              opacity: ad2Sp,
              padding: 18,
              color: "white", fontFamily: "Impact, system-ui",
              display: "flex", flexDirection: "column",
              justifyContent: "space-between",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{
                  fontSize: 11, opacity: 0.7,
                  padding: "1px 5px", border: "1px solid #ffffff66", borderRadius: 3,
                }}>AD</span>
                <span style={{
                  fontSize: 11, opacity: 0.6, padding: "1px 5px",
                  border: "1px solid #ffffff66", borderRadius: 3,
                }}>×</span>
              </div>
              <div style={{
                fontSize: vertical ? 36 : 32, lineHeight: 1.05, letterSpacing: 0.5,
              }}>
                CLICK NOW!!! WIN $1000
              </div>
              <div style={{ fontSize: 13, opacity: 0.85, fontFamily: FONT_STACK, fontWeight: 600 }}>
                Limited time offer — last chance!
              </div>
            </div>

            {/* AD #3 — Sticky bottom */}
            <div style={{
              position: "absolute",
              bottom: 0, left: 0, right: 0,
              padding: vertical ? "20px 24px" : "18px 28px",
              background: "linear-gradient(180deg, #00C853, #00897B)",
              color: "white", fontWeight: 800,
              fontSize: vertical ? 24 : 20,
              boxShadow: "0 -8px 24px rgba(0,0,0,0.5)",
              transform: `translateY(${interpolate(ad3Sp, [0, 1], [120, 0])}px)`,
              opacity: ad3Sp,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>📱 DOWNLOAD OUR APP — FREE TRIAL!</span>
              <span style={{
                padding: "8px 16px", background: "white", color: "#00897B",
                borderRadius: 999, fontSize: vertical ? 16 : 14,
              }}>GET IT</span>
            </div>

            {/* Cursor wandering */}
            <Cursor x={cursorX} y={cursorY} />
          </div>
        </BrowserFrame>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 2: Drop bookmark ------------------------------------------

export const QNADropScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });

  const dragStart = 0.7 * fps;
  const dragEnd   = 2.4 * fps;
  const dragP = interpolate(frame, [dragStart, dragEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const landedSp = spring({
    frame: frame - dragEnd, fps,
    config: { damping: 12, stiffness: 200 },
  });

  const pageWidth = vertical ? 920 : 1300;
  const pageHeight = vertical ? 1280 : 760;
  const startX = pageWidth * 0.5;
  const startY = vertical ? 380 : 250;
  const endX = vertical ? 230 : 240;
  const endY = vertical ? 70 : 56;
  const cursorX = interpolate(dragP, [0, 1], [startX, endX]);
  const cursorY = interpolate(dragP, [0, 1], [startY, endY]);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <QNAWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40,
      }}>
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 64 : 50, fontWeight: 800, letterSpacing: -1.8,
          marginBottom: vertical ? 36 : 26, textAlign: "center",
        }}>
          Drop our bookmark.
        </div>

        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
          position: "relative",
        }}>
          <BrowserFrame
            url="studydeck.pages.dev"
            width={pageWidth} height={pageHeight}
            showBookmark={landedSp > 0.05}
            bookmarkPulse={interpolate(landedSp, [0, 1], [0.6, 1])}
          >
            <div style={{
              position: "absolute", inset: 0,
              background:
                "radial-gradient(900px 500px at 50% 30%, rgba(193,71,255,0.18), transparent 70%)," +
                "linear-gradient(180deg, #0c041c 0%, #18080a 100%)",
              padding: vertical ? 40 : 60,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "flex-start",
              gap: vertical ? 28 : 24,
              fontFamily: FONT_STACK, color: "white",
            }}>
              <div style={{
                fontSize: vertical ? 32 : 28, fontWeight: 800, marginTop: 8,
                letterSpacing: -0.5,
              }}>
                Import from Quizlet
              </div>
              <div style={{
                fontSize: vertical ? 18 : 16, color: "rgba(255,255,255,0.70)",
                fontWeight: 500, textAlign: "center", maxWidth: 600,
              }}>
                Drag this button to your bookmarks bar.
              </div>
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
              }}>
                ⭐ Send to StudyDeck
              </div>
            </div>

            {/* Drag ghost */}
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
            {dragP > 0.02 && (
              <Cursor x={cursorX + 8} y={cursorY + 8} />
            )}
          </BrowserFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 3: Import from Quizlet ------------------------------------

export const QNAImportScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });

  const clickFrame = 0.7 * fps;
  const clickPulse = interpolate(
    frame, [clickFrame - 4, clickFrame, clickFrame + 12],
    [1, 1.18, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const rampStart = clickFrame + 8;
  const rampEnd   = clickFrame + 2.6 * fps;
  const ramp = interpolate(frame, [rampStart, rampEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const eased = 1 - Math.pow(1 - ramp, 3);
  const counter = Math.round(eased * 184);
  const doneSp = spring({
    frame: frame - rampEnd, fps,
    config: { damping: 18 },
  });

  const pageWidth = vertical ? 920 : 1300;
  const pageHeight = vertical ? 1280 : 760;

  // Cursor: from middle to bookmarks bar pill
  const cursorStartX = vertical ? 460 : 600;
  const cursorStartY = vertical ? 220 : 180;
  const cursorEndX = 280;
  const cursorEndY = 44;
  const cx = interpolate(
    frame, [0, clickFrame],
    [cursorStartX, cursorEndX],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const cy = interpolate(
    frame, [0, clickFrame],
    [cursorStartY, cursorEndY],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <QNAWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40,
      }}>
        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 64 : 50, fontWeight: 800, letterSpacing: -1.8,
          marginBottom: vertical ? 36 : 26, textAlign: "center",
        }}>
          Click on any Quizlet set.
        </div>

        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
          position: "relative",
        }}>
          <BrowserFrame
            url="quizlet.com/501234567/biology-101"
            width={pageWidth} height={pageHeight}
            showBookmark
            bookmarkPulse={clickPulse}
          >
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(180deg, ${QUIZLET_BLUE} 0%, ${QUIZLET_DARK} 100%)`,
              padding: vertical ? 36 : 50,
              color: "white", fontFamily: FONT_STACK,
            }}>
              <div style={{
                fontSize: vertical ? 32 : 28, fontWeight: 800, letterSpacing: -1,
                marginBottom: 6,
              }}>
                Biology 101
              </div>
              <div style={{
                fontSize: vertical ? 18 : 15, color: "rgba(255,255,255,0.65)",
                fontWeight: 500, marginBottom: vertical ? 24 : 18,
              }}>
                184 terms · created by mr.smith
              </div>
              {[
                ["mitochondria", "powerhouse of the cell"],
                ["nucleus", "control center"],
                ["ribosome", "site of protein synthesis"],
                ["lysosome", "digestion organelle"],
                ["vacuole", "storage compartment"],
              ].map(([a, b], i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 10,
                  padding: vertical ? "14px 22px" : "12px 22px",
                  marginBottom: 10, color: "white",
                  fontSize: vertical ? 22 : 18, fontWeight: 600,
                }}>
                  <span>{a}</span>
                  <span style={{ opacity: 0.75 }}>{b}</span>
                </div>
              ))}

              {/* StudyDeck floating progress badge */}
              {frame >= clickFrame - 2 && (
                <div style={{
                  position: "absolute",
                  top: vertical ? 22 : 18,
                  right: vertical ? 22 : 18,
                  padding: "14px 20px",
                  borderRadius: 12,
                  background: SD_GRADIENT,
                  color: "white",
                  fontFamily: FONT_STACK,
                  fontWeight: 700,
                  fontSize: vertical ? 20 : 16,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                  maxWidth: vertical ? 380 : 340,
                  transform: `scale(${interpolate(frame, [clickFrame - 2, clickFrame], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                }}>
                  {doneSp > 0.4
                    ? `StudyDeck: got ${counter} cards! Opening…`
                    : `StudyDeck: scanning page… ${counter}`}
                </div>
              )}
            </div>

            <Cursor x={cx} y={cy} />
          </BrowserFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 4: All study modes ----------------------------------------

const MODES = [
  { name: "Flashcards.",     sub: "Flip, swipe, master." },
  { name: "Match.",          sub: "Pair terms, beat the clock." },
  { name: "Falling Blocks.", sub: "Type before they hit the floor." },
  { name: "Block Blast.",    sub: "Clear lines, quiz on every blast." },
  { name: "Test.",           sub: "MC, T/F, written — auto-graded." },
];
const SLIDE = 24; // 0.8s per mode @ 30fps
export const QNA_MODES_DURATION = MODES.length * SLIDE + 12;

export const QNAModesScene: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <QNAWallpaper />
    {MODES.map((m, i) => (
      <Sequence
        key={i}
        from={i * SLIDE}
        durationInFrames={SLIDE + 6}
        premountFor={20}
      >
        <ModeSlide mode={m} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const ModeSlide: React.FC<{ mode: { name: string; sub: string } }> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 130 } });
  const exit  = spring({ frame: frame - (SLIDE - 8), fps, config: { damping: 200 } });
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
        background: SD_GRADIENT,
        backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        lineHeight: 1.05, textAlign: "center",
      }}>
        {mode.name}
      </div>
      <div style={{
        marginTop: 22, fontSize: 32, fontWeight: 500,
        color: COLORS.textSecondary, letterSpacing: -0.4, textAlign: "center",
      }}>
        {mode.sub}
      </div>
    </AbsoluteFill>
  );
};

// ----- Scene 5: WITHOUT ADS finale + URL -------------------------------

export const QNAFinaleScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "WITHOUT" scales in
  const word1Sp = spring({ frame, fps, config: { damping: 14, stiffness: 130 } });
  // "ADS." crashes in slightly later
  const word2Sp = spring({ frame: frame - 0.35 * fps, fps, config: { damping: 12, stiffness: 220 } });
  // Strikethrough sweeps across "ADS." after it lands
  const strikeSp = spring({ frame: frame - 1.0 * fps, fps, config: { damping: 200, stiffness: 110 }, durationInFrames: 0.6 * fps });
  // CTA pill
  const ctaSp = spring({ frame: frame - 1.6 * fps, fps, config: { damping: 20 } });
  const urlSp = spring({ frame: frame - 1.9 * fps, fps, config: { damping: 22 } });

  const word2X = interpolate(word2Sp, [0, 1], [vertical ? 180 : 220, 0]);
  const word2Rot = interpolate(word2Sp, [0, 1], [-8, 0]);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <QNAWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40,
      }}>
        <div style={{
          fontSize: vertical ? 130 : 110, fontWeight: 800, letterSpacing: -3,
          opacity: word1Sp,
          transform: `translateY(${interpolate(word1Sp, [0, 1], [40, 0])}px)`,
          textAlign: "center", lineHeight: 1,
        }}>
          Without
        </div>
        <div style={{
          position: "relative",
          marginTop: vertical ? 12 : 6,
          fontSize: vertical ? 220 : 180, fontWeight: 800, letterSpacing: -6,
          opacity: word2Sp,
          transform: `translateX(${word2X}px) rotate(${word2Rot}deg)`,
          background: SD_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          textAlign: "center", lineHeight: 1,
          paddingLeft: vertical ? 40 : 60,
          paddingRight: vertical ? 40 : 60,
        }}>
          ADS.
          {/* Diagonal strike that sweeps across */}
          <div style={{
            position: "absolute",
            left: vertical ? 20 : 30,
            right: vertical ? 20 : 30,
            top: "55%",
            height: vertical ? 14 : 12,
            background: SD_PINK,
            transform: `scaleX(${strikeSp}) rotate(-6deg)`,
            transformOrigin: "left center",
            borderRadius: 6,
            boxShadow: "0 6px 20px rgba(255,107,107,0.55)",
          }} />
        </div>
        <div style={{
          marginTop: vertical ? 60 : 44,
          padding: vertical ? "18px 40px" : "16px 32px",
          borderRadius: 999,
          background: SD_GRADIENT,
          boxShadow: `0 12px 48px rgba(193, 71, 255, 0.45)`,
          opacity: ctaSp,
          transform: `translateY(${interpolate(ctaSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 32 : 26,
          fontWeight: 700, letterSpacing: -0.5,
        }}>
          studydeck.pages.dev
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
          ★ github.com/bendawg2010/StudyDeck · free forever
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
