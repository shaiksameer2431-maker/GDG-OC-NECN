import React from "react";
import "./CloudChampionsScene.css";

type CloudCircuitBackgroundProps = {
  className?: string;
  /** Decorative only; does not intercept clicks. */
  opacity?: number;
};

/**
 * Non-Colliding, Full Window-Fit Vector Circuit Background
 * Features:
 * - Complete window-width coverage: densely populated starting (X=0-220) and ending (X=1700-1920) margins with zero empty space.
 * - Strict collision avoidance: zero lines cutting through the headline text block or the 3D cloud.
 * - Connected highway buses routed above (Y=40, 75) and below (Y=795, 830) with central inter-column conduit.
 * - All secondary branch ends terminate in circular connection pads (zero broken lines).
 * - Smooth animated electric data streams in Google Cloud colours.
 */
export function CloudCircuitBackground({
  className = "",
  opacity = 1,
}: CloudCircuitBackgroundProps) {
  return (
    <svg
      className={`cloud-circuit-background ${className}`}
      viewBox="0 0 1920 860"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
    >
      <defs>
        {/* Soft trace gradient */}
        <linearGradient id="traceGradMain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f5d79" stopOpacity="0.52" />
          <stop offset="20%" stopColor="#677694" stopOpacity="0.34" />
          <stop offset="50%" stopColor="#5d6c8a" stopOpacity="0.24" />
          <stop offset="80%" stopColor="#677694" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#4f5d79" stopOpacity="0.52" />
        </linearGradient>

        <linearGradient id="streamGradBlue" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4285F4" stopOpacity="0" />
          <stop offset="50%" stopColor="#4285F4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8AB4F8" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="streamGradCyan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
          <stop offset="60%" stopColor="#00E5FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="streamGradGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBBC04" stopOpacity="0" />
          <stop offset="50%" stopColor="#FBBC04" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFE082" stopOpacity="0.95" />
        </linearGradient>

        <radialGradient id="circuitOrbGlow">
          <stop offset="0%" stopColor="#74809a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#74809a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Ambient Corner Tech Radar Orbs */}
      <g fill="url(#circuitOrbGlow)" className="circuit-ambient-orb">
        <circle cx="80" cy="60" r="54" />
        <circle cx="60" cy="740" r="48" />
        <circle cx="1840" cy="80" r="60" />
        <circle cx="1860" cy="740" r="50" />
      </g>

      {/* 2. Concentric Orbit Arcs framing the 3D cloud scene on the outside (no collision) */}
      <g fill="none" stroke="#677694" opacity="0.18">
        <circle cx="1400" cy="380" r="290" strokeDasharray="16 22" strokeWidth="1.2" />
        <circle cx="1400" cy="380" r="350" strokeDasharray="24 30" strokeWidth="1.2" />
      </g>

      {/* 3. STARTING WINDOW MARGIN (Left Edge: X=0 to 220, dense populated traces) */}
      <g className="circuit-branch-base" stroke="url(#traceGradMain)">
        <path d="M 0 50 H 120 L 160 90 V 220 L 120 260 H 0" />
        <path d="M 0 130 H 80 L 120 170 H 180" />
        <path d="M 0 200 H 60 L 100 240 H 140" />
        <path d="M 0 320 H 90 L 130 360 V 440 L 90 480 H 0" />
        <path d="M 0 390 H 70 L 110 430 H 150" />
        <path d="M 0 530 H 100 L 140 570 V 670 L 100 710 H 0" />
        <path d="M 0 620 H 80 L 120 660 H 160" />
        <path d="M 0 740 H 90 L 130 780 H 170" />
      </g>

      {/* 4. ENDING WINDOW MARGIN (Right Edge: X=1700 to 1920, dense populated traces) */}
      <g className="circuit-branch-base" stroke="url(#traceGradMain)">
        <path d="M 1920 50 H 1800 L 1760 90 V 220 L 1800 260 H 1920" />
        <path d="M 1920 130 H 1840 L 1800 170 H 1740" />
        <path d="M 1920 200 H 1860 L 1820 240 H 1780" />
        <path d="M 1920 320 H 1830 L 1790 360 V 440 L 1830 480 H 1920" />
        <path d="M 1920 390 H 1850 L 1810 430 H 1770" />
        <path d="M 1920 530 H 1820 L 1780 570 V 670 L 1820 710 H 1920" />
        <path d="M 1920 620 H 1840 L 1800 660 H 1760" />
        <path d="M 1920 740 H 1830 L 1790 780 H 1750" />
      </g>

      {/* 5. CONTINUOUS HIGHWAY BUSES (Edge-to-Edge: X=0 to 1920, strictly avoiding text & cloud) */}
      <g className="circuit-trace-base" stroke="url(#traceGradMain)">
        {/* Top Highway 1: Above text & cloud */}
        <path d="M 0 40 H 520 L 560 75 H 920 L 955 40 H 1440 L 1475 75 H 1920" />

        {/* Top Highway 2: Above text & cloud */}
        <path d="M 0 75 H 460 L 495 110 H 880 L 915 75 H 1500 L 1535 110 H 1920" />

        {/* Central Inter-Column Conduit (Between text column and cloud column) */}
        <path d="M 955 40 V 260 L 925 290 V 580 L 955 610 V 795" />
        <path d="M 915 75 V 240 L 945 270 V 595 L 915 625 V 830" />

        {/* Bottom Highway 3: Below buttons & laptop */}
        <path d="M 0 795 H 480 L 515 765 H 940 L 975 795 H 1460 L 1495 765 H 1920" />

        {/* Bottom Highway 4: Below buttons & laptop */}
        <path d="M 0 830 H 600 L 635 800 H 1340 L 1375 830 H 1920" />
      </g>

      {/* 6. OUTER CLOUD FRAMING TRACES (Frames around the 3D scene without collision) */}
      <g className="circuit-branch-base" stroke="url(#traceGradMain)">
        {/* Upper cloud frame */}
        <path d="M 1040 150 H 1180 L 1220 110 H 1480 L 1520 150 H 1680" />
        {/* Lower cloud frame */}
        <path d="M 1040 730 H 1160 L 1200 765 H 1460 L 1500 730 H 1680" />
        {/* Feeders from right margin to cloud frame */}
        <path d="M 1680 150 L 1720 190 H 1760" />
        <path d="M 1680 730 L 1720 690 H 1760" />
      </g>

      {/* 7. ACTIVE ANIMATED FLOWING SIGNAL STREAMS (Continuous along non-colliding highways) */}
      <g
        className="circuit-pulse-stream"
        stroke="url(#streamGradBlue)"
        strokeWidth="1.95"
      >
        <path d="M 0 40 H 520 L 560 75 H 920 L 955 40 H 1440 L 1475 75 H 1920" />
        <path d="M 0 795 H 480 L 515 765 H 940 L 975 795 H 1460 L 1495 765 H 1920" />
      </g>

      <g
        className="circuit-pulse-stream circuit-pulse-stream--fast"
        stroke="url(#streamGradCyan)"
        strokeWidth="2.0"
      >
        <path d="M 955 40 V 260 L 925 290 V 580 L 955 610 V 795" />
      </g>

      <g
        className="circuit-pulse-stream circuit-pulse-stream--slow"
        stroke="url(#streamGradGold)"
        strokeWidth="1.85"
      >
        <path d="M 0 75 H 460 L 495 110 H 880 L 915 75 H 1500 L 1535 110 H 1920" />
        <path d="M 0 830 H 600 L 635 800 H 1340 L 1375 830 H 1920" />
      </g>

      {/* 8. TERMINAL CONNECTION PADS (Guarantees NO branch line end is left open) */}
      <g fill="#4f5d79" opacity="0.65">
        {/* Left margin pads */}
        <circle cx="180" cy="170" r="5" />
        <circle cx="140" cy="240" r="5" />
        <circle cx="150" cy="430" r="5" />
        <circle cx="160" cy="660" r="5" />
        <circle cx="170" cy="780" r="5" />
        {/* Right margin pads */}
        <circle cx="1740" cy="170" r="5" />
        <circle cx="1780" cy="240" r="5" />
        <circle cx="1770" cy="430" r="5" />
        <circle cx="1760" cy="660" r="5" />
        <circle cx="1750" cy="780" r="5" />
        {/* Cloud frame pads */}
        <circle cx="1040" cy="150" r="5" />
        <circle cx="1040" cy="730" r="5" />
      </g>
      <g fill="#ffffff" opacity="0.9">
        <circle cx="180" cy="170" r="2" />
        <circle cx="140" cy="240" r="2" />
        <circle cx="150" cy="430" r="2" />
        <circle cx="160" cy="660" r="2" />
        <circle cx="170" cy="780" r="2" />
        <circle cx="1740" cy="170" r="2" />
        <circle cx="1780" cy="240" r="2" />
        <circle cx="1770" cy="430" r="2" />
        <circle cx="1760" cy="660" r="2" />
        <circle cx="1750" cy="780" r="2" />
        <circle cx="1040" cy="150" r="2" />
        <circle cx="1040" cy="730" r="2" />
      </g>

      {/* 9. ELECTRONIC JUNCTION HUBS & GOOGLE ACCENT NODES */}
      <g fill="#6c7c9c" className="circuit-node-pulse">
        <circle cx="560" cy="75" r="4.5" />
        <circle cx="920" cy="75" r="4.5" />
        <circle cx="1475" cy="75" r="4.5" />
        <circle cx="515" cy="765" r="4.5" />
        <circle cx="975" cy="795" r="4.5" />
        <circle cx="1495" cy="765" r="4.5" />
      </g>

      {/* Google-coloured pulsing interactive accent nodes */}
      <g className="circuit-node-pulse circuit-node-pulse--accent">
        {/* Google Blue Nodes */}
        <circle cx="955" cy="40" r="6" fill="#4285F4" filter="drop-shadow(0 0 6px #4285F4)" />
        <circle cx="1475" cy="75" r="6" fill="#4285F4" filter="drop-shadow(0 0 6px #4285F4)" />

        {/* Google Red Nodes */}
        <circle cx="560" cy="75" r="5.5" fill="#EA4335" filter="drop-shadow(0 0 6px #EA4335)" />
        <circle cx="1220" cy="110" r="5.5" fill="#EA4335" filter="drop-shadow(0 0 6px #EA4335)" />

        {/* Google Yellow Nodes */}
        <circle cx="925" cy="290" r="5" fill="#FBBC04" filter="drop-shadow(0 0 6px #FBBC04)" />
        <circle cx="1460" cy="765" r="5" fill="#FBBC04" filter="drop-shadow(0 0 6px #FBBC04)" />

        {/* Google Green Nodes */}
        <circle cx="955" cy="610" r="6" fill="#34A853" filter="drop-shadow(0 0 6px #34A853)" />
        <circle cx="515" cy="765" r="6" fill="#34A853" filter="drop-shadow(0 0 6px #34A853)" />
      </g>
    </svg>
  );
}

export default CloudCircuitBackground;
