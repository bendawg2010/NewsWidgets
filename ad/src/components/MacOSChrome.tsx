import React from "react";
import { MenuBar } from "./MenuBar";
import { MacOSDock } from "./MacOSDock";

/**
 * Wraps a Reveal scene with macOS chrome (menu bar + dock + control center) so
 * viewers immediately recognize they're looking at a macOS desktop.
 */
export const MacOSChrome: React.FC<{
  appName: string;
  time?: string;
  vertical?: boolean;
  children: React.ReactNode;
}> = ({ appName, time = "9:41 AM", vertical = false, children }) => {
  return (
    <>
      <MenuBar time={time} />
      {/* Top-right cluster of menu-bar icons (battery, wifi, control center) */}
      <div style={{
        position: "absolute",
        top: 8,
        right: 16,
        display: "flex",
        gap: 14,
        zIndex: 6,
        alignItems: "center",
        color: "rgba(255,255,255,0.95)",
        fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
        fontSize: 13,
        fontWeight: 500,
      }}>
        <BatteryIcon />
        <WifiIcon />
        <ControlCenterIcon />
        <SpotlightIcon />
        <span style={{ fontVariantNumeric: "tabular-nums", marginLeft: 6 }}>{time}</span>
      </div>
      {/* Inject the appName into the menu bar by overlaying */}
      <div style={{
        position: "absolute",
        top: 8,
        left: 60,
        zIndex: 7,
        color: "white",
        fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
        fontSize: 13,
        fontWeight: 700,
      }}>
        {appName}
      </div>
      {children}
      <MacOSDock vertical={vertical} />
    </>
  );
};

const BatteryIcon: React.FC = () => (
  <svg width={24} height={12} viewBox="0 0 24 12" fill="none">
    <rect x="0.5" y="0.5" width="20" height="11" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.7" />
    <rect x="2" y="2" width="16" height="8" rx="1" fill="currentColor" opacity="0.95" />
    <rect x="21" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity="0.7" />
  </svg>
);

const WifiIcon: React.FC = () => (
  <svg width={16} height={12} viewBox="0 0 16 12" fill="currentColor">
    <path d="M8 9.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM3 5.5l1.4 1.4A6.5 6.5 0 018 5a6.5 6.5 0 013.6 1.9L13 5.5A8.5 8.5 0 008 3.5a8.5 8.5 0 00-5 2zM0.5 3l1.4 1.4A11 11 0 018 1.5c2.4 0 4.6 0.8 6.1 2.1L15.5 3A13 13 0 008 0a13 13 0 00-7.5 3z" />
  </svg>
);

const ControlCenterIcon: React.FC = () => (
  <svg width={16} height={12} viewBox="0 0 16 12" fill="currentColor">
    <rect x="1" y="2" width="6" height="3" rx="1.5" opacity="0.8" />
    <rect x="9" y="2" width="6" height="3" rx="1.5" opacity="0.6" />
    <rect x="1" y="7" width="6" height="3" rx="1.5" opacity="0.6" />
    <rect x="9" y="7" width="6" height="3" rx="1.5" opacity="0.8" />
  </svg>
);

const SpotlightIcon: React.FC = () => (
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="6" r="4.5" />
    <path d="M9.5 9.5L13 13" strokeLinecap="round" />
  </svg>
);
