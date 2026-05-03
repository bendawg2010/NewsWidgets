import React from "react";
import { FONT_STACK } from "../tokens";

/**
 * "For macOS Tahoe" pill that goes above hook headlines so viewers
 * immediately know what platform this is for.
 */
export const MacBadge: React.FC<{
  vertical?: boolean;
  opacity?: number;
}> = ({ vertical = false, opacity = 1 }) => (
  <div style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: vertical ? "10px 18px" : "8px 16px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(20px)",
    fontFamily: FONT_STACK,
    fontSize: vertical ? 18 : 15,
    fontWeight: 700,
    color: "rgba(255,255,255,0.96)",
    letterSpacing: -0.2,
    marginBottom: vertical ? 28 : 20,
    opacity,
  }}>
    <AppleLogo size={vertical ? 18 : 15} />
    <span style={{ letterSpacing: 0.4, textTransform: "uppercase", fontSize: vertical ? 13 : 11, fontWeight: 800, opacity: 0.85 }}>
      Built for
    </span>
    <span>macOS Tahoe</span>
  </div>
);

const AppleLogo: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 14 16" fill="white">
    <path d="M11.624 5.81c-.046-2.85 2.327-4.224 2.434-4.293-1.327-1.94-3.39-2.207-4.124-2.236-1.756-.178-3.43 1.034-4.32 1.034-.892 0-2.27-1.008-3.736-.98C-.025-.633-1.69.353-2.62 1.991c-1.118 1.94-.286 4.81.806 6.387.534.769 1.17 1.633 2.005 1.602.806-.032 1.111-.522 2.085-.522.974 0 1.247.522 2.099.504.866-.014 1.415-.78 1.946-1.554.616-.892.87-1.756.884-1.802-.02-.008-1.696-.652-1.713-2.585.005.054 1.346.802 1.342 2.39zM9.022-1.86c.443-.534.74-1.276.659-2.014-.633.025-1.4.422-1.857.957-.41.473-.769 1.232-.673 1.96.706.054 1.428-.359 1.871-.903z" />
  </svg>
);
