import React from "react";
import {
  AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig,
} from "remotion";
import { COLORS, FONT_STACK } from "../tokens";

// ----- Brand tokens ----------------------------------------------------

const DI_GOLD   = "#FFC93C";
const DI_SUNSET = "#FF7A45";
const DI_WINE   = "#C72C48";
const DI_MINT   = "#06D6A0";
const DI_PINK   = "#EC4899";
const DI_GRADIENT = `linear-gradient(135deg, ${DI_GOLD} 0%, ${DI_SUNSET} 50%, ${DI_WINE} 100%)`;

// ----- Sunset desktop wallpaper ---------------------------------------

const DIDesktop: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{
      background:
        "radial-gradient(1600px 1100px at 18% 18%, rgba(255, 201, 60, 0.55), transparent 60%)," +
        "radial-gradient(1400px 900px at 82% 82%, rgba(199, 44, 72, 0.55), transparent 65%)," +
        "radial-gradient(1100px 800px at 60% 50%, rgba(255, 122, 69, 0.40), transparent 70%)," +
        "linear-gradient(135deg, #1d0a0e 0%, #150a18 60%, #220a14 100%)",
    }} />
    <AbsoluteFill style={{
      background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
    }} />
  </AbsoluteFill>
);

// ----- macOS menu bar -------------------------------------------------

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
    <span style={{ fontWeight: 700 }}>DueIn</span>
    <span style={{ opacity: 0.85 }}>File</span>
    <span style={{ opacity: 0.85 }}>Edit</span>
    <span style={{ opacity: 0.85 }}>View</span>
    <span style={{ opacity: 0.85 }}>Window</span>
    <span style={{ opacity: 0.85 }}>Help</span>
    <div style={{ flex: 1 }} />
    <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>Tue 5:42 PM</span>
  </div>
);

// ----- Widget primitives ----------------------------------------------

const WidgetFrame: React.FC<{
  size: "small" | "medium" | "large";
  children: React.ReactNode;
}> = ({ size, children }) => {
  const dims = {
    small:  { w: 260, h: 260 },
    medium: { w: 540, h: 260 },
    large:  { w: 540, h: 540 },
  }[size];
  return (
    <div style={{
      width: dims.w, height: dims.h,
      borderRadius: 22,
      background: "rgba(20, 14, 18, 0.78)",
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

const Eyebrow: React.FC<{ label: string }> = ({ label }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 5,
    marginBottom: 10,
  }}>
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.55)" strokeWidth="2.4" />
      <path d="M12 7v5l3 2" stroke="rgba(255,255,255,0.55)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div style={{
      fontSize: 10, fontWeight: 800,
      letterSpacing: 1.2, color: "rgba(255,255,255,0.6)",
      textTransform: "uppercase",
    }}>{label}</div>
  </div>
);

// Small widget — single big number
const SmallWidget: React.FC<{ days?: number; emoji?: string; title?: string; color?: string }> = ({
  days = 47, emoji = "🎓", title = "Graduation", color = DI_GOLD,
}) => (
  <WidgetFrame size="small">
    <Eyebrow label="DUE IN" />
    <div style={{ fontSize: 38, marginTop: 4 }}>{emoji}</div>
    <div style={{
      fontSize: 16, fontWeight: 800, marginTop: 6,
      letterSpacing: -0.3,
    }}>{title}</div>
    <div style={{ flex: 1 }} />
    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
      <div style={{
        fontSize: 38, fontWeight: 900,
        color: color,
        letterSpacing: -1.2,
        fontVariantNumeric: "tabular-nums",
      }}>{days}</div>
      <div style={{
        fontSize: 12, fontWeight: 800,
        color: "rgba(255,255,255,0.55)",
      }}>days</div>
    </div>
  </WidgetFrame>
);

// Medium widget — top 3 countdowns
const MediumWidget: React.FC<{ items: { emoji: string; title: string; date: string; days: number; color: string }[] }> = ({ items }) => (
  <WidgetFrame size="medium">
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <Eyebrow label="UP NEXT" />
      <div style={{
        fontSize: 11, fontWeight: 800,
        padding: "2px 8px",
        background: "rgba(255,255,255,0.10)",
        borderRadius: 999,
        color: "rgba(255,255,255,0.78)",
        marginBottom: 10,
      }}>{items.length}</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {items.map((a, i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: "3px 22px 1fr auto",
          gap: 10, alignItems: "center",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 8,
          padding: "8px 12px 8px 0",
        }}>
          <div style={{ width: 3, height: 30, background: a.color, borderRadius: "8px 0 0 8px" }} />
          <span style={{ fontSize: 16 }}>{a.emoji}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, letterSpacing: -0.2,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{a.title}</div>
            <div style={{
              fontSize: 10, fontWeight: 600,
              color: "rgba(255,255,255,0.55)", marginTop: 2,
            }}>{a.date}</div>
          </div>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "flex-end",
          }}>
            <div style={{
              fontSize: 18, fontWeight: 900,
              color: a.color, fontVariantNumeric: "tabular-nums",
            }}>{a.days}</div>
            <div style={{
              fontSize: 9, fontWeight: 800,
              color: "rgba(255,255,255,0.55)",
            }}>days</div>
          </div>
        </div>
      ))}
    </div>
  </WidgetFrame>
);

// Large widget — full list
const LargeWidget: React.FC<{ items: { emoji: string; title: string; date: string; days: number; color: string }[] }> = ({ items }) => (
  <WidgetFrame size="large">
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      marginBottom: 8,
    }}>
      <div style={{
        fontSize: 16, fontWeight: 900, letterSpacing: -0.4,
      }}>DueIn</div>
      <div style={{
        fontSize: 11, fontWeight: 600,
        color: "rgba(255,255,255,0.55)",
      }}>May 5, 2026</div>
    </div>
    <div style={{
      height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 10,
    }} />
    <div style={{ display: "flex", flexDirection: "column", gap: 7, flex: 1 }}>
      {items.map((a, i) => (
        <div key={i} style={{
          display: "grid",
          gridTemplateColumns: "3px 22px 1fr auto",
          gap: 10, alignItems: "center",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 8,
          padding: "8px 12px 8px 0",
        }}>
          <div style={{ width: 3, height: 32, background: a.color, borderRadius: "8px 0 0 8px" }} />
          <span style={{ fontSize: 18 }}>{a.emoji}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{a.title}</div>
            <div style={{
              fontSize: 10, fontWeight: 600,
              color: "rgba(255,255,255,0.55)", marginTop: 2,
            }}>{a.date}</div>
          </div>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "flex-end",
          }}>
            <div style={{
              fontSize: 18, fontWeight: 900,
              color: a.color, fontVariantNumeric: "tabular-nums",
            }}>{a.days}</div>
            <div style={{
              fontSize: 9, fontWeight: 800,
              color: "rgba(255,255,255,0.55)",
            }}>days</div>
          </div>
        </div>
      ))}
    </div>
  </WidgetFrame>
);

// ----- Mock data ------------------------------------------------------

const SAMPLE_ITEMS = [
  { emoji: "📚", title: "AP Bio exam",     date: "May 19",   days: 14,  color: DI_WINE   },
  { emoji: "🏖️", title: "Summer break",    date: "Jun 2",    days: 28,  color: DI_SUNSET },
  { emoji: "🎓", title: "Graduation",      date: "Jun 21",   days: 47,  color: DI_GOLD   },
  { emoji: "🎂", title: "Mom's birthday",  date: "Jul 7",    days: 63,  color: DI_PINK   },
  { emoji: "✈️", title: "Hawaii trip",     date: "Sep 2",    days: 120, color: DI_MINT   },
];

// ----- Scene 1: Hook --------------------------------------------------

export const DIHookScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const t1 = spring({ frame, fps, config: { damping: 16 } });
  const t2 = spring({ frame: frame - 0.6 * fps, fps, config: { damping: 16 } });
  const t3 = spring({ frame: frame - 1.2 * fps, fps, config: { damping: 18 } });
  const t4 = spring({ frame: frame - 1.9 * fps, fps, config: { damping: 14 } });

  // Peek widget in corner appearing after the hook lines
  const widgetSp = spring({ frame: frame - 1.8 * fps, fps, config: { damping: 14 } });

  const fontSize = vertical ? 92 : 76;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DIDesktop />
      <MenuBar vertical={vertical} />

      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60, paddingTop: vertical ? 80 : 60,
        zIndex: 4,
      }}>
        {/* "How long till..." */}
        <div style={{
          opacity: t1,
          transform: `translateY(${interpolate(t1, [0, 1], [40, 0])}px)`,
          fontSize: fontSize * 0.7, fontWeight: 700, letterSpacing: -1.5,
          color: "rgba(255,255,255,0.78)",
          marginBottom: vertical ? 20 : 14,
          textShadow: "0 4px 16px rgba(0,0,0,0.45)",
        }}>
          How long till...
        </div>

        {/* "graduation?" */}
        <div style={{
          opacity: t2,
          transform: `translateY(${interpolate(t2, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -2.5,
          lineHeight: 1, textAlign: "center",
          background: DI_GRADIENT,
          backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
        }}>
          graduation?
        </div>

        {/* "summer?" */}
        <div style={{
          marginTop: vertical ? 14 : 8,
          opacity: t3,
          transform: `translateY(${interpolate(t3, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -2.5,
          lineHeight: 1, textAlign: "center",
          color: DI_SUNSET,
        }}>
          summer break?
        </div>

        {/* "the trip?" */}
        <div style={{
          marginTop: vertical ? 14 : 8,
          opacity: t4,
          transform: `translateY(${interpolate(t4, [0, 1], [40, 0])}px)`,
          fontSize, fontWeight: 800, letterSpacing: -2.5,
          lineHeight: 1, textAlign: "center",
          color: DI_GOLD,
        }}>
          the trip?
        </div>
      </AbsoluteFill>

      {/* Peek small widget bottom-right */}
      <div style={{
        position: "absolute",
        right: vertical ? 70 : 100, bottom: vertical ? 110 : 90,
        opacity: widgetSp * 0.8,
        transform: `translateY(${interpolate(widgetSp, [0, 1], [40, 0])}px) rotate(-3deg) scale(${interpolate(widgetSp, [0, 1], [0.85, 0.92])})`,
        zIndex: 3,
      }}>
        <SmallWidget />
      </div>
    </AbsoluteFill>
  );
};

// ----- Scene 2: Single small widget hero ------------------------------

export const DISingleWidgetScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const captionSp = spring({ frame, fps, config: { damping: 18 } });
  const widgetSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 13, stiffness: 100 } });

  // Subtle breathing
  const breathe = 1 + Math.sin(frame / 28) * 0.015;
  // Tick down: every 0.7s the day count decrements (sped-up "time passing")
  const tickStart = 1.6 * fps;
  const tickIdx = Math.max(0, Math.floor((frame - tickStart) / (0.6 * fps)));
  const days = Math.max(43, 47 - tickIdx);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DIDesktop />
      <MenuBar vertical={vertical} />

      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60, paddingTop: vertical ? 80 : 60,
        zIndex: 4,
      }}>
        <div style={{
          opacity: captionSp,
          transform: `translateY(${interpolate(captionSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 56 : 46, fontWeight: 800, letterSpacing: -1.6,
          textAlign: "center", marginBottom: vertical ? 40 : 36,
          textShadow: "0 4px 16px rgba(0,0,0,0.45)",
        }}>
          Now you know <span style={{
            background: DI_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>at a glance.</span>
        </div>

        <div style={{
          opacity: widgetSp,
          transform: `translateY(${interpolate(widgetSp, [0, 1], [80, 0])}px) scale(${interpolate(widgetSp, [0, 1], [0.7, breathe * 1.4])})`,
          // Big version of the small widget
          transformOrigin: "center",
        }}>
          <SmallWidget days={days} />
        </div>

        <div style={{
          marginTop: vertical ? 40 : 30,
          opacity: spring({ frame: frame - 1.4 * fps, fps, config: { damping: 22 } }),
          fontSize: vertical ? 24 : 20,
          fontWeight: 600,
          color: "rgba(255,255,255,0.78)",
          letterSpacing: -0.3, textAlign: "center",
        }}>
          Native macOS widget · Refreshes daily.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 3: Three sizes gallery -----------------------------------

export const DIGalleryScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const captionSp = spring({ frame, fps, config: { damping: 18 } });
  const smSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 14, stiffness: 130 } });
  const mdSp = spring({ frame: frame - 0.7 * fps, fps, config: { damping: 14, stiffness: 130 } });
  const lgSp = spring({ frame: frame - 1.0 * fps, fps, config: { damping: 14, stiffness: 130 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DIDesktop />
      <MenuBar vertical={vertical} />

      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60, paddingTop: vertical ? 80 : 60,
        zIndex: 4,
      }}>
        <div style={{
          opacity: captionSp,
          transform: `translateY(${interpolate(captionSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 56 : 46, fontWeight: 800, letterSpacing: -1.6,
          textAlign: "center", marginBottom: vertical ? 36 : 32,
          textShadow: "0 4px 16px rgba(0,0,0,0.45)",
        }}>
          Three sizes. <span style={{
            background: DI_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>Stack 'em up.</span>
        </div>

        {vertical ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
            <div style={{
              opacity: smSp,
              transform: `translateY(${interpolate(smSp, [0, 1], [60, 0])}px) scale(${interpolate(smSp, [0, 1], [0.85, 1])})`,
            }}>
              <SmallWidget />
            </div>
            <div style={{
              opacity: mdSp,
              transform: `translateY(${interpolate(mdSp, [0, 1], [60, 0])}px) scale(${interpolate(mdSp, [0, 1], [0.85, 1])})`,
            }}>
              <MediumWidget items={SAMPLE_ITEMS.slice(0, 3)} />
            </div>
            <div style={{
              opacity: lgSp,
              transform: `translateY(${interpolate(lgSp, [0, 1], [60, 0])}px) scale(${interpolate(lgSp, [0, 1], [0.85, 0.85])})`,
            }}>
              <LargeWidget items={SAMPLE_ITEMS} />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 22, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <div style={{
                opacity: smSp,
                transform: `translateY(${interpolate(smSp, [0, 1], [60, 0])}px) scale(${interpolate(smSp, [0, 1], [0.85, 1])})`,
              }}>
                <SmallWidget />
              </div>
              <div style={{
                opacity: mdSp,
                transform: `translateY(${interpolate(mdSp, [0, 1], [60, 0])}px) scale(${interpolate(mdSp, [0, 1], [0.85, 1])})`,
              }}>
                <MediumWidget items={SAMPLE_ITEMS.slice(0, 3)} />
              </div>
            </div>
            <div style={{
              opacity: lgSp,
              transform: `translateY(${interpolate(lgSp, [0, 1], [60, 0])}px) scale(${interpolate(lgSp, [0, 1], [0.85, 1])})`,
            }}>
              <LargeWidget items={SAMPLE_ITEMS} />
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ----- Scene 4: Adding a countdown live -------------------------------

export const DIAddingScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const captionSp = spring({ frame, fps, config: { damping: 18 } });
  const widgetSp = spring({ frame: frame - 0.4 * fps, fps, config: { damping: 14 } });
  const formSp = spring({ frame: frame - 1.0 * fps, fps, config: { damping: 14, stiffness: 110 } });

  // Form: title typed character by character starting at 1.2s
  const typeStart = 1.4 * fps;
  const typeFinish = 2.6 * fps;
  const targetTitle = "Hawaii trip";
  const charsTyped = Math.max(0, Math.min(
    targetTitle.length,
    Math.floor(((frame - typeStart) / (typeFinish - typeStart)) * targetTitle.length),
  ));
  const titleText = targetTitle.slice(0, charsTyped);

  // The "Add" button click happens at 3.4s
  const addedAt = 3.6 * fps;
  const added = frame >= addedAt;
  // After add, list shows new entry
  const newEntrySp = spring({ frame: frame - addedAt, fps, config: { damping: 12, stiffness: 200 } });

  // Live items in the widget — base 3, plus the new one if added
  const liveItems = added
    ? [
      { emoji: "📚", title: "AP Bio exam",  date: "May 19", days: 14,  color: DI_WINE   },
      { emoji: "🏖️", title: "Summer break", date: "Jun 2",  days: 28,  color: DI_SUNSET },
      { emoji: "✈️", title: "Hawaii trip",  date: "Sep 2",  days: 120, color: DI_MINT   },
    ]
    : SAMPLE_ITEMS.slice(0, 3);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DIDesktop />
      <MenuBar vertical={vertical} />

      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 40, paddingTop: vertical ? 80 : 60,
        zIndex: 4,
      }}>
        <div style={{
          opacity: captionSp,
          transform: `translateY(${interpolate(captionSp, [0, 1], [-12, 0])}px)`,
          fontSize: vertical ? 56 : 44, fontWeight: 800, letterSpacing: -1.6,
          textAlign: "center", marginBottom: vertical ? 36 : 30,
          textShadow: "0 4px 16px rgba(0,0,0,0.45)",
        }}>
          Add a date. <span style={{
            background: DI_GRADIENT,
            backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent",
          }}>Widget knows.</span>
        </div>

        {vertical ? (
          // Vertical: stacked
          <div style={{ display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
            <FormCard title={titleText} typing={charsTyped < targetTitle.length} added={added} sp={formSp} />
            <div style={{
              opacity: widgetSp,
              transform: `translateY(${interpolate(widgetSp, [0, 1], [40, 0])}px)`,
            }}>
              <MediumWidget items={liveItems} />
            </div>
          </div>
        ) : (
          // Horizontal: form on left, widget on right
          <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
            <FormCard title={titleText} typing={charsTyped < targetTitle.length} added={added} sp={formSp} />
            <div style={{
              opacity: widgetSp,
              transform: `translateY(${interpolate(widgetSp, [0, 1], [40, 0])}px)`,
              position: "relative",
            }}>
              <MediumWidget items={liveItems} />
              {added && newEntrySp > 0.05 && (
                <div style={{
                  position: "absolute",
                  bottom: 18, right: -16,
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: DI_MINT,
                  color: "black",
                  fontSize: 11, fontWeight: 900, letterSpacing: 0.3,
                  boxShadow: "0 8px 24px rgba(6,214,160,0.45)",
                  transform: `scale(${newEntrySp}) rotate(${interpolate(newEntrySp, [0, 1], [-10, 4])}deg)`,
                  textTransform: "uppercase",
                }}>
                  + Just added
                </div>
              )}
            </div>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Tiny mock app form
const FormCard: React.FC<{ title: string; typing: boolean; added: boolean; sp: number }> = ({ title, typing, added, sp }) => (
  <div style={{
    width: 320,
    background: "rgba(20, 14, 18, 0.85)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
    backdropFilter: "blur(20px)",
    fontFamily: FONT_STACK,
    color: "white",
    opacity: sp,
    transform: `translateY(${interpolate(sp, [0, 1], [40, 0])}px) scale(${interpolate(sp, [0, 1], [0.9, 1])})`,
  }}>
    <div style={{
      fontSize: 18, fontWeight: 900, marginBottom: 14,
      letterSpacing: -0.4,
    }}>New countdown</div>

    <div style={{
      fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
      color: "rgba(255,255,255,0.55)",
      textTransform: "uppercase",
      marginBottom: 6,
    }}>TITLE</div>
    <div style={{
      padding: "10px 12px",
      background: "rgba(255,255,255,0.08)",
      borderRadius: 8,
      fontSize: 16, fontWeight: 600,
      letterSpacing: -0.2,
      marginBottom: 14,
      minHeight: 36,
    }}>
      {title}
      {typing && (
        <span style={{
          display: "inline-block",
          width: 1.5, height: 16,
          background: "white",
          marginLeft: 1,
          verticalAlign: "middle",
          opacity: Math.sin(Date.now() / 300) > 0 ? 1 : 0,
        }} />
      )}
    </div>

    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
          color: "rgba(255,255,255,0.55)",
          textTransform: "uppercase",
          marginBottom: 6,
        }}>EMOJI</div>
        <div style={{
          padding: "6px 10px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 8,
          fontSize: 22, textAlign: "center",
        }}>✈️</div>
      </div>
      <div style={{ flex: 2 }}>
        <div style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 1.2,
          color: "rgba(255,255,255,0.55)",
          textTransform: "uppercase",
          marginBottom: 6,
        }}>TARGET DATE</div>
        <div style={{
          padding: "10px 12px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: 8,
          fontSize: 13, fontWeight: 600,
        }}>Sept 2, 2026</div>
      </div>
    </div>

    <div style={{
      marginTop: 16,
      padding: "10px 16px",
      background: added ? "rgba(6,214,160,0.18)" : "linear-gradient(135deg, #FFC93C, #FF7A45, #C72C48)",
      color: added ? "#06D6A0" : "white",
      border: added ? "1px solid rgba(6,214,160,0.45)" : "none",
      fontSize: 14, fontWeight: 800, letterSpacing: -0.2,
      borderRadius: 999,
      textAlign: "center",
      boxShadow: added ? "none" : "0 8px 24px rgba(199,44,72,0.40)",
    }}>
      {added ? "✓ Added" : "Add countdown"}
    </div>
  </div>
);

// ----- Scene 5: Features grid -----------------------------------------

const FEATURES = [
  { title: "Native macOS",    sub: "SwiftUI + WidgetKit." },
  { title: "Three sizes",     sub: "Small, medium, large." },
  { title: "Local-first",     sub: "Lives in your App Group." },
  { title: "Color + emoji",   sub: "Spot it from across the room." },
  { title: "Cmd+N to add",    sub: "Type, pick date, done." },
  { title: "Free forever",    sub: "Open source, MIT." },
];

export const DIFeaturesScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <DIDesktop />
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
            background: DI_GRADIENT,
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
                background: "rgba(20, 14, 18, 0.78)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 16,
                padding: vertical ? "20px 22px" : "22px 26px",
                backdropFilter: "blur(40px)",
              }}>
                <div style={{
                  fontSize: vertical ? 22 : 22, fontWeight: 800, letterSpacing: -0.5,
                  marginBottom: 6,
                  background: DI_GRADIENT,
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

// ----- Scene 6: Outro -------------------------------------------------

export const DIOutroScene: React.FC<{ vertical?: boolean }> = ({ vertical = false }) => {
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
      <DIDesktop />
      <AbsoluteFill style={{
        alignItems: "center", justifyContent: "center",
        fontFamily: FONT_STACK, color: "white", padding: 60,
      }}>
        <div style={{
          transform: `scale(${interpolate(iconSp, [0, 1], [0.4, 1])}) rotate(${interpolate(iconSp, [0, 1], [-20, 0])}deg)`,
          opacity: iconSp,
          width: iconSize, height: iconSize, borderRadius: iconSize * 0.22,
          background: DI_GRADIENT,
          display: "grid", placeItems: "center",
          boxShadow: `inset 0 ${iconSize * 0.012}px 0 rgba(255,255,255,0.18), 0 ${iconSize * 0.16}px ${iconSize * 0.32}px rgba(199,44,72,0.40)`,
        }}>
          <svg width={iconSize * 0.62} height={iconSize * 0.62} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.4" />
            <path d="M12 7v5l3 2" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{
          marginTop: vertical ? 40 : 32,
          fontSize: vertical ? 100 : 84, fontWeight: 800, letterSpacing: -2.5,
          transform: `translateY(${interpolate(titleSp, [0, 1], [20, 0])}px)`,
          opacity: titleSp, textAlign: "center", lineHeight: 1.05,
        }}>
          DueIn
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
          background: DI_GRADIENT,
          boxShadow: "0 12px 48px rgba(199,44,72,0.40)",
          opacity: ctaSp,
          transform: `translateY(${interpolate(ctaSp, [0, 1], [12, 0])}px)`,
          fontSize: vertical ? 32 : 26,
          fontWeight: 700, letterSpacing: -0.5,
        }}>
          duein.pages.dev
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
          ★ github.com/bendawg2010/DueIn
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
