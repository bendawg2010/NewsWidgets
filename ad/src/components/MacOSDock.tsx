import React from "react";

/** Floating macOS-style Dock with iconography. Sits at the bottom of a scene. */
export const MacOSDock: React.FC<{ vertical?: boolean }> = ({
  vertical = false,
}) => {
  const apps = [
    { color: "linear-gradient(135deg, #5BB1FF, #007AFF)",                 letter: "" },  // Finder-ish
    { color: "linear-gradient(135deg, #FF6CB6, #C13584)",                 letter: "" },  // Photos
    { color: "linear-gradient(135deg, #34C759, #1FA85B)",                 letter: "" },  // Messages
    { color: "linear-gradient(135deg, #FF9500, #FF3B30)",                 letter: "" },  // Music
    { color: "linear-gradient(135deg, #ED4799, #A856F7 55%, #3B82F6)",    letter: "★" }, // News Widgets (highlighted)
    { color: "linear-gradient(135deg, #5856D6, #AF52DE)",                 letter: "" },  // App
    { color: "linear-gradient(135deg, #FFD60A, #FF9500)",                 letter: "" },  // Notes
    { color: "linear-gradient(135deg, #64D2FF, #007AFF)",                 letter: "" },  // Mail
    { color: "linear-gradient(135deg, #FF3B30, #FF2D55)",                 letter: "" },  // App
  ];

  const iconSize = vertical ? 56 : 48;

  return (
    <div style={{
      position: "absolute",
      bottom: vertical ? 36 : 24,
      left: "50%",
      transform: "translateX(-50%)",
      display: "flex",
      gap: 8,
      padding: "8px 12px",
      background: "rgba(255,255,255,0.18)",
      backdropFilter: "blur(40px) saturate(180%)",
      WebkitBackdropFilter: "blur(40px) saturate(180%)",
      border: "1px solid rgba(255,255,255,0.22)",
      borderRadius: 22,
      boxShadow: "0 12px 36px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.18)",
      zIndex: 50,
    }}>
      {apps.map((a, i) => (
        <div
          key={i}
          style={{
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize * 0.22,
            background: a.color,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 8px rgba(0,0,0,0.25)",
            display: "grid",
            placeItems: "center",
            color: "white",
            fontWeight: 800,
            fontSize: iconSize * 0.45,
            position: "relative",
            // Highlight the News Widgets icon — bouncing dot like an open app
            transform: a.letter === "★" ? "translateY(-2px) scale(1.05)" : "none",
          }}
        >
          {a.letter}
          {a.letter === "★" && (
            <div style={{
              position: "absolute",
              bottom: -6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "white",
              boxShadow: "0 0 6px rgba(255,255,255,0.9)",
            }} />
          )}
        </div>
      ))}
    </div>
  );
};
