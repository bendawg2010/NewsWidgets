import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";

// ----- Brand tokens -----------------------------------------------------

const DG_ORANGE = "#FFB454";
const DG_PINK   = "#FF6B6B";
const DG_PURPLE = "#C147FF";
const DG_GREEN  = "#34C759";
const QUIZLET_BLUE  = "#4257B2";
const QUIZLET_DARK  = "#2C3899";
const DG_GRADIENT = `linear-gradient(135deg, ${DG_ORANGE} 0%, ${DG_PINK} 50%, ${DG_PURPLE} 100%)`;

// ----- Wallpaper --------------------------------------------------------

const DGWallpaper: React.FC = () => (
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

// ----- Browser frame ---------------------------------------------------

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
          background: DG_GRADIENT,
          fontSize: 11, fontWeight: 700, color: "white",
          letterSpacing: -0.2, whiteSpace: "nowrap",
          transform: `scale(${bookmarkPulse})`,
          boxShadow: bookmarkPulse > 1.05
            ? "0 0 0 4px rgba(193, 71, 255, 0.35), 0 0 24px rgba(255, 107, 107, 0.45)"
            : "none",
        }}>
          ⭐ Grab cards
        </div>
      )}
    </div>
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
    <path d="M2 2 L20 12 L12 13 L9 22 Z" fill="white" stroke="#000" strokeWidth="1.5" />
  </svg>
);

// ----- Reusable: realistic Quizlet set page mock ----------------------

const QUIZLET_BRAND = "#4255FF";
const QUIZLET_INK   = "#1F2127";
const QUIZLET_INK_2 = "#586380";
const QUIZLET_BG    = "#F6F7FB";

const QuizletPage: React.FC<{ vertical?: boolean; bookmarkChildren?: React.ReactNode }> = ({ vertical = false }) => (
  <div style={{
    position: "absolute", inset: 0,
    background: QUIZLET_BG,
    color: QUIZLET_INK,
    fontFamily: FONT_STACK,
    overflow: "hidden",
  }}>
    {/* Top white nav bar */}
    <div style={{
      height: vertical ? 56 : 60,
      background: "white",
      borderBottom: "1px solid #E4E7EF",
      display: "flex", alignItems: "center",
      padding: vertical ? "0 22px" : "0 32px",
      gap: 22,
    }}>
      {/* Quizlet wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 7,
          background: QUIZLET_BRAND,
          display: "grid", placeItems: "center",
          color: "white", fontWeight: 900, fontSize: 18, fontStyle: "italic",
        }}>Q</div>
        <div style={{
          fontSize: vertical ? 22 : 24, fontWeight: 900, color: QUIZLET_BRAND,
          letterSpacing: -0.5,
        }}>Quizlet</div>
      </div>
      <div style={{
        flex: 1,
        height: 36,
        background: "#EEF0F6",
        borderRadius: 999,
        display: "flex", alignItems: "center",
        padding: "0 16px",
        fontSize: 13, color: "#9097AC", fontWeight: 500,
      }}>
        <span style={{ marginRight: 8, fontSize: 14 }}>🔍</span>
        Search for terms or sets
      </div>
      <div style={{
        padding: "8px 18px",
        background: QUIZLET_BRAND,
        borderRadius: 999,
        color: "white", fontWeight: 700, fontSize: 13,
      }}>
        Sign up
      </div>
    </div>

    {/* Set page content */}
    <div style={{
      padding: vertical ? "26px 28px 0" : "32px 60px 0",
    }}>
      {/* Set title */}
      <div style={{
        fontSize: vertical ? 38 : 36, fontWeight: 900,
        letterSpacing: -1, marginBottom: 6,
      }}>
        Biology 101 — Cell Organelles
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: vertical ? 22 : 26,
        fontSize: vertical ? 15 : 14,
        color: QUIZLET_INK_2, fontWeight: 600,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14,
          background: "linear-gradient(135deg, #FFB454, #FF6B6B)",
          display: "grid", placeItems: "center",
          color: "white", fontWeight: 900, fontSize: 12,
        }}>MS</div>
        <span>mr_smith</span>
        <span>·</span>
        <span>184 terms</span>
        <span>·</span>
        <span>14,329 students</span>
      </div>

      {/* Action buttons row */}
      <div style={{
        display: "flex", gap: 10, marginBottom: vertical ? 22 : 24,
      }}>
        {["▶ Flashcards", "🎮 Match", "📝 Test", "✏ Edit"].map((label) => (
          <div key={label} style={{
            padding: vertical ? "10px 16px" : "10px 18px",
            background: "white",
            border: "1px solid #E4E7EF",
            borderRadius: 10,
            fontSize: vertical ? 13 : 13,
            fontWeight: 700, color: QUIZLET_INK,
          }}>
            {label}
          </div>
        ))}
      </div>

      {/* "Terms in this set (184)" */}
      <div style={{
        fontSize: vertical ? 18 : 17, fontWeight: 800,
        marginBottom: 12, color: QUIZLET_INK,
      }}>
        Terms in this set (184)
      </div>

      {/* Term cards */}
      {[
        ["mitochondria", "Powerhouse of the cell — produces ATP via cellular respiration."],
        ["nucleus", "Control center; contains DNA and directs all cell activity."],
        ["ribosome", "Site of protein synthesis from mRNA templates."],
        ["lysosome", "Membrane-bound organelle containing digestive enzymes."],
        ["vacuole", "Storage sac for water, nutrients, and waste."],
        ["endoplasmic reticulum", "Network of membranes for protein and lipid synthesis."],
      ].map(([term, def], i) => (
        <div key={i} style={{
          background: "white",
          border: "1px solid #E4E7EF",
          borderRadius: 8,
          padding: vertical ? "16px 20px" : "18px 24px",
          marginBottom: 8,
          display: "grid",
          gridTemplateColumns: vertical ? "1fr 1.7fr" : "1fr 2fr",
          gap: vertical ? 16 : 28,
          alignItems: "center",
          boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
        }}>
          <div style={{
            fontSize: vertical ? 17 : 17, fontWeight: 800,
            letterSpacing: -0.3, color: QUIZLET_INK,
          }}>
            {term}
          </div>
          <div style={{
            fontSize: vertical ? 15 : 15, fontWeight: 500,
            color: QUIZLET_INK_2, lineHeight: 1.4,
          }}>
            {def}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ----- Scene 1: Unskippable 15s video ad ------------------------------

export const DGAdsScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSp = spring({ frame, fps, config: { damping: 18 } });

  // Ad slides up at 0.6s
  const adStart = 0.6 * fps;
  const adSp = spring({ frame: frame - adStart, fps, config: { damping: 14, stiffness: 130 } });

  // Countdown timer: starts at 15, decrements over the remaining time
  // (sped-up — we show 15→11 in ~2s for the punchline)
  const timerStart = adStart + 12; // small delay after ad lands
  const tProgress = interpolate(frame, [timerStart, timerStart + 1.8 * fps], [0, 4], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const remaining = Math.max(11, Math.ceil(15 - tProgress));

  // Cursor frantically tries to click "Skip" — wiggles around the skip button
  const wiggle = Math.sin(frame / 3.5) * 10;
  const cursorX = vertical
    ? 740 + Math.sin(frame / 9) * 180 + wiggle
    : 1320 + Math.sin(frame / 9) * 220 + wiggle;
  const cursorY = vertical
    ? 1010 + Math.cos(frame / 7) * 60 + wiggle
    : 540 + Math.cos(frame / 7) * 50 + wiggle;

  // The garish ad content shimmers
  const flash = (Math.sin(frame / 4) + 1) / 2; // 0..1

  const pageWidth = vertical ? 920 : 1300;
  const pageHeight = vertical ? 1280 : 760;

  // Video ad sits in the middle of the browser content area (under bookmarks bar)
  const adWidth = pageWidth - 80;
  const adHeight = vertical ? 760 : 540;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DGWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40,
      }}>
        <div style={{
          opacity: headerSp,
          transform: `translateY(${interpolate(headerSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 78 : 58, fontWeight: 800, letterSpacing: -2,
          marginBottom: vertical ? 30 : 22,
          textAlign: "center",
        }}>
          Sick of <span style={{ color: QUIZLET_BRAND }}>Quizlet?</span>
        </div>

        <BrowserFrame
          url="quizlet.com/501234567/biology-101"
          width={pageWidth} height={pageHeight}
        >
          <QuizletPage vertical={vertical} />

          {/* Dark overlay sliding up from the bottom of the page area */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.78)",
            opacity: adSp,
            backdropFilter: "blur(2px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* The video ad player */}
            <div style={{
              width: adWidth, height: adHeight,
              borderRadius: 12,
              background: "#000",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
              transform: `translateY(${interpolate(adSp, [0, 1], [80, 0])}px) scale(${interpolate(adSp, [0, 1], [0.92, 1])})`,
              opacity: adSp,
              position: "relative",
              overflow: "hidden",
              fontFamily: FONT_STACK,
              border: "1px solid #333",
            }}>
              {/* Starbucks-style ad content */}
              <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(60% 80% at 50% 30%, #00754A 0%, #006241 55%, #00382D 100%)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: vertical ? 22 : 16, padding: 28,
                fontFamily: '"Helvetica Neue", system-ui, sans-serif',
              }}>
                {/* Subtle ambient steam glow */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: `radial-gradient(40% 30% at 50% 22%, rgba(255,255,255,${0.10 + flash * 0.08}), transparent 70%)`,
                  pointerEvents: "none",
                }} />

                {/* Starbucks "wordmark" — green circle with star + STARBUCKS */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  marginBottom: 4,
                }}>
                  <div style={{
                    width: vertical ? 60 : 52, height: vertical ? 60 : 52,
                    borderRadius: "50%",
                    background: "#FFFFFF",
                    border: `${vertical ? 5 : 4}px solid #006241`,
                    display: "grid", placeItems: "center",
                    fontSize: vertical ? 28 : 24,
                    color: "#006241",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                  }}>★</div>
                  <div style={{
                    fontFamily: '"Helvetica Neue", system-ui',
                    fontSize: vertical ? 24 : 20, fontWeight: 700,
                    color: "white", letterSpacing: 4,
                  }}>
                    STARBUCKS<sup style={{ fontSize: "50%", opacity: 0.7, marginLeft: 2 }}>®</sup>
                  </div>
                </div>

                {/* Coffee cup emoji with steam wiggle */}
                <div style={{
                  fontSize: vertical ? 130 : 100,
                  transform: `translateY(${Math.sin(frame / 8) * 4}px) rotate(${Math.sin(frame / 10) * 3}deg)`,
                  filter: "drop-shadow(0 16px 36px rgba(0,0,0,0.55))",
                  lineHeight: 1,
                }}>
                  ☕
                </div>

                {/* Headline */}
                <div style={{
                  fontSize: vertical ? 78 : 68,
                  color: "white", textAlign: "center", lineHeight: 0.95,
                  letterSpacing: -2, padding: "0 20px",
                  fontWeight: 800,
                  fontStyle: "italic",
                  textShadow: "0 4px 24px rgba(0,0,0,0.45)",
                }}>
                  Pumpkin Spice
                </div>
                <div style={{
                  fontSize: vertical ? 36 : 30,
                  color: "#F1AA00",
                  fontWeight: 800,
                  letterSpacing: 1,
                  fontStyle: "italic",
                  marginTop: -8,
                  textShadow: "0 2px 8px rgba(0,0,0,0.45)",
                }}>
                  is back.
                </div>

                {/* Order CTA */}
                <div style={{
                  marginTop: 6,
                  padding: vertical ? "14px 32px" : "12px 26px",
                  background: "white", color: "#006241",
                  fontWeight: 900, fontSize: vertical ? 22 : 18,
                  borderRadius: 999,
                  boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
                  letterSpacing: 0.5,
                  transform: `scale(${1 + flash * 0.04})`,
                }}>
                  Order on the app →
                </div>

                {/* Disclaimer */}
                <div style={{
                  fontSize: vertical ? 13 : 11,
                  fontWeight: 500, opacity: 0.78,
                  textAlign: "center", color: "white",
                }}>
                  Available at participating stores. Earn Stars with every order.
                </div>
              </div>

              {/* "Sponsored" badge top-left */}
              <div style={{
                position: "absolute", top: 12, left: 12,
                padding: "5px 10px",
                background: "rgba(0,0,0,0.65)",
                borderRadius: 4,
                fontSize: 11, fontWeight: 700, color: "white",
                letterSpacing: 0.5,
              }}>
                SPONSORED · AD
              </div>

              {/* "Skip ad in 15..." countdown top-right */}
              <div style={{
                position: "absolute", top: 12, right: 12,
                padding: "8px 14px",
                background: "rgba(0,0,0,0.78)",
                borderRadius: 6,
                fontSize: vertical ? 15 : 14,
                fontWeight: 700, color: "rgba(255,255,255,0.85)",
                letterSpacing: 0.3,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ opacity: 0.7 }}>Skip ad in</span>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  minWidth: 28, height: 28, borderRadius: 14,
                  background: "white", color: "#000",
                  fontWeight: 900, fontSize: vertical ? 16 : 15,
                }}>
                  {remaining}
                </span>
              </div>

              {/* Bottom progress bar */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: 4,
                background: "rgba(0,0,0,0.4)",
              }}>
                <div style={{
                  height: "100%",
                  width: `${interpolate(remaining, [11, 15], [28, 0])}%`,
                  background: "#FF0000",
                }} />
              </div>

              {/* Cursor frantically trying to skip */}
              <Cursor x={cursorX - (pageWidth - adWidth) / 2 - 40}
                      y={cursorY - (vertical ? 220 : 100)} />
            </div>
          </div>
        </BrowserFrame>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 2: Drop bookmarklet ---------------------------------------

export const DGDropScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
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
      <DGWallpaper />
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
          1. Drop the bookmark.
        </div>

        <div style={{
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
          position: "relative",
        }}>
          <BrowserFrame
            url="deckgrab.pages.dev"
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
              gap: vertical ? 28 : 22,
              fontFamily: FONT_STACK, color: "white",
            }}>
              <div style={{
                fontSize: vertical ? 36 : 32, fontWeight: 800, marginTop: 8,
                letterSpacing: -1,
                background: DG_GRADIENT,
                backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
              }}>
                DeckGrab
              </div>
              <div style={{
                fontSize: vertical ? 22 : 18, color: "rgba(255,255,255,0.85)",
                fontWeight: 600, textAlign: "center", maxWidth: 600, letterSpacing: -0.3,
              }}>
                Yank any Quizlet set into plain text.
              </div>
              <div style={{
                marginTop: vertical ? 24 : 16,
                padding: vertical ? "26px 56px" : "22px 44px",
                borderRadius: 16,
                background: DG_GRADIENT,
                fontSize: vertical ? 38 : 30,
                fontWeight: 800, color: "white", letterSpacing: -0.5,
                boxShadow: "0 16px 48px rgba(193, 71, 255, 0.45)",
                opacity: dragP < 0.05 ? 1 : 0.35,
                transform: dragP < 0.05 ? "scale(1)" : "scale(0.96)",
              }}>
                ⭐ Grab cards
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
                background: DG_GRADIENT,
                fontSize: vertical ? 18 : 14,
                fontWeight: 800, color: "white",
                opacity: 0.92,
                boxShadow: "0 12px 28px rgba(0,0,0,0.55)",
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}>
                ⭐ Grab cards
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

// ----- Scene 3: Click on Quizlet ---------------------------------------

export const DGImportScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
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
  const rampEnd   = clickFrame + 2.4 * fps;
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
      <DGWallpaper />
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
          2. Click on any set.
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
            <QuizletPage vertical={vertical} />

            {/* StudyDeck/DeckGrab floating progress badge */}
            {frame >= clickFrame - 2 && (
              <div style={{
                position: "absolute",
                top: vertical ? 22 : 18,
                right: vertical ? 22 : 18,
                padding: "14px 20px",
                borderRadius: 12,
                background: DG_GRADIENT,
                color: "white",
                fontFamily: FONT_STACK,
                fontWeight: 700,
                fontSize: vertical ? 20 : 16,
                boxShadow: "0 12px 32px rgba(0,0,0,0.45)",
                maxWidth: vertical ? 380 : 340,
                transform: `scale(${interpolate(frame, [clickFrame - 2, clickFrame], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
                zIndex: 10,
              }}>
                {doneSp > 0.4
                  ? `DeckGrab: got ${counter} cards! Opening…`
                  : `DeckGrab: scanning page… ${counter}`}
              </div>
            )}

            <Cursor x={cx} y={cy} />
          </BrowserFrame>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 4: Export options ----------------------------------------

const EXPORT_OPTIONS = [
  { label: "TSV",   sub: "Spreadsheets, Quizlet re-import" },
  { label: "CSV",   sub: "Universal flashcard format" },
  { label: "JSON",  sub: "For developers" },
  { label: "Anki",  sub: "Drop into your Anki deck" },
  { label: "StudyDeck", sub: "Free Quizlet alternative" },
];

export const DGExportScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSp = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DGWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40,
      }}>
        <div style={{
          opacity: headerSp,
          transform: `translateY(${interpolate(headerSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 64 : 50, fontWeight: 800, letterSpacing: -1.8,
          marginBottom: vertical ? 14 : 12, textAlign: "center",
        }}>
          3. Take it <span style={{
            background: DG_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>anywhere.</span>
        </div>
        <div style={{
          opacity: headerSp,
          fontSize: vertical ? 24 : 20,
          color: COLORS.textSecondary, fontWeight: 500, letterSpacing: -0.3,
          marginBottom: vertical ? 36 : 28, textAlign: "center",
        }}>
          Your cards. Your call.
        </div>

        <div style={{
          width: vertical ? 880 : 1100,
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 24,
          padding: vertical ? 28 : 36,
          backdropFilter: "blur(40px) saturate(180%)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
          opacity: headerSp,
          transform: `translateY(${interpolate(headerSp, [0, 1], [40, 0])}px)`,
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: vertical ? 22 : 18,
          }}>
            <div style={{
              fontSize: vertical ? 26 : 22, fontWeight: 800, letterSpacing: -0.5,
            }}>
              Your cards are yoinked.
            </div>
            <div style={{
              padding: "6px 14px", borderRadius: 999,
              background: "rgba(52, 199, 89, 0.18)",
              border: "1px solid rgba(52, 199, 89, 0.35)",
              fontSize: vertical ? 16 : 14, fontWeight: 700, color: DG_GREEN,
            }}>
              184 cards
            </div>
          </div>

          {/* Export buttons grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: vertical ? "1fr 1fr" : "repeat(5, 1fr)",
            gap: vertical ? 14 : 12,
          }}>
            {EXPORT_OPTIONS.map((opt, i) => {
              const sp = spring({
                frame: frame - (0.5 + i * 0.10) * fps, fps,
                config: { damping: 16, stiffness: 120 },
              });
              const isPrimary = i === 0;
              return (
                <div key={opt.label} style={{
                  opacity: sp,
                  transform: `translateY(${interpolate(sp, [0, 1], [16, 0])}px) scale(${interpolate(sp, [0, 1], [0.94, 1])})`,
                  background: isPrimary ? DG_GRADIENT : "rgba(255,255,255,0.04)",
                  border: isPrimary ? "none" : "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 14,
                  padding: vertical ? "18px 20px" : "20px 22px",
                  textAlign: "center",
                  boxShadow: isPrimary ? "0 12px 32px rgba(193, 71, 255, 0.35)" : "none",
                }}>
                  <div style={{
                    fontSize: vertical ? 22 : 22, fontWeight: 800, letterSpacing: -0.4,
                    marginBottom: 4,
                  }}>
                    {opt.label}
                  </div>
                  <div style={{
                    fontSize: vertical ? 13 : 12,
                    color: isPrimary ? "rgba(255,255,255,0.85)" : COLORS.textSecondary,
                    fontWeight: 600, letterSpacing: -0.1,
                  }}>
                    {opt.sub}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 5: Outro ---------------------------------------------------

export const DGOutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const word1Sp = spring({ frame, fps, config: { damping: 14, stiffness: 130 } });
  const word2Sp = spring({ frame: frame - 0.35 * fps, fps, config: { damping: 12, stiffness: 220 } });
  const ctaSp = spring({ frame: frame - 1.0 * fps, fps, config: { damping: 20 } });
  const urlSp = spring({ frame: frame - 1.3 * fps, fps, config: { damping: 22 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DGWallpaper />
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
          DeckGrab.
        </div>
        <div style={{
          marginTop: vertical ? 12 : 6,
          fontSize: vertical ? 200 : 160, fontWeight: 800, letterSpacing: -5,
          opacity: word2Sp,
          transform: `translateY(${interpolate(word2Sp, [0, 1], [40, 0])}px)`,
          background: DG_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          textAlign: "center", lineHeight: 1,
        }}>
          Free.
        </div>
        <div style={{
          marginTop: vertical ? 60 : 44,
          padding: vertical ? "18px 40px" : "16px 32px",
          borderRadius: 999,
          background: DG_GRADIENT,
          boxShadow: `0 12px 48px rgba(193, 71, 255, 0.45)`,
          opacity: ctaSp,
          transform: `translateY(${interpolate(ctaSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 32 : 26,
          fontWeight: 700, letterSpacing: -0.5,
        }}>
          deckgrab.pages.dev
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
          ★ github.com/bendawg2010/DeckGrab · open source
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
