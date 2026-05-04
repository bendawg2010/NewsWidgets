import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";

// Brand
const SD_ORANGE = "#FFB454";
const SD_PINK   = "#FF6B6B";
const SD_PURPLE = "#C147FF";
const SD_GREEN  = "#34C759";
const SD_GRADIENT = `linear-gradient(135deg, ${SD_ORANGE} 0%, ${SD_PINK} 50%, ${SD_PURPLE} 100%)`;

// Wallpaper

const SDWallpaper: React.FC = () => (
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

// Hook

export const SDHookScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const t2 = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const fontSize = vertical ? 180 : 130;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SDWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          opacity: t1, fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
        }}>
          Quizlet,
        </div>
        <div style={{
          marginTop: vertical ? 24 : 18,
          transform: `translateY(${interpolate(t2, [0, 1], [30, 0])}px)`,
          opacity: t2, fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
          background: SD_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          but free.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Reveal — animated flashcard flip showing a card from a starter deck

export const SDRevealScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame, fps, config: { damping: 14, stiffness: 90, mass: 1.1 } });
  const y = interpolate(sp, [0, 1], [vertical ? 600 : 0, 0]);
  const scale = interpolate(sp, [0, 1], [0.85, 1]);

  // Flip the card every 1.4s
  const flipPhase = (frame / fps) % 1.4;
  const flipped = flipPhase < 0.7;
  const flipProgress = flipPhase < 0.1
    ? interpolate(flipPhase, [0, 0.1], [0, 180])
    : flipPhase < 0.7
    ? 180
    : flipPhase < 0.8
    ? interpolate(flipPhase, [0.7, 0.8], [180, 360])
    : 360;

  const captionOp = interpolate(frame, [1.4 * fps, 1.8 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const cardWidth = vertical ? 600 : 760;
  const cardHeight = vertical ? 380 : 420;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SDWallpaper />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{
          transform: `translateY(${y}px) scale(${scale})`,
          opacity: sp,
          perspective: 1600,
          fontFamily: FONT_STACK,
        }}>
          <div style={{
            width: cardWidth, height: cardHeight,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateY(${flipProgress}deg)`,
            transition: "none",
          }}>
            {/* Front — term */}
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: 28,
              background: COLORS.bgGlass,
              backdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 60px rgba(0,0,0,0.55)",
              display: "grid", placeItems: "center", padding: 40,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}>
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 800, letterSpacing: 0.8,
                  color: SD_ORANGE, textTransform: "uppercase", marginBottom: 10,
                  textAlign: "center",
                }}>
                  TERM
                </div>
                <div style={{
                  fontSize: vertical ? 64 : 76, fontWeight: 800,
                  letterSpacing: -2, color: "white", textAlign: "center", lineHeight: 1.1,
                }}>
                  Mitochondria
                </div>
              </div>
            </div>
            {/* Back — definition */}
            <div style={{
              position: "absolute", inset: 0,
              borderRadius: 28,
              background: COLORS.bgGlass,
              backdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(193, 71, 255, 0.30)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 60px rgba(193,71,255,0.20)",
              display: "grid", placeItems: "center", padding: 40,
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}>
              <div>
                <div style={{
                  fontSize: 13, fontWeight: 800, letterSpacing: 0.8,
                  color: SD_PURPLE, textTransform: "uppercase", marginBottom: 10,
                  textAlign: "center",
                }}>
                  DEFINITION
                </div>
                <div style={{
                  fontSize: vertical ? 32 : 36, fontWeight: 600,
                  color: "white", textAlign: "center", lineHeight: 1.35,
                  letterSpacing: -0.3,
                }}>
                  Powerhouse of the cell — produces ATP via cellular respiration.
                </div>
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <div style={{
        position: "absolute",
        [vertical ? "top" : "bottom"]: vertical ? 100 : 90,
        left: 0, right: 0, textAlign: "center",
        fontFamily: FONT_STACK, color: "white", opacity: captionOp,
      }}>
        <div style={{ fontSize: vertical ? 60 : 48, fontWeight: 700, letterSpacing: -1.5 }}>
          Flashcards. Faster. Free.
        </div>
        <div style={{
          marginTop: 6, fontSize: vertical ? 28 : 22,
          color: COLORS.textSecondary, fontWeight: 500,
        }}>
          Five game modes. Zero accounts. Zero ads.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Mode showcase — 5 quick gradient slides

const MODES = [
  { big: "Match.",         sub: "Pair terms with definitions, beat the clock." },
  { big: "Falling Blocks.",sub: "Type the term before the definition hits the floor." },
  { big: "Block Blast.",   sub: "Drag pieces, clear lines, quiz on every blast." },
  { big: "Test.",          sub: "Multiple choice + true/false + written, all auto-graded." },
];
const SLIDE = 60;
export const SD_MODES_TOTAL = MODES.length * SLIDE;

export const SDModesScene: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <SDWallpaper />
    {MODES.map((m, i) => (
      <Sequence key={i} from={i * SLIDE} durationInFrames={SLIDE + 6} premountFor={30}>
        <ModeSlide mode={m} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const ModeSlide: React.FC<{ mode: { big: string; sub: string } }> = ({ mode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const exit  = spring({ frame: frame - (SLIDE - 12), fps, config: { damping: 200 } });
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
        {mode.big}
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

// Quizlet-import callout

export const SDImportScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleSp = spring({ frame, fps, config: { damping: 18 } });
  const arrowSp = spring({ frame: frame - 0.5 * fps, fps, config: { damping: 22 } });
  const labelSp = spring({ frame: frame - 0.9 * fps, fps, config: { damping: 22 } });
  const subSp = spring({ frame: frame - 1.3 * fps, fps, config: { damping: 22 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SDWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 30,
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          opacity: titleSp,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          fontSize: vertical ? 70 : 56, fontWeight: 800, letterSpacing: -2,
          textAlign: "center", lineHeight: 1.05,
        }}>
          Have a Quizlet set?
        </div>

        <div style={{
          display: "flex", flexDirection: "row",
          alignItems: "center", gap: vertical ? 28 : 60,
          flexWrap: vertical ? "wrap" : "nowrap",
          justifyContent: "center",
        }}>
          {/* Quizlet pill */}
          <div style={{
            opacity: titleSp,
            transform: `translateX(${interpolate(titleSp, [0, 1], [-30, 0])}px)`,
            padding: "20px 40px",
            borderRadius: 16,
            background: "linear-gradient(135deg, #4257B2, #2C3899)",
            fontSize: vertical ? 36 : 30,
            fontWeight: 800,
            color: "white",
            boxShadow: "0 12px 32px rgba(66, 87, 178, 0.45)",
          }}>
            quizlet.com/set
          </div>

          {/* Arrow */}
          <div style={{
            opacity: arrowSp,
            transform: `scale(${arrowSp})`,
            fontSize: vertical ? 60 : 48, fontWeight: 800,
            color: "white",
          }}>
            →
          </div>

          {/* StudyDeck button */}
          <div style={{
            opacity: labelSp,
            transform: `translateX(${interpolate(labelSp, [0, 1], [30, 0])}px)`,
            padding: "20px 40px",
            borderRadius: 999,
            background: SD_GRADIENT,
            fontSize: vertical ? 36 : 30,
            fontWeight: 800,
            color: "white",
            boxShadow: "0 12px 32px rgba(193, 71, 255, 0.45)",
          }}>
            ⭐ Send to StudyDeck
          </div>
        </div>

        <div style={{
          opacity: subSp,
          transform: `translateY(${interpolate(subSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 30 : 24,
          fontWeight: 500, color: COLORS.textSecondary,
          textAlign: "center", marginTop: 8, maxWidth: 800,
        }}>
          One drag to your bookmarks bar. One click on any Quizlet page. Cards land in StudyDeck.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Outro

export const SDOutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconSp = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
  const titleSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const ctaSp = spring({ frame: frame - 0.8 * fps, fps, config: { damping: 22 } });
  const urlSp = spring({ frame: frame - 1.1 * fps, fps, config: { damping: 22 } });

  const iconSize = vertical ? 220 : 160;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SDWallpaper />
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
          {/* Stacked cards icon */}
          <svg width={iconSize * 0.6} height={iconSize * 0.6} viewBox="0 0 60 60" fill="white">
            <rect x="10" y="14" width="34" height="40" rx="5" opacity="0.45" />
            <rect x="14" y="10" width="34" height="40" rx="5" opacity="0.7" />
            <rect x="18" y="6" width="34" height="40" rx="5" />
            <text x="35" y="32" fontSize="20" fontWeight="800" textAnchor="middle" fill="#FF6B6B">A</text>
          </svg>
        </div>
        <div style={{
          marginTop: vertical ? 48 : 36,
          fontSize: vertical ? 100 : 84, fontWeight: 800, letterSpacing: -2.5,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          opacity: titleSp, textAlign: "center",
        }}>
          StudyDeck
        </div>
        <div style={{
          marginTop: 12, fontSize: vertical ? 32 : 24,
          fontWeight: 500, color: COLORS.textSecondary,
          opacity: ctaSp, textAlign: "center",
        }}>
          Free forever. Open source. No accounts.
        </div>
        <div style={{
          marginTop: vertical ? 60 : 40,
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

export { SD_GRADIENT, SD_ORANGE, SD_PINK, SD_PURPLE };
