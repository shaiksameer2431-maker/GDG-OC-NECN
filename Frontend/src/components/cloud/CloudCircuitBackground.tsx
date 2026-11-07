import React from "react";
import "./CloudChampionsScene.css";

type CloudCircuitBackgroundProps = {
  className?: string;
  /** Decorative only; does not intercept clicks. */
  opacity?: number;
};

/**
 * Fully Connected, Window-Fit Vector Circuit Background
 * Features:
 * - 100% window-width edge-to-edge highway buses (from X=0 to X=1920)
 * - Interconnected 45° chamfered branch traces and cross-bus vias
 * - Proper circular terminal connection pads at every branch endpoint (zero broken lines)
 * - Smooth flowing animated electric data pulses in Google Cloud colours
 * - Pulsing interactive junction nodes
 */
export function CloudCircuitBackground({
  className = "",
  opacity = 1,
}: CloudCircuitBackgroundProps) {
  return (
    <svg
      className={`cloud-circuit-background ${className}`}
      viewBox="0 0 1920 840"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
    >
      <defs>
        {/* Soft trace gradient fading at window extremities */}
        <linearGradient id="busGradMain" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f5d79" stopOpacity="0.48" />
          <stop offset="25%" stopColor="#677694" stopOpacity="0.32" />
          <stop offset="50%" stopColor="#5d6c8a" stopOpacity="0.26" />
          <stop offset="75%" stopColor="#677694" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#4f5d79" stopOpacity="0.48" />
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
          <stop offset="0%" stopColor="#74809a" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#74809a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. Ambient Circular Tech Hubs / Orbs */}
      <g fill="url(#circuitOrbGlow)" className="circuit-ambient-orb">
        <circle cx="80" cy="50" r="58" />
        <circle cx="1840" cy="120" r="64" />
        <circle cx="1480" cy="720" r="55" />
        <circle cx="440" cy="740" r="50" />
      </g>

      {/* 2. Fully Connected Highway Bus Traces (Edge-to-Edge: 0px to 1920px across full window) */}
      <g className="circuit-trace-base" stroke="url(#busGradMain)">
        {/* Bus 1: Top Highway (Edge to Edge) */}
        <path d="M 0 50 H 620 L 660 90 H 1260 L 1300 50 H 1920" />

        {/* Bus 2: Upper-Mid Highway (Edge to Edge with 45° focal contours) */}
        <path d="M 0 150 H 420 L 460 190 H 760 L 800 150 H 1120 L 1160 190 H 1480 L 1520 150 H 1920" />

        {/* Bus 3: Center Highway (Edge to Edge) */}
        <path d="M 0 280 H 380 L 430 330 H 680 L 720 290 H 1200 L 1240 330 H 1510 L 1560 280 H 1920" />

        {/* Bus 4: Lower-Mid Highway (Edge to Edge) */}
        <path d="M 0 450 H 520 L 560 490 H 860 L 900 450 H 1020 L 1060 490 H 1380 L 1420 450 H 1920" />

        {/* Bus 5: Bottom Highway (Edge to Edge) */}
        <path d="M 0 690 H 440 L 480 730 H 940 L 980 690 H 1440 L 1480 730 H 1920" />
      </g>

      {/* 3. Interconnecting Cross-Bus Vias & Branches (All connected, zero open ends) */}
      <g className="circuit-branch-base">
        {/* Branch A: Connects Bus 1 to Bus 2 */}
        <path d="M 660 90 V 150" />
        <path d="M 1260 90 V 150" />

        {/* Branch B: Connects Bus 2 to Bus 3 */}
        <path d="M 460 190 V 250 L 500 290 H 680" />
        <path d="M 1480 190 V 250 L 1440 290 H 1240" />

        {/* Branch C: Vertical Bridge connecting Bus 3 to Bus 4 */}
        <path d="M 720 290 V 370 L 760 410 H 860 L 900 450" />
        <path d="M 1200 290 V 370 L 1160 410 H 1060 L 1020 450" />

        {/* Branch D: Diagonal Cross Link from Bus 4 to Bus 5 */}
        <path d="M 560 490 V 570 L 600 610 H 760 L 800 650 H 940" />
        <path d="M 1380 490 V 570 L 1340 610 H 1180 L 1140 650 H 980" />

        {/* Branch E: Top-of-window feed lines */}
        <path d="M 220 0 V 30 L 240 50" />
        <path d="M 1700 0 V 30 L 1680 50" />

        {/* Branch F: Bottom-of-window feed lines */}
        <path d="M 280 840 V 810 L 300 790 H 440" />
        <path d="M 1640 840 V 810 L 1620 790 H 1480" />

        {/* Branch G: Local terminal spurs that terminate into dedicated connection pads */}
        <path d="M 380 330 L 340 370 H 260" />
        <path d="M 1560 280 L 1600 320 H 1680" />
        <path d="M 860 450 L 820 490 H 760" />
        <path d="M 1060 490 L 1100 530 H 1160" />
      </g>

      {/* 4. Active Animated Flowing Signal Streams (Continuous through-highways) */}
      <g
        className="circuit-pulse-stream"
        stroke="url(#streamGradBlue)"
        strokeWidth="1.9"
      >
        <path d="M 0 150 H 420 L 460 190 H 760 L 800 150 H 1120 L 1160 190 H 1480 L 1520 150 H 1920" />
        <path d="M 0 450 H 520 L 560 490 H 860 L 900 450 H 1020 L 1060 490 H 1380 L 1420 450 H 1920" />
      </g>

      <g
        className="circuit-pulse-stream circuit-pulse-stream--fast"
        stroke="url(#streamGradCyan)"
        strokeWidth="1.95"
      >
        <path d="M 0 280 H 380 L 430 330 H 680 L 720 290 H 1200 L 1240 330 H 1510 L 1560 280 H 1920" />
      </g>

      <g
        className="circuit-pulse-stream circuit-pulse-stream--slow"
        stroke="url(#streamGradGold)"
        strokeWidth="1.8"
      >
        <path d="M 0 50 H 620 L 660 90 H 1260 L 1300 50 H 1920" />
        <path d="M 0 690 H 440 L 480 730 H 940 L 980 690 H 1440 L 1480 730 H 1920" />
      </g>

      {/* 5. Terminal Connection Pads & Junction Rings (Ensures NO line end looks broken) */}
      <g fill="#4f5d79" opacity="0.6">
        {/* Terminal pads for spur endpoints */}
        <circle cx="260" cy="370" r="5" />
        <circle cx="1680" cy="320" r="5" />
        <circle cx="760" cy="490" r="5" />
        <circle cx="1160" cy="530" r="5" />
        <circle cx="440" cy="790" r="5" />
        <circle cx="1480" cy="790" r="5" />
      </g>
      <g fill="#ffffff" opacity="0.85">
        <circle cx="260" cy="370" r="2" />
        <circle cx="1680" cy="320" r="2" />
        <circle cx="760" cy="490" r="2" />
        <circle cx="1160" cy="530" r="2" />
        <circle cx="440" cy="790" r="2" />
        <circle cx="1480" cy="790" r="2" />
      </g>

      {/* 6. Pulsing Electronic Junction Hubs & Google-Colored Accent Nodes */}
      <g fill="#6c7c9c" className="circuit-node-pulse">
        <circle cx="660" cy="90" r="4.5" />
        <circle cx="1260" cy="90" r="4.5" />
        <circle cx="720" cy="290" r="4.5" />
        <circle cx="1200" cy="290" r="4.5" />
        <circle cx="560" cy="490" r="4.5" />
        <circle cx="1380" cy="490" r="4.5" />
      </g>

      {/* Google-colored glowing interactive accent nodes */}
      <g className="circuit-node-pulse circuit-node-pulse--accent">
        {/* Google Blue Nodes */}
        <circle cx="800" cy="150" r="6" fill="#4285F4" filter="drop-shadow(0 0 6px #4285F4)" />
        <circle cx="1520" cy="150" r="6" fill="#4285F4" filter="drop-shadow(0 0 6px #4285F4)" />

        {/* Google Red Nodes */}
        <circle cx="460" cy="190" r="5.5" fill="#EA4335" filter="drop-shadow(0 0 6px #EA4335)" />
        <circle cx="1300" cy="50" r="5.5" fill="#EA4335" filter="drop-shadow(0 0 6px #EA4335)" />

        {/* Google Yellow Nodes */}
        <circle cx="1240" cy="330" r="5" fill="#FBBC04" filter="drop-shadow(0 0 6px #FBBC04)" />
        <circle cx="430" cy="330" r="5" fill="#FBBC04" filter="drop-shadow(0 0 6px #FBBC04)" />

        {/* Google Green Nodes */}
        <circle cx="900" cy="450" r="6" fill="#34A853" filter="drop-shadow(0 0 6px #34A853)" />
        <circle cx="1480" cy="730" r="6" fill="#34A853" filter="drop-shadow(0 0 6px #34A853)" />
      </g>
    </svg>
  );
}

export default CloudCircuitBackground;
