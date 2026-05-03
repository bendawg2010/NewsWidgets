import React from "react";
import { AbsoluteFill } from "remotion";

/** Painterly Sequoia/Tahoe-style backdrop. */
export const Wallpaper: React.FC<{ vignette?: boolean }> = ({
  vignette = true,
}) => (
  <AbsoluteFill>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(1400px 900px at 25% 15%, rgba(168, 85, 247, 0.55), transparent 65%)," +
          "radial-gradient(1200px 800px at 80% 90%, rgba(59, 130, 246, 0.50), transparent 65%)," +
          "radial-gradient(1000px 700px at 60% 50%, rgba(250, 45, 72, 0.30), transparent 70%)," +
          "linear-gradient(135deg, #1a0633 0%, #0a0a1a 60%, #1a0411 100%)",
      }}
    />
    {vignette && (
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    )}
  </AbsoluteFill>
);
