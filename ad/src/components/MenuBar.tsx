import React from "react";
import { FONT_STACK } from "../tokens";

/** Thin macOS menu bar mock for product context. */
export const MenuBar: React.FC<{ time: string }> = ({ time }) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 36,
      background: "rgba(0,0,0,0.35)",
      backdropFilter: "blur(20px)",
      display: "flex",
      alignItems: "center",
      padding: "0 18px",
      gap: 24,
      fontFamily: FONT_STACK,
      fontSize: 14,
      fontWeight: 500,
      color: "rgba(255,255,255,0.96)",
      zIndex: 5,
    }}
  >
    <AppleIcon />
    <span style={{ fontWeight: 600 }}>News Widgets</span>
    <span style={{ opacity: 0.85 }}>File</span>
    <span style={{ opacity: 0.85 }}>Edit</span>
    <span style={{ opacity: 0.85 }}>View</span>
    <span style={{ opacity: 0.85 }}>Window</span>
    <span style={{ opacity: 0.85 }}>Help</span>
    <div style={{ flex: 1 }} />
    <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>
  </div>
);

const AppleIcon: React.FC = () => (
  <svg width={16} height={18} viewBox="0 0 14 16" fill="white">
    <path d="M11.624 5.81c-.046-2.85 2.327-4.224 2.434-4.293-1.327-1.94-3.39-2.207-4.124-2.236-1.756-.178-3.43 1.034-4.32 1.034-.892 0-2.27-1.008-3.736-.98C-.025-.633-1.69.353-2.62 1.991c-1.118 1.94-.286 4.81.806 6.387.534.769 1.17 1.633 2.005 1.602.806-.032 1.111-.522 2.085-.522.974 0 1.247.522 2.099.504.866-.014 1.415-.78 1.946-1.554.616-.892.87-1.756.884-1.802-.02-.008-1.696-.652-1.713-2.585.005.054 1.346.802 1.342 2.39zM9.022-1.86c.443-.534.74-1.276.659-2.014-.633.025-1.4.422-1.857.957-.41.473-.769 1.232-.673 1.96.706.054 1.428-.359 1.871-.903z" />
  </svg>
);
