import React from "react";
import { FONT_STACK, COLORS } from "../tokens";

/**
 * Persistent corner badge showing the product URL. Sits above all scenes
 * inside an Ad composition, visible the whole time.
 */
export const Watermark: React.FC<{
  url: string;
  accentColor: string;
  vertical?: boolean;
}> = ({ url, accentColor, vertical = false }) => (
  <div style={{
    position: "absolute",
    top: vertical ? 30 : 24,
    right: vertical ? 30 : 32,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: vertical ? "10px 16px" : "8px 14px",
    borderRadius: 999,
    background: "rgba(20, 14, 16, 0.85)",
    border: `1px solid ${accentColor}40`,
    backdropFilter: "blur(20px)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    fontFamily: FONT_STACK,
    pointerEvents: "none",
  }}>
    <div style={{
      width: 8, height: 8, borderRadius: "50%",
      background: "#34c759",
      boxShadow: "0 0 8px #34c759",
    }} />
    <div style={{
      fontSize: vertical ? 14 : 13,
      fontWeight: 700,
      color: "white",
      letterSpacing: -0.2,
    }}>
      {url}
    </div>
  </div>
);
