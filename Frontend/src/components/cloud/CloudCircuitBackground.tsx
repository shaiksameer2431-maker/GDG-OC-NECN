import React from "react";
import "./CloudChampionsScene.css";

type CloudCircuitBackgroundProps = {
  className?: string;
  /** Decorative only; does not intercept clicks. */
  opacity?: number;
};

/**
 * Decorative animated circuit-line background for the hero section.
 * Features unbroken, smooth circuit traces with active flowing electrical signal streams
 * and pulsing Google Cloud junction nodes.
 */
export function CloudCircuitBackground({
  className = "",
  opacity = 1,
}: CloudCircuitBackgroundProps) {
  return (
    <svg
      className={`cloud-circuit-background ${className}`}
      viewBox="0 0 1858 830"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
    >
      <defs>
        {/* Gradients for smooth trace fading and signal glow */}
        <linearGradient id="cloudCircuitFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f5d79" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#677694" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#4f5d79" stopOpacity="0.42" />
        </linearGradient>

        <linearGradient id="streamGradientBlue" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4285F4" stopOpacity="0" />
          <stop offset="50%" stopColor="#4285F4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8AB4F8" stopOpacity="0.95" />
        </linearGradient>

        <linearGradient id="streamGradientCyan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
          <stop offset="60%" stopColor="#00E5FF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="streamGradientGold" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FBBC04" stopOpacity="0" />
          <stop offset="50%" stopColor="#FBBC04" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFE082" stopOpacity="0.95" />
        </linearGradient>

        <radialGradient id="cloudCircuitOrb">
          <stop offset="0%" stopColor="#74809a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#74809a" stopOpacity="0.04" />
        </radialGradient>
      </defs>

      {/* 1. Soft circular ambient nodes / radar rings */}
      <g fill="url(#cloudCircuitOrb)" className="circuit-ambient-orb">
        <circle cx="62" cy="30" r="52" />
        <circle cx="24" cy="568" r="39" />
        <circle cx="1555" cy="115" r="52" />
        <circle cx="1734" cy="113" r="42" />
        <circle cx="1647" cy="420" r="24" />
        <circle cx="1360" cy="682" r="50" />
        <circle cx="381" cy="252" r="23" />
      </g>

      {/* 2. Base Circuit Traces (Smooth, continuous, unbroken lines - NO broken dashes) */}
      <g className="circuit-trace-base">
        <path d="M0 38 H575 L615 0 H1515" />
        <path d="M0 118 H376 L418 160 H560" />
        <path d="M0 168 H566 L620 222 H785" />
        <path d="M0 238 H365 L409 282 H682" />
        <path d="M0 298 H380 L422 340 H804" />
        <path d="M0 408 H570 L615 452 H928" />
        <path d="M0 456 H535 L582 409 H930" />
        <path d="M0 644 H390 L430 684 H625" />
        <path d="M0 786 H450 L490 830" />
        <path d="M1135 102 H1515 L1560 148 H1858" />
        <path d="M1135 188 H1515 L1560 232 H1858" />
        <path d="M1055 274 H1448 L1492 318 H1858" />
        <path d="M1120 342 H1450 L1490 384 H1858" />
        <path d="M1090 456 H1430 L1472 498 H1858" />
        <path d="M1218 576 H1500 L1545 620 H1858" />
        <path d="M1235 748 H1668 L1712 792 H1858" />
        <path d="M1018 8 H1504" />
      </g>

      {/* 3. Base Angled Branches (Continuous, unbroken clean traces) */}
      <g className="circuit-branch-base">
        <path d="M568 0 L600 0 L630 -32" />
        <path d="M568 168 L625 225 L625 272" />
        <path d="M405 238 L470 302 L470 354" />
        <path d="M1230 0 L1288 58 L1288 100" />
        <path d="M1518 102 L1570 154 L1570 214" />
        <path d="M1350 0 L1400 52 L1400 96" />
        <path d="M1360 638 L1308 690 L1308 748" />
        <path d="M1668 748 L1720 800 L1720 830" />
        <path d="M580 644 L625 690 L625 744" />
        <path d="M440 786 L488 738 L488 684" />
      </g>

      {/* 4. Active Animated Signal Streams (Flowing Electric Pulses along the circuit lines) */}
      <g
        className="circuit-pulse-stream"
        stroke="url(#streamGradientBlue)"
        strokeWidth="1.85"
      >
        <path d="M0 118 H376 L418 160 H560" />
        <path d="M0 298 H380 L422 340 H804" />
        <path d="M0 456 H535 L582 409 H930" />
        <path d="M1135 102 H1515 L1560 148 H1858" />
        <path d="M1055 274 H1448 L1492 318 H1858" />
        <path d="M1218 576 H1500 L1545 620 H1858" />
      </g>

      <g
        className="circuit-pulse-stream circuit-pulse-stream--fast"
        stroke="url(#streamGradientCyan)"
        strokeWidth="1.9"
      >
        <path d="M0 38 H575 L615 0 H1515" />
        <path d="M0 238 H365 L409 282 H682" />
        <path d="M0 644 H390 L430 684 H625" />
        <path d="M1120 342 H1450 L1490 384 H1858" />
        <path d="M1235 748 H1668 L1712 792 H1858" />
      </g>

      <g
        className="circuit-pulse-stream circuit-pulse-stream--slow"
        stroke="url(#streamGradientGold)"
        strokeWidth="1.75"
      >
        <path d="M0 168 H566 L620 222 H785" />
        <path d="M0 408 H570 L615 452 H928" />
        <path d="M1135 188 H1515 L1560 232 H1858" />
        <path d="M1090 456 H1430 L1472 498 H1858" />
      </g>

      {/* 5. Pulsing Connection Nodes & Google-colored Terminal Accents */}
      <g fill="#6c7c9c" className="circuit-node-pulse">
        <circle cx="684" cy="292" r="3.5" />
        <circle cx="798" cy="315" r="4.5" />
        <circle cx="812" cy="323" r="3.5" />
        <circle cx="1026" cy="274" r="3.5" />
        <circle cx="1705" cy="516" r="3.5" />
        <circle cx="1571" cy="726" r="3" />
        <circle cx="835" cy="535" r="3.8" />
      </g>

      <g fill="#6c7c9c" className="circuit-node-pulse circuit-node-pulse--alt">
        <circle cx="1728" cy="353" r="5" />
        <circle cx="1518" cy="99" r="5" />
        <circle cx="1572" cy="102" r="3" />
      </g>

      {/* Google-colored glowing interactive accent nodes */}
      <g className="circuit-node-pulse circuit-node-pulse--accent">
        {/* Google Blue Node */}
        <circle cx="604" cy="230" r="6" fill="#4285F4" filter="drop-shadow(0 0 6px #4285F4)" />
        {/* Google Red Node */}
        <circle cx="928" cy="385" r="5.5" fill="#EA4335" filter="drop-shadow(0 0 6px #EA4335)" />
        {/* Google Yellow Node */}
        <circle cx="1452" cy="342" r="5" fill="#FBBC04" filter="drop-shadow(0 0 6px #FBBC04)" />
        {/* Google Green Node */}
        <circle cx="1560" cy="189" r="6" fill="#34A853" filter="drop-shadow(0 0 6px #34A853)" />
      </g>
    </svg>
  );
}

export default CloudCircuitBackground;
