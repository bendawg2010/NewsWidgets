import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Wallpaper } from "../components/Wallpaper";
import { COLORS, FONT_STACK } from "../tokens";

type Props = { vertical?: boolean };

export const WebsiteScene: React.FC<Props> = ({ vertical = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const winSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 95 },
  });
  const winY = interpolate(winSpring, [0, 1], [120, 0]);
  const winScale = interpolate(winSpring, [0, 1], [0.92, 1]);
  const winOp = interpolate(winSpring, [0, 1], [0, 1]);

  const captionOp = interpolate(frame, [0.45 * fps, 1.0 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const winWidth = vertical ? 940 : 1320;
  const winHeight = vertical ? 1180 : 720;

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Wallpaper />

      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: winWidth,
            height: winHeight,
            transform: `translateY(${winY}px) scale(${winScale})`,
            opacity: winOp,
            background: "#0e0a18",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.65)," +
              "0 0 0 1px rgba(255,255,255,0.08) inset",
            display: "flex",
            flexDirection: "column",
            fontFamily: FONT_STACK,
            color: "white",
          }}
        >
          {/* Browser chrome */}
          <div
            style={{
              padding: "10px 14px",
              background: "rgba(20, 14, 32, 0.95)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", gap: 7 }}>
              <Light color="#ff5f57" />
              <Light color="#febc2e" />
              <Light color="#28c840" />
            </div>
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.10)",
                borderRadius: 8,
                padding: "7px 14px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 14,
                color: "rgba(255,255,255,0.9)",
                fontFamily:
                  'ui-monospace, "SF Mono", Menlo, monospace',
                fontWeight: 500,
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              <Lock />
              newswidgets.pages.dev
            </div>
            <div style={{ width: 40 }} />
          </div>

          {/* Page content (recreated hero) */}
          <div
            style={{
              flex: 1,
              padding: vertical ? "44px 36px" : "60px 40px",
              background:
                "radial-gradient(800px 500px at 20% 20%, rgba(168,86,247,0.35), transparent 60%)," +
                "radial-gradient(700px 500px at 80% 80%, rgba(59,130,246,0.30), transparent 60%)," +
                "radial-gradient(600px 400px at 60% 50%, rgba(250,45,72,0.20), transparent 65%)," +
                "linear-gradient(135deg, #1a0633 0%, #0a0a1a 60%, #1a0411 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1,
                padding: "6px 12px",
                background: "rgba(168,86,247,0.18)",
                border: "1px solid rgba(168,86,247,0.32)",
                color: "#c4a4ff",
                borderRadius: 999,
                textTransform: "uppercase",
              }}
            >
              ★ Open source · MIT licensed
            </div>
            <div
              style={{
                fontSize: vertical ? 56 : 78,
                fontWeight: 800,
                letterSpacing: -2.5,
                lineHeight: 1.05,
              }}
            >
              Today,{" "}
              <span
                style={{
                  background: `linear-gradient(135deg, ${COLORS.aiPink}, ${COLORS.aiPurple} 60%, ${COLORS.aiBlue})`,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                summarized.
              </span>
            </div>
            <div
              style={{
                fontSize: vertical ? 18 : 22,
                color: COLORS.textSecondary,
                maxWidth: 560,
                lineHeight: 1.4,
              }}
            >
              Two beautiful native widgets for your macOS desktop. Free, open source, refreshed automatically.
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
              <div
                style={{
                  padding: "12px 24px",
                  background: `linear-gradient(135deg, ${COLORS.aiPink}, ${COLORS.aiPurple} 60%, ${COLORS.aiBlue})`,
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "white",
                  boxShadow: "0 8px 24px rgba(168,86,247,0.35)",
                }}
              >
                Install for macOS
              </div>
              <div
                style={{
                  padding: "12px 24px",
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                ★ Star on GitHub
              </div>
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* Caption banner */}
      <div
        style={{
          position: "absolute",
          bottom: vertical ? 140 : 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_STACK,
          color: "white",
          opacity: captionOp,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: vertical ? "16px 32px" : "12px 26px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${COLORS.aiPink}, ${COLORS.aiPurple} 60%, ${COLORS.aiBlue})`,
            fontSize: vertical ? 36 : 28,
            fontWeight: 700,
            letterSpacing: -0.5,
            boxShadow: "0 12px 36px rgba(168,86,247,0.45)",
          }}
        >
          newswidgets.pages.dev
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Light: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{
      width: 12,
      height: 12,
      borderRadius: "50%",
      background: color,
      boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.2)",
    }}
  />
);

const Lock: React.FC = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 11h14v9a1 1 0 01-1 1H6a1 1 0 01-1-1v-9z" />
    <path d="M8 11V7a4 4 0 018 0v4" />
  </svg>
);
