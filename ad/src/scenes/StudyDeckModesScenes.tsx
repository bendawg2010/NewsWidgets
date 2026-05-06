import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";

// ----- Brand tokens ----------------------------------------------------

const SD_ORANGE = "#FFB454";
const SD_PINK   = "#FF6B6B";
const SD_PURPLE = "#C147FF";
const SD_GREEN  = "#34C759";
const SD_RED    = "#FF6B6B";
const SD_GRADIENT = `linear-gradient(135deg, ${SD_ORANGE} 0%, ${SD_PINK} 50%, ${SD_PURPLE} 100%)`;

// ----- Wallpaper -------------------------------------------------------

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

// ----- Reusable mode scene chrome --------------------------------------

const ModeShell: React.FC<{
  vertical: boolean;
  number: string;
  name: string;
  tagline: string;
  accent: string;
  children: React.ReactNode;
}> = ({ vertical, number, name, tagline, accent, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headSp = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SDWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 50,
      }}>
        <div style={{
          opacity: headSp,
          transform: `translateY(${interpolate(headSp, [0, 1], [-12, 0])}px)`,
          display: "flex", alignItems: "center", gap: 18,
          marginBottom: vertical ? 28 : 22,
        }}>
          <div style={{
            width: vertical ? 56 : 48, height: vertical ? 56 : 48,
            borderRadius: 14,
            background: accent + "26",
            border: `1px solid ${accent}66`,
            color: accent,
            display: "grid", placeItems: "center",
            fontSize: vertical ? 22 : 20, fontWeight: 900,
            letterSpacing: -0.5,
          }}>{number}</div>
          <div>
            <div style={{
              fontSize: vertical ? 56 : 48, fontWeight: 800, letterSpacing: -1.4,
              lineHeight: 1,
            }}>{name}</div>
            <div style={{
              marginTop: 4,
              fontSize: vertical ? 22 : 18, color: "rgba(255,255,255,0.65)",
              fontWeight: 600, letterSpacing: -0.2,
            }}>{tagline}</div>
          </div>
        </div>
        <div style={{
          opacity: headSp,
          transform: `translateY(${interpolate(headSp, [0, 1], [40, 0])}px) scale(${interpolate(headSp, [0, 1], [0.95, 1])})`,
        }}>
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Hook ------------------------------------------------------------

export const SDMHookScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t1 = spring({ frame, fps, config: { damping: 16 } });
  const t2 = spring({ frame: frame - 0.5 * fps, fps, config: { damping: 16 } });
  const fontSize = vertical ? 130 : 110;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SDWallpaper />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          opacity: t1,
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
        }}>
          Six ways
        </div>
        <div style={{
          marginTop: vertical ? 14 : 10,
          opacity: t2,
          transform: `translateY(${interpolate(t2, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -3,
          lineHeight: 1, textAlign: "center",
          background: SD_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          to study.
        </div>
        <div style={{
          marginTop: vertical ? 32 : 22,
          opacity: spring({ frame: frame - 1.0 * fps, fps, config: { damping: 22 } }),
          fontSize: vertical ? 28 : 22, fontWeight: 600,
          color: "rgba(255,255,255,0.78)", letterSpacing: -0.3,
        }}>
          One free app. Zero ads. Zero accounts.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- 1 · Flashcards --------------------------------------------------

export const SDMFlashcardsScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Flip at 1.0s, judge as 'I know it' (right fly-off) at 2.6s
  const flipStart = 1.0 * fps;
  const judgeStart = 2.6 * fps;
  const flipped = frame >= flipStart;
  const flipP = interpolate(frame, [flipStart, flipStart + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flyP = interpolate(frame, [judgeStart, judgeStart + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cardW = vertical ? 540 : 540;
  const cardH = vertical ? 340 : 340;
  return (
    <ModeShell vertical={vertical} number="1" name="Flashcards." tagline="Flip · ↑↓ · judge ←→" accent={SD_ORANGE}>
      <div style={{
        width: cardW + 280, height: cardH + 80,
        position: "relative",
        perspective: 2000,
      }}>
        {/* Flying-off ghost (after judge) */}
        {flyP > 0 && (
          <div style={{
            position: "absolute",
            left: cardW * 0.5 + 140 + flyP * 600,
            top: 40 - flyP * 60,
            width: cardW, height: cardH,
            transform: `rotate(${flyP * 18}deg)`,
            opacity: 1 - flyP,
            background: "#15101e",
            border: `1px solid ${SD_GREEN}66`,
            boxShadow: `0 0 60px rgba(52, 199, 89, 0.5)`,
            borderRadius: 22,
            display: "grid", placeItems: "center",
            color: SD_GREEN, fontWeight: 900, fontSize: 80,
          }}>✓</div>
        )}

        {/* Stack: peek-behind + main */}
        <div style={{
          position: "absolute", left: 140, top: 60,
          width: cardW, height: cardH,
          background: "#15101e",
          border: "1px solid rgba(255,255,255,0.10)",
          borderRadius: 22,
          opacity: 0.4,
          transform: "translateY(20px) scale(0.94)",
        }} />
        <div style={{
          position: "absolute", left: 140, top: 30,
          width: cardW, height: cardH,
          background: "#15101e",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: 22,
          opacity: 0.7,
          transform: "translateY(10px) scale(0.97)",
        }} />

        {/* Front-most card (flips) */}
        <div style={{
          position: "absolute", left: 140, top: 0,
          width: cardW, height: cardH,
          opacity: flyP > 0.5 ? 0 : 1,
          transformStyle: "preserve-3d",
          transform: `rotateX(${flipP * 180}deg)`,
          transition: "none",
        }}>
          {/* Front (TERM) */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, #1f1a2e 0%, #15101e 100%)",
            border: "1px solid rgba(255,255,255,0.16)",
            borderRadius: 22,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: 36, textAlign: "center",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 60px rgba(0,0,0,0.55)",
          }}>
            <div style={{
              fontSize: 12, fontWeight: 800, letterSpacing: 1.4,
              color: SD_ORANGE, textTransform: "uppercase", marginBottom: 18,
            }}>TERM</div>
            <div style={{
              fontSize: 54, fontWeight: 800, letterSpacing: -1.2,
            }}>Mitochondria</div>
          </div>
          {/* Back (DEFINITION) */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, #221830 0%, #16101f 100%)",
            border: `1px solid ${SD_PURPLE}50`,
            borderRadius: 22,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: 36, textAlign: "center",
            transform: "rotateX(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 60px rgba(0,0,0,0.55)",
          }}>
            <div style={{
              fontSize: 12, fontWeight: 800, letterSpacing: 1.4,
              color: "#FF9DC3", textTransform: "uppercase", marginBottom: 18,
            }}>DEFINITION</div>
            <div style={{
              fontSize: 28, fontWeight: 600, letterSpacing: -0.4, lineHeight: 1.4,
              color: "rgba(255,255,255,0.95)",
            }}>Powerhouse of the cell — produces ATP via cellular respiration.</div>
          </div>
        </div>

        {/* Action buttons mock */}
        <div style={{
          position: "absolute", bottom: -40, left: 0, right: 0,
          display: "flex", justifyContent: "center", gap: 14,
          fontFamily: FONT_STACK,
        }}>
          <div style={{
            padding: "10px 18px", borderRadius: 14,
            background: `${SD_RED}26`,
            border: `1px solid ${SD_RED}66`,
            color: "#ff8a8a",
            fontSize: 14, fontWeight: 800,
          }}>← Still learning</div>
          <div style={{
            padding: "10px 18px", borderRadius: 999,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.16)",
            color: "white",
            fontSize: 14, fontWeight: 800,
          }}>Flip · ↑↓</div>
          <div style={{
            padding: "10px 18px", borderRadius: 14,
            background: `${SD_GREEN}26`,
            border: `1px solid ${SD_GREEN}66`,
            color: "#5fe085",
            fontSize: 14, fontWeight: 800,
            transform: frame > judgeStart - 6 && frame < judgeStart + 14 ? "scale(1.08)" : "scale(1)",
            boxShadow: frame > judgeStart - 6 && frame < judgeStart + 14
              ? `0 0 24px ${SD_GREEN}88` : "none",
            transition: "none",
          }}>I know it →</div>
        </div>
      </div>
    </ModeShell>
  );
};

// ----- 2 · Spell -------------------------------------------------------

export const SDMSpellScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const target = "mitochondria";
  // Type the term character by character starting at 0.7s
  const typeStart = 0.7 * fps;
  const typeEnd   = 2.8 * fps;
  const charsTyped = Math.max(0, Math.min(target.length,
    Math.floor(((frame - typeStart) / (typeEnd - typeStart)) * target.length)));
  const typed = target.slice(0, charsTyped);

  return (
    <ModeShell vertical={vertical} number="2" name="Spell." tagline="Type the term · 💡 hint · 🤷 give up" accent={SD_PURPLE}>
      <div style={{
        width: vertical ? 720 : 800,
        display: "flex", flexDirection: "column", gap: 18,
      }}>
        {/* Definition */}
        <div style={{
          padding: "32px 40px",
          borderRadius: 22,
          background: "linear-gradient(180deg, #221830 0%, #16101f 100%)",
          border: `1px solid ${SD_PURPLE}50`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 60px rgba(0,0,0,0.45)",
          textAlign: "center",
          fontSize: 26, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.3,
          color: "white",
        }}>Powerhouse of the cell — produces ATP via cellular respiration.</div>

        {/* Input */}
        <div style={{
          padding: "16px 18px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.07)",
          border: `2px solid ${SD_ORANGE}`,
          boxShadow: `0 0 0 4px rgba(255, 180, 84, 0.18)`,
          fontSize: 28, fontWeight: 700,
          letterSpacing: -0.4,
          textAlign: "center",
          color: "white",
          minHeight: 30,
        }}>
          {typed}
          <span style={{
            display: "inline-block",
            width: 2, height: 28,
            background: "white",
            marginLeft: 2,
            verticalAlign: "middle",
            opacity: Math.sin(frame / 6) > 0 ? 1 : 0,
          }} />
        </div>

        {/* Letter strip */}
        <div style={{
          display: "flex", gap: 4, justifyContent: "center",
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 22, fontWeight: 700,
        }}>
          {target.split("").map((ch, i) => {
            const isTyped = i < charsTyped;
            return (
              <span key={i} style={{
                padding: "4px 6px",
                borderRadius: 4,
                color: isTyped ? SD_GREEN : "rgba(255,255,255,0.36)",
                background: isTyped ? "rgba(52, 199, 89, 0.14)" : "transparent",
                minWidth: 14, display: "inline-block", textAlign: "center",
              }}>{isTyped ? ch : "_"}</span>
            );
          })}
        </div>

        {/* Action row */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 10, marginTop: 6,
          fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.78)",
        }}>
          <div style={{
            padding: "8px 14px", borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.16)",
          }}>💡 Hint</div>
          <div style={{
            padding: "8px 14px", borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.16)",
          }}>🤷 Give up</div>
          <div style={{
            padding: "8px 14px", borderRadius: 999,
            background: SD_GRADIENT, color: "white",
            fontWeight: 800,
          }}>Check</div>
        </div>
      </div>
    </ModeShell>
  );
};

// ----- 3 · Match -------------------------------------------------------

const MATCH_TILES = [
  { id: 1, text: "ribosome",      type: "term", pair: 7  },
  { id: 2, text: "mitochondria",  type: "term", pair: 8  },
  { id: 3, text: "control center",type: "def",  pair: 9  },
  { id: 4, text: "powerhouse",    type: "def",  pair: 2  },
  { id: 5, text: "nucleus",       type: "term", pair: 3  },
  { id: 6, text: "vacuole",       type: "term", pair: 11 },
  { id: 7, text: "protein synthesis", type: "def", pair: 1 },
  { id: 8, text: "ATP factory",   type: "def",  pair: 2  },
  { id: 9, text: "DNA hub",       type: "def",  pair: 5  },
  { id: 10, text: "lysosome",     type: "term", pair: 12 },
  { id: 11, text: "storage sac",  type: "def",  pair: 6  },
  { id: 12, text: "digestion",    type: "def",  pair: 10 },
];

export const SDMMatchScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // First match (mitochondria + powerhouse) at 0.8s, removed at 1.4s.
  // Second match (nucleus + DNA hub) at 1.9s, removed at 2.5s.
  // Third match (ribosome + protein synthesis) at 2.9s, removed at 3.5s.
  const t = (s: number) => s * fps;

  const phase = frame;
  const matched1 = phase >= t(1.4);
  const matched2 = phase >= t(2.5);
  const matched3 = phase >= t(3.5);

  const flashStart1 = phase >= t(0.8) && phase < t(1.4);
  const flashStart2 = phase >= t(1.9) && phase < t(2.5);
  const flashStart3 = phase >= t(2.9) && phase < t(3.5);

  const PAIR1 = [2, 4]; // mitochondria + powerhouse
  const PAIR2 = [5, 9]; // nucleus + DNA hub
  const PAIR3 = [1, 7]; // ribosome + protein synthesis

  function tileState(id: number) {
    if ((PAIR1.includes(id) && matched1) ||
        (PAIR2.includes(id) && matched2) ||
        (PAIR3.includes(id) && matched3)) return "gone";
    if ((PAIR1.includes(id) && flashStart1) ||
        (PAIR2.includes(id) && flashStart2) ||
        (PAIR3.includes(id) && flashStart3)) return "flash";
    return "idle";
  }

  return (
    <ModeShell vertical={vertical} number="3" name="Match." tagline="Click pairs · race the clock" accent={SD_GREEN}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        width: vertical ? 740 : 880,
      }}>
        {MATCH_TILES.map((tile) => {
          const state = tileState(tile.id);
          const opacity = state === "gone" ? 0 : 1;
          const transform = state === "gone"
            ? "scale(0.6)"
            : state === "flash"
              ? "scale(1.04)"
              : "scale(1)";
          const bg = state === "flash"
            ? `${SD_GREEN}26`
            : tile.type === "term"
              ? "rgba(255, 180, 84, 0.10)"
              : "rgba(193, 71, 255, 0.10)";
          const border = state === "flash"
            ? `1.5px solid ${SD_GREEN}`
            : tile.type === "term"
              ? `1px solid ${SD_ORANGE}55`
              : `1px solid ${SD_PURPLE}55`;
          return (
            <div key={tile.id} style={{
              padding: "20px 18px",
              borderRadius: 12,
              background: bg,
              border: border,
              fontSize: tile.text.length > 12 ? 14 : 16,
              fontWeight: 700, letterSpacing: -0.2,
              color: "white",
              textAlign: "center",
              minHeight: 62,
              display: "grid", placeItems: "center",
              opacity, transform,
              transition: "none",
              boxShadow: state === "flash" ? `0 0 24px ${SD_GREEN}55` : "none",
            }}>{tile.text}</div>
          );
        })}
      </div>
      {/* Timer mock */}
      <div style={{
        position: "absolute",
        top: -30, right: 40,
        padding: "6px 12px",
        borderRadius: 999,
        background: "rgba(0,0,0,0.4)",
        border: "1px solid rgba(255,255,255,0.16)",
        fontSize: 14, fontWeight: 800,
        color: SD_GREEN, letterSpacing: 0.5,
        fontVariantNumeric: "tabular-nums",
      }}>
        ⏱ 0:0{Math.max(2, 9 - Math.floor(frame / fps))}
      </div>
    </ModeShell>
  );
};

// ----- 4 · Falling Blocks ---------------------------------------------

const FALLING_TERMS = [
  { id: 1, text: "ribosome", color: SD_ORANGE },
  { id: 2, text: "nucleus",  color: SD_PINK   },
  { id: 3, text: "vacuole",  color: SD_PURPLE },
  { id: 4, text: "lysosome", color: SD_ORANGE },
];

export const SDMBlocksScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const containerH = vertical ? 460 : 440;
  const containerW = vertical ? 720 : 880;

  // Each term enters at staggered times and falls
  const enterDelay = 0.4 * fps;
  return (
    <ModeShell vertical={vertical} number="4" name="Falling Blocks." tagline="Type the term before it lands" accent={SD_PINK}>
      <div style={{
        width: containerW,
        height: containerH,
        background: "rgba(0,0,0,0.32)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 22,
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(12px)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
      }}>
        {/* Definition prompt at top */}
        <div style={{
          position: "absolute", top: 18, left: 22, right: 22,
          padding: "12px 18px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.10)",
          fontSize: 16, fontWeight: 700, color: "white",
          letterSpacing: -0.2,
        }}>
          Site of protein synthesis from mRNA templates
        </div>

        {/* Falling terms */}
        {FALLING_TERMS.map((term, i) => {
          const startFrame = enterDelay + i * 0.35 * fps;
          const endFrame   = startFrame + 3.0 * fps;
          // Position: term starts above the box and falls toward the input
          const fallP = interpolate(frame, [startFrame, endFrame], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          });
          // Caught at fallP=0.65 if it's the right answer (term 1 = ribosome)
          const isCorrect = i === 0;
          const caughtAt = 0.65;
          const caught = isCorrect && fallP >= caughtAt;
          if (caught) return null;

          const x = 60 + (i * (containerW - 280) / Math.max(1, FALLING_TERMS.length - 1));
          const y = -50 + (containerH - 60) * fallP;

          return (
            <div key={term.id} style={{
              position: "absolute",
              left: x, top: y,
              padding: "10px 18px",
              borderRadius: 12,
              background: term.color + "26",
              border: `1px solid ${term.color}88`,
              color: term.color,
              fontSize: 17, fontWeight: 800, letterSpacing: -0.3,
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              boxShadow: `0 0 16px ${term.color}33`,
            }}>{term.text}</div>
          );
        })}

        {/* Input at the bottom */}
        <div style={{
          position: "absolute",
          bottom: 18, left: 22, right: 22,
          padding: "12px 16px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.04)",
          border: `2px solid ${SD_PINK}`,
          fontSize: 18, fontWeight: 700,
          letterSpacing: -0.2,
          color: "white",
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        }}>
          {(() => {
            const target = "ribosome";
            const start = 1.0 * fps;
            const finish = 2.4 * fps;
            const n = Math.max(0, Math.min(target.length,
              Math.floor(((frame - start) / (finish - start)) * target.length)));
            return target.slice(0, n);
          })()}
          <span style={{
            display: "inline-block",
            width: 2, height: 18,
            background: "white",
            marginLeft: 2,
            verticalAlign: "middle",
            opacity: Math.sin(frame / 6) > 0 ? 1 : 0,
          }} />
        </div>
      </div>
    </ModeShell>
  );
};

// ----- 5 · Block Blast -------------------------------------------------

export const SDMBlockBlastScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Build an 8x8 grid mockup with some pre-placed pieces, then a piece drops
  // and clears a row — particles burst out.
  const GRID = 8;
  const cellSize = 38;

  // Static placed cells (forming a near-complete row at row 5)
  const filled = new Set<string>();
  // row 5 mostly filled (we'll animate the last cell to drop in)
  for (let c = 0; c < GRID - 1; c++) filled.add(`5,${c}`);
  // Some cells in row 6, 7 for texture
  filled.add("7,0"); filled.add("7,1"); filled.add("7,2");
  filled.add("6,5"); filled.add("6,6");
  filled.add("4,3"); filled.add("3,3"); filled.add("3,4");

  const colorFor = (k: string) => {
    const palette = [SD_ORANGE, SD_PINK, SD_PURPLE, SD_GREEN, "#FFD60A"];
    let h = 0;
    for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) | 0;
    return palette[Math.abs(h) % palette.length];
  };

  // Drop piece animation: piece at (5, 7) appears at top and falls into place
  const dropStart = 0.6 * fps;
  const dropEnd   = 1.4 * fps;
  const dropP = interpolate(frame, [dropStart, dropEnd], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const dropY = interpolate(dropP, [0, 1], [-cellSize * 4, 0]);
  const dropped = dropP >= 1;

  // After dropping, line clears at 1.6s with particles
  const clearStart = 1.7 * fps;
  const clearP = interpolate(frame, [clearStart, clearStart + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const cleared = clearP >= 1;

  const showRow5 = !cleared;

  return (
    <ModeShell vertical={vertical} number="5" name="Block Blast." tagline="Drag pieces · clear lines · quiz" accent="#FFD60A">
      <div style={{
        display: "flex", gap: 32, alignItems: "center",
      }}>
        {/* The grid */}
        <div style={{
          position: "relative",
          width: GRID * cellSize + 20,
          height: GRID * cellSize + 20,
          padding: 10,
          borderRadius: 18,
          background: "rgba(0,0,0,0.45)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 60px rgba(0,0,0,0.45)",
        }}>
          {/* Grid cells */}
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${GRID}, ${cellSize}px)`,
            gap: 2,
          }}>
            {Array.from({ length: GRID * GRID }).map((_, i) => {
              const r = Math.floor(i / GRID);
              const c = i % GRID;
              const k = `${r},${c}`;
              const isFilled = filled.has(k);
              const isLastInRow5 = r === 5 && c === GRID - 1;
              if (r === 5 && cleared) {
                return <div key={i} style={{
                  width: cellSize - 2, height: cellSize - 2,
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.04)",
                }} />;
              }
              const showColor = isFilled && (showRow5 || r !== 5);
              const last = isLastInRow5 && dropped && !cleared;
              return (
                <div key={i} style={{
                  width: cellSize - 2, height: cellSize - 2,
                  borderRadius: 6,
                  background: (showColor || last)
                    ? colorFor(k)
                    : "rgba(255,255,255,0.04)",
                  boxShadow: (showColor || last)
                    ? "inset 0 1px 0 rgba(255,255,255,0.20)"
                    : "none",
                }} />
              );
            })}
          </div>

          {/* The dropping piece (single cell that falls into row 5, col 7) */}
          {!dropped && (
            <div style={{
              position: "absolute",
              left: 10 + (GRID - 1) * cellSize,
              top: 10 + 5 * cellSize + dropY,
              width: cellSize - 2, height: cellSize - 2,
              borderRadius: 6,
              background: SD_GREEN,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.20), 0 0 24px ${SD_GREEN}88`,
            }} />
          )}

          {/* Clear flash */}
          {cleared && clearP < 1.0 && (
            <div style={{
              position: "absolute",
              left: 10, right: 10,
              top: 10 + 5 * cellSize, height: cellSize,
              background: "white",
              borderRadius: 4,
              opacity: 1 - clearP,
            }} />
          )}

          {/* Particles burst */}
          {clearP > 0 && clearP < 1 && Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const dx = Math.cos(angle) * 80 * clearP;
            const dy = Math.sin(angle) * 80 * clearP;
            const palette = [SD_ORANGE, SD_PINK, SD_PURPLE, SD_GREEN, "#FFD60A"];
            return (
              <div key={i} style={{
                position: "absolute",
                left: GRID * cellSize / 2,
                top: 10 + 5 * cellSize + cellSize / 2,
                width: 8, height: 8, borderRadius: "50%",
                background: palette[i % palette.length],
                transform: `translate(${dx}px, ${dy}px) scale(${1 - clearP})`,
                opacity: 1 - clearP,
              }} />
            );
          })}
        </div>

        {/* Tray of pieces on the right */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 18,
          padding: 14,
          borderRadius: 14,
          background: "rgba(0,0,0,0.30)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {/* Three tray pieces */}
          <TrayPiece colour={SD_PURPLE} pattern={[[0,0],[0,1],[1,0]]} cell={20} term="nucleus" />
          <TrayPiece colour={SD_ORANGE} pattern={[[0,0],[0,1],[0,2]]} cell={20} term="ribosome" />
          <TrayPiece colour={SD_PINK}  pattern={[[0,0],[1,0],[1,1],[2,1]]} cell={20} term="vacuole" />
        </div>
      </div>
    </ModeShell>
  );
};

const TrayPiece: React.FC<{
  colour: string; pattern: number[][]; cell: number; term: string;
}> = ({ colour, pattern, cell, term }) => {
  let maxR = 0, maxC = 0;
  pattern.forEach(([r, c]) => { if (r > maxR) maxR = r; if (c > maxC) maxC = c; });
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 4,
    }}>
      <div style={{
        position: "relative",
        width: (maxC + 1) * (cell + 2),
        height: (maxR + 1) * (cell + 2),
      }}>
        {pattern.map(([r, c], i) => (
          <div key={i} style={{
            position: "absolute",
            left: c * (cell + 2),
            top: r * (cell + 2),
            width: cell, height: cell,
            borderRadius: 5,
            background: colour,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.20)",
          }} />
        ))}
      </div>
      <div style={{
        fontSize: 10, fontWeight: 800, color: colour,
        letterSpacing: 0.3, textTransform: "uppercase",
      }}>{term}</div>
    </div>
  );
};

// ----- 6 · Test --------------------------------------------------------

export const SDMTestScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Pick correct answer at 1.4s, reveal at 1.8s
  const pickAt = 1.4 * fps;
  const revealAt = 1.8 * fps;
  const picked = frame >= pickAt;
  const revealed = frame >= revealAt;

  const choices = [
    { id: 1, text: "Storage sac for water + waste" },
    { id: 2, text: "Powerhouse of the cell — produces ATP" },
    { id: 3, text: "Site of protein synthesis from mRNA" },
    { id: 4, text: "Control center; contains DNA" },
  ];
  const correctId = 2;
  const pickedId = correctId;

  return (
    <ModeShell vertical={vertical} number="6" name="Test." tagline="MC · T/F · written — auto-graded" accent={SD_GREEN}>
      <div style={{
        width: vertical ? 760 : 860,
        display: "flex", flexDirection: "column", gap: 14,
      }}>
        {/* Question card */}
        <div style={{
          padding: "26px 32px",
          borderRadius: 18,
          background: "linear-gradient(180deg, #1f1a2e 0%, #15101e 100%)",
          border: "1px solid rgba(255,255,255,0.16)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), 0 24px 60px rgba(0,0,0,0.45)",
        }}>
          <div style={{
            fontSize: 12, fontWeight: 800, letterSpacing: 1.4,
            color: SD_PURPLE, textTransform: "uppercase", marginBottom: 10,
          }}>QUESTION 4 OF 12</div>
          <div style={{
            fontSize: 28, fontWeight: 700, letterSpacing: -0.5,
          }}>What does <span style={{
            background: SD_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
            fontWeight: 800,
          }}>mitochondria</span> do?</div>
        </div>

        {/* Choices */}
        {choices.map((c, i) => {
          const isPicked = picked && c.id === pickedId;
          const isCorrect = revealed && c.id === correctId;
          const isWrongPicked = false;
          const accent = isCorrect ? SD_GREEN : isWrongPicked ? SD_RED : null;
          return (
            <div key={c.id} style={{
              padding: "14px 18px",
              borderRadius: 12,
              border: accent
                ? `1.5px solid ${accent}`
                : isPicked
                  ? `1.5px solid ${SD_PURPLE}`
                  : "1px solid rgba(255,255,255,0.10)",
              background: accent
                ? `${accent}26`
                : isPicked
                  ? `${SD_PURPLE}26`
                  : "rgba(255,255,255,0.04)",
              boxShadow: accent
                ? `0 0 24px ${accent}55`
                : isPicked
                  ? `0 0 16px ${SD_PURPLE}55`
                  : "none",
              display: "flex", alignItems: "center", gap: 12,
              fontSize: 16, fontWeight: 600, letterSpacing: -0.2,
              transform: isPicked ? "scale(1.01)" : "scale(1)",
              transition: "none",
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: accent || (isPicked ? SD_PURPLE : "rgba(255,255,255,0.10)"),
                display: "grid", placeItems: "center",
                fontSize: 12, fontWeight: 900, color: "white",
              }}>{["A", "B", "C", "D"][i]}</div>
              <span style={{ flex: 1, color: "white" }}>{c.text}</span>
              {isCorrect && (
                <div style={{
                  fontSize: 22, color: SD_GREEN, fontWeight: 900,
                }}>✓</div>
              )}
            </div>
          );
        })}
      </div>
    </ModeShell>
  );
};

// ----- Outro -----------------------------------------------------------

export const SDMOutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const iconSp = spring({ frame, fps, config: { damping: 12, stiffness: 130 } });
  const titleSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 18 } });
  const ctaSp = spring({ frame: frame - 0.8 * fps, fps, config: { damping: 22 } });
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
          <svg width={iconSize * 0.6} height={iconSize * 0.6} viewBox="0 0 60 60" fill="white">
            <rect x="10" y="14" width="34" height="40" rx="5" opacity="0.45" />
            <rect x="14" y="10" width="34" height="40" rx="5" opacity="0.7" />
            <rect x="18" y="6" width="34" height="40" rx="5" />
            <text x="35" y="32" fontSize="20" fontWeight="800" textAnchor="middle" fill="#FF6B6B">A</text>
          </svg>
        </div>
        <div style={{
          marginTop: vertical ? 40 : 32,
          fontSize: vertical ? 100 : 84, fontWeight: 800, letterSpacing: -2.5,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          opacity: titleSp, textAlign: "center", lineHeight: 1.05,
        }}>
          StudyDeck
        </div>
        <div style={{
          marginTop: vertical ? 16 : 12,
          fontSize: vertical ? 30 : 24, fontWeight: 600, letterSpacing: -0.4,
          color: COLORS.textSecondary,
          opacity: titleSp, textAlign: "center",
        }}>
          Six modes. One free app.
        </div>
        <div style={{
          marginTop: vertical ? 56 : 40,
          padding: vertical ? "18px 40px" : "16px 32px",
          borderRadius: 999,
          background: SD_GRADIENT,
          boxShadow: "0 12px 48px rgba(193, 71, 255, 0.45)",
          opacity: ctaSp,
          transform: `translateY(${interpolate(ctaSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 32 : 26,
          fontWeight: 700, letterSpacing: -0.5,
        }}>
          studydeck.pages.dev
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
