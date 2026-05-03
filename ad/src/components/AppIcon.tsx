import React from "react";
import { COLORS } from "../tokens";

const ICON_GRADIENT =
  `linear-gradient(135deg, ${COLORS.aiPink} 0%, ${COLORS.aiPurple} 55%, ${COLORS.aiBlue} 100%)`;

export const AppIcon: React.FC<{ size?: number }> = ({ size = 160 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.22,
      background: ICON_GRADIENT,
      display: "grid",
      placeItems: "center",
      boxShadow:
        `inset 0 ${size * 0.012}px 0 rgba(255,255,255,0.18),` +
        `0 ${size * 0.16}px ${size * 0.32}px rgba(0,0,0,0.45)`,
    }}
  >
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="white">
      <path d="M12 2.5l1.5 4.5 4.5 1.5-4.5 1.5L12 14.5 10.5 10 6 8.5 10.5 7 12 2.5zM18.5 13l.9 2.6 2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9.9-2.6zM5.5 14.5l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1L2.7 17.3l2.1-.7.7-2.1z" />
    </svg>
  </div>
);
