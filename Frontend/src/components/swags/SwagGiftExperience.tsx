import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import './SwagGiftExperience.css';

export type SwagId = 'tee' | 'bottle' | 'certificate' | 'stickers';

export interface SwagInfo {
  id: SwagId;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  specs: string[];
}

export const SWAGS: SwagInfo[] = [
  {
    id: 'tee',
    name: 'GDG On Campus NECN T-Shirt',
    badge: 'PREMIUM COTTON APPAREL',
    subtitle: 'Wear the community · 240 GSM Combed Cotton',
    description:
      'Engineered with heavy-weight premium cotton, reinforced ribbed crew collar, and breathable weave. Features the iconic Google Developer Groups angle brackets emblem, Narayana Engineering College chapter insignia, and signature Google quad-color accent stripe.',
    specs: ['240 GSM Combed Bio-Washed Cotton', 'High-density screen print with woven neck tag', 'Double-stitched sleeve hems & ribbed collar']
  },
  {
    id: 'bottle',
    name: 'Google Cloud Matte Water Bottle',
    badge: 'INSULATED STAINLESS STEEL',
    subtitle: 'Carry your momentum · Brushed Steel Cap with Carry Loop',
    description:
      'Double-walled vacuum insulated stainless steel bottle with luxury satin matte-black coating. Features laser-precise GDG On Campus NECN insignia, brushed surgical-grade stainless steel cap with integrated utility carry loop, and signature quad-color base stripe.',
    specs: ['750ml Double-Wall Vacuum Insulation', '304 Surgical Grade Stainless Steel', 'Brushed steel leak-proof cap with ergonomic loop']
  },
  {
    id: 'certificate',
    name: 'Official Certificate of Participation',
    badge: 'ACCREDITED MERIT DOCUMENT',
    subtitle: 'Celebrate your achievement · Google Cloud Learn with Communities 2026',
    description:
      'Printed on 350 GSM archival textured ivory cardstock with embossed gold-foil inner frame, Google quad-color corner arcs, and commemorative gold laurel wreath medallion with official Google Cloud seal for the 2026 cohort at Narayana Engineering College, Nellore.',
    specs: ['350 GSM Archival Textured Ivory Cardstock', 'Gold-foil debossed borders & Google corner swooshes', 'Official GDG On Campus NECN & Google Cloud seal']
  },
  {
    id: 'stickers',
    name: "Collector's Vinyl Stickers Pack",
    badge: 'WATERPROOF DIE-CUT DECALS',
    subtitle: '5 Custom Die-Cut Vinyl Decals · Gloss Finish',
    description:
      'Set of 5 premium waterproof die-cut vinyl stickers with scratch-resistant high-gloss UV clearcoat and clean white border die-cut. Includes the GDG Chapter Shield, Google Cloud multicolor cloud, Google G emblem, Terminal Code </> badge, and Cloud Server node sticker.',
    specs: ['5 Individual Die-Cut Decals with White Vinyl Borders', 'UV-resistant weatherproof gloss clearcoat', 'Easy-peel adhesive suitable for laptops & dev machines']
  }
];

const G_BLUE = '#4285F4';
const G_RED = '#EA4335';
const G_YELLOW = '#FBBC04';
const G_GREEN = '#34A853';

export const SwagGiftExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSwag, setSelectedSwag] = useState<SwagInfo | null>(null);
  const [hoveredSwagId, setHoveredSwagId] = useState<SwagId | null>(null);

  // References for Three.js state machine
  const stateRef = useRef({
    isOpen: false,
    selectedId: null as SwagId | null,
    targetOpenT: 0,
    currentOpenT: 0,
    itemElevations: {
      tee: 0,
      bottle: 0,
      certificate: 0,
      stickers: 0
    }
  });

  // Texture generator helpers
  const drawGdgBrackets = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const s = size;
    const lw = s * 0.28;
    const len = s * 0.58;
    ctx.save();
    ctx.translate(x, y);
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Left bracket < (Red top, Blue bottom)
    ctx.strokeStyle = G_RED;
    ctx.beginPath();
    ctx.moveTo(-s * 0.08, -len);
    ctx.lineTo(-s * 0.55, 0);
    ctx.stroke();

    ctx.strokeStyle = G_BLUE;
    ctx.beginPath();
    ctx.moveTo(-s * 0.55, 0);
    ctx.lineTo(-s * 0.08, len);
    ctx.stroke();

    // Right bracket > (Green top, Yellow bottom)
    ctx.strokeStyle = G_GREEN;
    ctx.beginPath();
    ctx.moveTo(s * 0.08, -len);
    ctx.lineTo(s * 0.55, 0);
    ctx.stroke();

    ctx.strokeStyle = G_YELLOW;
    ctx.beginPath();
    ctx.moveTo(s * 0.55, 0);
    ctx.lineTo(s * 0.08, len);
    ctx.stroke();

    ctx.restore();
  }, []);

  // 1. Lid Texture
  const createLidTexture = useCallback(() => {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 2048;
    const ctx = c.getContext('2d')!;

    // Deep matte black background
    ctx.fillStyle = '#101115';
    ctx.fillRect(0, 0, 2048, 2048);

    const g = ctx.createRadialGradient(1024, 1024, 400, 1024, 1024, 1300);
    g.addColorStop(0, '#17181f');
    g.addColorStop(1, '#0b0c0f');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 2048, 2048);

    // Corner Graphic Swooshes matching Image 3 precisely
    // Top-left: Red (outer) and Blue (inner)
    ctx.lineWidth = 56;
    ctx.strokeStyle = G_RED;
    ctx.beginPath();
    ctx.arc(0, 0, 460, 0, Math.PI * 0.5);
    ctx.stroke();

    ctx.lineWidth = 44;
    ctx.strokeStyle = G_BLUE;
    ctx.beginPath();
    ctx.arc(0, 0, 360, 0, Math.PI * 0.5);
    ctx.stroke();

    // Bottom-right: Green (outer) and Yellow (inner)
    ctx.lineWidth = 56;
    ctx.strokeStyle = G_GREEN;
    ctx.beginPath();
    ctx.arc(2048, 2048, 540, Math.PI, Math.PI * 1.5);
    ctx.stroke();

    ctx.lineWidth = 44;
    ctx.strokeStyle = G_YELLOW;
    ctx.beginPath();
    ctx.arc(2048, 2048, 440, Math.PI, Math.PI * 1.5);
    ctx.stroke();

    // Center Branding
    drawGdgBrackets(ctx, 1024, 480, 260);

    // GDG ON CAMPUS
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 96px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GDG ON CAMPUS', 1024, 690);

    // NECN
    ctx.font = '900 130px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('NECN', 1024, 830);

    // — SWAGS — with quad-color border pill
    const pillW = 540;
    const pillH = 110;
    const pillX = 1024 - pillW / 2;
    const pillY = 930;

    // Side rules
    ctx.strokeStyle = '#484d5c';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(pillX - 110, pillY + pillH / 2);
    ctx.lineTo(pillX - 25, pillY + pillH / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pillX + pillW + 25, pillY + pillH / 2);
    ctx.lineTo(pillX + pillW + 110, pillY + pillH / 2);
    ctx.stroke();

    // Pill gradient border
    const pGrad = ctx.createLinearGradient(pillX, pillY, pillX + pillW, pillY + pillH);
    pGrad.addColorStop(0, G_BLUE);
    pGrad.addColorStop(0.33, G_RED);
    pGrad.addColorStop(0.66, G_YELLOW);
    pGrad.addColorStop(1, G_GREEN);

    ctx.strokeStyle = pGrad;
    ctx.lineWidth = 9;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(pillX, pillY, pillW, pillH, 55);
    } else {
      ctx.strokeRect(pillX, pillY, pillW, pillH);
    }
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 70px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('SWAGS', 1024, pillY + pillH / 2 + 3);

    // Architectural Line Art of NECN Campus Building (Silver / Grey wireframe)
    ctx.save();
    ctx.translate(1024, 1480);
    ctx.strokeStyle = '#5a6173';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Base podium & steps
    ctx.strokeRect(-560, 110, 1120, 26);
    ctx.strokeRect(-520, 85, 1040, 25);

    // Main central block
    ctx.strokeRect(-270, -110, 540, 195);
    // Left wing
    ctx.strokeRect(-540, -80, 270, 165);
    // Right wing
    ctx.strokeRect(270, -80, 270, 165);

    // Pediment triangle on central block
    ctx.beginPath();
    ctx.moveTo(-280, -110);
    ctx.lineTo(0, -200);
    ctx.lineTo(280, -110);
    ctx.closePath();
    ctx.stroke();

    // Colonnade pillars in center
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue;
      ctx.beginPath();
      ctx.moveTo(i * 54, -110);
      ctx.lineTo(i * 54, 85);
      ctx.stroke();
    }

    // Windows left wing
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.strokeRect(-510 + c * 80, -60 + r * 70, 50, 50);
      }
    }
    // Windows right wing
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.strokeRect(300 + c * 80, -60 + r * 70, 50, 50);
      }
    }

    // Center rooftop flagpole & waving flag
    ctx.beginPath();
    ctx.moveTo(0, -200);
    ctx.lineTo(0, -275);
    ctx.stroke();

    ctx.fillStyle = '#5a6173';
    ctx.beginPath();
    ctx.moveTo(0, -275);
    ctx.lineTo(70, -258);
    ctx.lineTo(0, -240);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    return new THREE.CanvasTexture(c);
  }, [drawGdgBrackets]);

  // 2a. Woven Neck Label Texture (Inside Neck Tag matching Reference Image 3)
  const createNeckTagTexture = useCallback(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 320;
    const ctx = c.getContext('2d')!;

    // Deep black woven cloth base
    ctx.fillStyle = '#0c0d12';
    ctx.fillRect(0, 0, 512, 320);

    // Fine woven textile weave
    for (let x = 0; x < 512; x += 4) {
      ctx.fillStyle = x % 8 === 0 ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.15)';
      ctx.fillRect(x, 0, 2, 320);
    }
    for (let y = 0; y < 320; y += 4) {
      ctx.fillStyle = y % 8 === 0 ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, y, 512, 2);
    }

    // Stitched perimeter line
    ctx.strokeStyle = '#383d4e';
    ctx.lineWidth = 4;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(12, 12, 488, 296);
    ctx.setLineDash([]);

    // Official GDG brackets logo on woven label
    drawGdgBrackets(ctx, 256, 115, 110);

    // Micro text
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '900 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('GDG ON CAMPUS', 256, 215);

    ctx.fillStyle = '#A4ACBF';
    ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('NECN · 100% COTTON · M', 256, 258);

    return new THREE.CanvasTexture(c);
  }, [drawGdgBrackets]);

  // 2b. Collar Ribbing Texture (Knitted 1x1 crewneck collar ribs)
  const createCollarRibbingTexture = useCallback(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = '#1a1b24';
    ctx.fillRect(0, 0, 512, 128);

    // Repeating knitted vertical rib lines
    for (let x = 0; x < 512; x += 6) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(x, 0, 2, 128);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(x + 2, 0, 2, 128);
    }

    const t = new THREE.CanvasTexture(c);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(16, 1);
    return t;
  }, []);

  // 2c. Folded T-Shirt Front Fabric & Chest Branding Texture (2048x2048 high fidelity)
  const createTShirtTexture = useCallback(() => {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 2048;
    const ctx = c.getContext('2d')!;

    // Deep matte black jersey cotton matching Reference Image 3
    ctx.fillStyle = '#181920';
    ctx.fillRect(0, 0, 2048, 2048);

    // Subtle 2D combed cotton knit micro-texture
    for (let y = 0; y < 2048; y += 4) {
      const alpha = Math.sin(y * 0.15) * 0.015 + 0.018;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(0, y, 2048, 1.5);
    }
    for (let x = 0; x < 2048; x += 4) {
      const alpha = Math.cos(x * 0.15) * 0.015 + 0.018;
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 2.2})`;
      ctx.fillRect(x, 0, 1.5, 2048);
    }
    // Organic textile flecks
    for (let i = 0; i < 35000; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.04)';
      ctx.fillRect(Math.random() * 2048, Math.random() * 2048, 2, 2);
    }

    // Natural fabric drape & crease shading (matching physical folded garment in Image 3)
    // 1. Crewneck opening drape shadow
    const neckGrad = ctx.createRadialGradient(1024, 250, 100, 1024, 250, 440);
    neckGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    neckGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.22)');
    neckGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = neckGrad;
    ctx.beginPath();
    ctx.ellipse(1024, 250, 440, 260, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Diagonal soft drape folds radiating from collar to armpit/sides
    const drawFold = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, w: number) => {
      ctx.save();
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      // Shadow valley
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.14)';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cx, cy, x2, y2);
      ctx.stroke();
      // Highlight crest
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.026)';
      ctx.beginPath();
      ctx.moveTo(x1, y1 - 4);
      ctx.quadraticCurveTo(cx, cy - 4, x2, y2 - 4);
      ctx.stroke();
      ctx.restore();
    };

    // Left chest drapes
    drawFold(650, 360, 480, 680, 320, 1050, 40);
    drawFold(760, 400, 560, 800, 400, 1350, 30);
    // Right chest soft drapes (under chest print)
    drawFold(1380, 360, 1550, 640, 1720, 920, 32);
    // Lower horizontal body fold (bottom tuck)
    drawFold(250, 1680, 1024, 1695, 1800, 1680, 45);

    // Left & Right sleeve seam fold shadows
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fillRect(0, 0, 90, 2048);
    ctx.fillRect(1958, 0, 90, 2048);

    // --- CHEST PRINT (Right chest of folded tee, exactly matching Reference Image 3) ---
    const chestX = 1420;
    const chestY = 980;

    // Brackets Logo
    drawGdgBrackets(ctx, chestX, chestY - 140, 280);

    // "GDG"
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '900 132px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('GDG', chestX, chestY + 55);

    // "On Campus"
    ctx.font = '700 78px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('On Campus', chestX, chestY + 165);

    // "NECN"
    ctx.font = '900 96px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('NECN', chestX, chestY + 280);

    // Quad-color Underline Bar (Blue, Red, Yellow, Green)
    const barW = 410;
    const barH = 28;
    const barX = chestX - barW / 2;
    const barY = chestY + 345;
    const segW = barW / 4;
    [G_BLUE, G_RED, G_YELLOW, G_GREEN].forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(barX + idx * segW, barY, segW, barH);
    });

    return new THREE.CanvasTexture(c);
  }, [drawGdgBrackets]);

  // 3. Water Bottle Decal Texture
  const createBottleTexture = useCallback(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d')!;

    ctx.clearRect(0, 0, 1024, 1024);

    drawGdgBrackets(ctx, 512, 360, 160);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '900 90px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('GDG', 512, 480);

    ctx.font = '700 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('On Campus', 512, 550);

    ctx.font = '900 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('NECN', 512, 625);

    // Quad color base stripe
    const barW = 500;
    const barH = 26;
    const barX = 512 - barW / 2;
    const barY = 880;
    const segW = barW / 4;
    [G_BLUE, G_RED, G_YELLOW, G_GREEN].forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(barX + idx * segW, barY, segW, barH);
    });

    return new THREE.CanvasTexture(c);
  }, [drawGdgBrackets]);

  // 4. Certificate Texture
  const createCertificateTexture = useCallback(() => {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 1400;
    const ctx = c.getContext('2d')!;

    // Background premium ivory parchment
    ctx.fillStyle = '#FBF8EE';
    ctx.fillRect(0, 0, 2048, 1400);

    // Border lines
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 14;
    ctx.strokeRect(50, 50, 1948, 1300);

    ctx.strokeStyle = '#1A2A4E';
    ctx.lineWidth = 5;
    ctx.strokeRect(80, 80, 1888, 1240);

    // Corner swooshes in Google colors
    // Top-left (Blue)
    ctx.strokeStyle = G_BLUE;
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(50, 240);
    ctx.lineTo(50, 50);
    ctx.lineTo(240, 50);
    ctx.stroke();

    // Top-right (Red)
    ctx.strokeStyle = G_RED;
    ctx.beginPath();
    ctx.moveTo(1808, 50);
    ctx.lineTo(1998, 50);
    ctx.lineTo(1998, 240);
    ctx.stroke();

    // Bottom-left (Green)
    ctx.strokeStyle = G_GREEN;
    ctx.beginPath();
    ctx.moveTo(50, 1160);
    ctx.lineTo(50, 1350);
    ctx.lineTo(240, 1350);
    ctx.stroke();

    // Bottom-right (Yellow)
    ctx.strokeStyle = G_YELLOW;
    ctx.beginPath();
    ctx.moveTo(1808, 1350);
    ctx.lineTo(1998, 1350);
    ctx.lineTo(1998, 1160);
    ctx.stroke();

    // Header: < > GDG On Campus - NECN
    drawGdgBrackets(ctx, 910, 200, 76);
    ctx.fillStyle = '#1A2A4E';
    ctx.font = '800 56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('GDG On Campus', 980, 190);
    ctx.font = '600 40px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#5A657A';
    ctx.fillText('— NECN —', 980, 235);

    // Main Title: Certificate of Participation
    ctx.fillStyle = '#111827';
    ctx.textAlign = 'center';
    ctx.font = '900 96px Georgia, serif';
    ctx.fillText('Certificate of Participation', 1024, 460);

    // Subtitle
    ctx.fillStyle = '#374151';
    ctx.font = '700 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Google Cloud Learn with Communities 2026', 1024, 580);

    // Divider line
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(540, 650);
    ctx.lineTo(1508, 650);
    ctx.stroke();

    // Center Google Cloud Logo + Laurel Wreath
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(890, 920, 140, Math.PI * 0.4, Math.PI * 1.6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(1158, 920, 140, -Math.PI * 0.6, Math.PI * 0.6);
    ctx.stroke();

    // Google Cloud Logo mark in center
    ctx.fillStyle = G_RED;
    ctx.beginPath();
    ctx.arc(985, 910, 56, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = G_BLUE;
    ctx.beginPath();
    ctx.arc(1055, 870, 68, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = G_GREEN;
    ctx.beginPath();
    ctx.arc(1115, 920, 50, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = G_YELLOW;
    ctx.beginPath();
    ctx.arc(1030, 930, 44, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FBF8EE';
    ctx.beginPath();
    ctx.arc(1040, 908, 36, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(c);
  }, [drawGdgBrackets]);

  // 5. Sticker Textures
  const createStickerTexture = useCallback((type: 'gdg_shield' | 'cloud' | 'google_g' | 'code' | 'cloud_server') => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, 512, 512);

    if (type === 'gdg_shield') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(35, 35, 442, 442, 75);
      else ctx.rect(35, 35, 442, 442);
      ctx.fill();
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#E2E8F0';
      ctx.stroke();

      drawGdgBrackets(ctx, 256, 195, 145);
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 58px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GDG', 256, 310);
      ctx.font = '700 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('On Campus', 256, 355);
      ctx.font = '900 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('NECN', 256, 405);
    } else if (type === 'cloud') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(210, 240, 115, 0, Math.PI * 2);
      ctx.arc(310, 215, 135, 0, Math.PI * 2);
      ctx.arc(400, 280, 105, 0, Math.PI * 2);
      ctx.arc(150, 305, 85, 0, Math.PI * 2);
      ctx.fillRect(140, 280, 270, 115);
      ctx.fill();

      ctx.fillStyle = G_RED;
      ctx.beginPath();
      ctx.arc(220, 250, 90, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = G_BLUE;
      ctx.beginPath();
      ctx.arc(310, 225, 105, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = G_GREEN;
      ctx.beginPath();
      ctx.arc(380, 280, 85, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = G_YELLOW;
      ctx.beginPath();
      ctx.arc(270, 315, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(290, 280, 58, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'google_g') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(256, 256, 220, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#E2E8F0';
      ctx.stroke();

      const cx = 256;
      const cy = 256;
      const r = 145;
      const lw = 52;
      ctx.lineWidth = lw;
      ctx.fillStyle = G_BLUE;
      ctx.fillRect(cx, cy - lw / 2, r, lw);
      ctx.strokeStyle = G_RED;
      ctx.beginPath();
      ctx.arc(cx, cy, r - lw / 2, -Math.PI * 0.75, 0);
      ctx.stroke();
      ctx.strokeStyle = G_YELLOW;
      ctx.beginPath();
      ctx.arc(cx, cy, r - lw / 2, Math.PI * 0.5, Math.PI * 1.25);
      ctx.stroke();
      ctx.strokeStyle = G_GREEN;
      ctx.beginPath();
      ctx.arc(cx, cy, r - lw / 2, 0, Math.PI * 0.5);
      ctx.stroke();
    } else if (type === 'code') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(50, 95, 412, 322, 60);
      else ctx.rect(50, 95, 412, 322);
      ctx.fill();
      ctx.lineWidth = 14;
      ctx.strokeStyle = G_GREEN;
      ctx.stroke();

      ctx.fillStyle = G_GREEN;
      ctx.font = '900 145px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('</>', 256, 256);
    } else if (type === 'cloud_server') {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(50, 95, 412, 322, 60);
      else ctx.rect(50, 95, 412, 322);
      ctx.fill();
      ctx.lineWidth = 14;
      ctx.strokeStyle = G_BLUE;
      ctx.stroke();

      ctx.fillStyle = G_BLUE;
      ctx.font = '900 95px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('☁', 256, 205);
      ctx.fillRect(150, 260, 212, 24);
      ctx.fillRect(150, 294, 212, 24);
      ctx.fillRect(150, 328, 212, 24);
    }

    return new THREE.CanvasTexture(c);
  }, [drawGdgBrackets]);

  // Main Three.js Scene Setup & Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth;
    let height = container.clientHeight || 750;

    const scene = new THREE.Scene();
    const isMobile = width < 768;

    let targetCamY = isMobile ? 23.5 : 15.0;
    let targetCamZ = isMobile ? 19.5 : 12.5;
    let targetCamX = isMobile ? 0.8 : 0.6;
    let targetLookX = isMobile ? 0.8 : 0.6;

    const camera = new THREE.PerspectiveCamera(isMobile ? 48 : 38, width / height, 0.1, 100);
    camera.position.set(targetCamX, targetCamY, targetCamZ);
    camera.lookAt(targetLookX, 0, 0.4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.88);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.25);
    keyLight.position.set(8, 20, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Studio overhead soft light to evenly illuminate all 4 compartments
    const studioFill = new THREE.DirectionalLight(0xffffff, 0.72);
    studioFill.position.set(-4, 16, 8);
    scene.add(studioFill);

    const fillLight = new THREE.DirectionalLight(0xdde8ff, 0.45);
    fillLight.position.set(-12, 12, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
    rimLight.position.set(0, 4, -12);
    scene.add(rimLight);

    // Floor contact shadow receiver
    const groundGeo = new THREE.PlaneGeometry(40, 40);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Master Box Group
    const boxGroup = new THREE.Group();
    scene.add(boxGroup);

    const boxW = 8.6;
    const boxD = 8.6;
    const boxH = 1.45;
    const wallThick = 0.22;

    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x111216,
      roughness: 0.85,
      metalness: 0.08
    });
    const foamMat = new THREE.MeshStandardMaterial({
      color: 0x16181f,
      roughness: 0.95,
      metalness: 0.02
    });

    // Box outer base floor
    const baseFloor = new THREE.Mesh(new THREE.BoxGeometry(boxW, 0.15, boxD), boxMat);
    baseFloor.position.y = -0.9;
    baseFloor.castShadow = true;
    baseFloor.receiveShadow = true;
    boxGroup.add(baseFloor);

    // 4 Outer walls
    const wallN = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, wallThick), boxMat);
    wallN.position.set(0, -0.2, -boxD / 2 + wallThick / 2);
    wallN.castShadow = true;
    boxGroup.add(wallN);

    const wallS = new THREE.Mesh(new THREE.BoxGeometry(boxW, boxH, wallThick), boxMat);
    wallS.position.set(0, -0.2, boxD / 2 - wallThick / 2);
    wallS.castShadow = true;
    boxGroup.add(wallS);

    const wallW = new THREE.Mesh(new THREE.BoxGeometry(wallThick, boxH, boxD - wallThick * 2), boxMat);
    wallW.position.set(-boxW / 2 + wallThick / 2, -0.2, 0);
    wallW.castShadow = true;
    boxGroup.add(wallW);

    const wallE = new THREE.Mesh(new THREE.BoxGeometry(wallThick, boxH, boxD - wallThick * 2), boxMat);
    wallE.position.set(boxW / 2 - wallThick / 2, -0.2, 0);
    wallE.castShadow = true;
    boxGroup.add(wallE);

    // Foam Insert Tray (Custom molded compartments)
    const foamFloor = new THREE.Mesh(new THREE.BoxGeometry(boxW - wallThick * 2, 0.55, boxD - wallThick * 2), foamMat);
    foamFloor.position.y = -0.62;
    foamFloor.receiveShadow = true;
    boxGroup.add(foamFloor);

    // Foam Dividers
    const hDiv = new THREE.Mesh(new THREE.BoxGeometry(boxW - wallThick * 2, 0.35, 0.22), foamMat);
    hDiv.position.set(0, -0.2, 0.1);
    boxGroup.add(hDiv);

    const vDivTop = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 3.8), foamMat);
    vDivTop.position.set(1.5, -0.2, -1.9);
    boxGroup.add(vDivTop);

    const vDivBot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.35, 3.8), foamMat);
    vDivBot.position.set(0.1, -0.2, 2.1);
    boxGroup.add(vDivBot);

    // Interactive clickable meshes array for raycaster
    const interactiveObjects: THREE.Object3D[] = [];

    // --- SWAG ITEM 1: REALISTIC FOLDED GDG T-SHIRT (Top-Left, matching Reference Image 3) ---
    const tshirtGroup = new THREE.Group();
    tshirtGroup.userData = { swagId: 'tee', homePos: new THREE.Vector3(-1.85, -0.25, -1.9), homeRot: new THREE.Euler(0, 0, 0) };
    tshirtGroup.position.copy(tshirtGroup.userData.homePos);

    // 1. Folded Cotton Body Base (Soft matte black jersey cotton)
    const tsBaseMat = new THREE.MeshStandardMaterial({
      color: 0x14151a,
      roughness: 0.94,
      metalness: 0.02
    });
    const tsMesh = new THREE.Mesh(new THREE.BoxGeometry(4.25, 0.40, 3.65), tsBaseMat);
    tsMesh.castShadow = true;
    tsMesh.receiveShadow = true;
    tshirtGroup.add(tsMesh);

    // 2. Folded Left Sleeve Roll (Rounded side contour)
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.45, 16), tsBaseMat);
    sleeveL.rotation.x = Math.PI / 2;
    sleeveL.position.set(-2.05, 0.02, 0);
    sleeveL.castShadow = true;
    tshirtGroup.add(sleeveL);

    // 3. Folded Right Sleeve Roll (Rounded side contour)
    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.45, 16), tsBaseMat);
    sleeveR.rotation.x = Math.PI / 2;
    sleeveR.position.set(2.05, 0.02, 0);
    sleeveR.castShadow = true;
    tshirtGroup.add(sleeveR);

    // 4. Folded Bottom Hem Roll (Double layer folded hem)
    const hemBottom = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.0, 16), tsBaseMat);
    hemBottom.rotation.z = Math.PI / 2;
    hemBottom.position.set(0, 0.02, 1.74);
    hemBottom.castShadow = true;
    tshirtGroup.add(hemBottom);

    // 5. Folded Shoulder Seam Roll (Top shoulder line)
    const hemTop = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 4.0, 16), tsBaseMat);
    hemTop.rotation.z = Math.PI / 2;
    hemTop.position.set(0, 0.02, -1.74);
    hemTop.castShadow = true;
    tshirtGroup.add(hemTop);

    // 6. Front Chest Surface Plane (High-Res 2048 Texture with fabric folds & chest print)
    const tsTopGeo = new THREE.PlaneGeometry(4.2, 3.6);
    const tsTopMat = new THREE.MeshStandardMaterial({
      map: createTShirtTexture(),
      roughness: 0.92,
      metalness: 0.02
    });
    const tsTop = new THREE.Mesh(tsTopGeo, tsTopMat);
    tsTop.rotation.x = -Math.PI / 2;
    tsTop.position.y = 0.21;
    tshirtGroup.add(tsTop);

    // 7. Recessed Neck Cavity / Inner Back Neck Plane (Real 3D physical depth)
    const neckWellGeo = new THREE.PlaneGeometry(1.4, 0.82);
    const neckWellMat = new THREE.MeshStandardMaterial({
      color: 0x0a0b0e,
      roughness: 0.98
    });
    const neckWell = new THREE.Mesh(neckWellGeo, neckWellMat);
    neckWell.rotation.x = -Math.PI / 2;
    neckWell.position.set(0, 0.12, -1.35);
    tshirtGroup.add(neckWell);

    // 8. Woven Brand Tag sewn inside the neck opening (matching Reference Image 3)
    const neckTagGeo = new THREE.PlaneGeometry(0.85, 0.52);
    const neckTagMat = new THREE.MeshStandardMaterial({
      map: createNeckTagTexture(),
      roughness: 0.94,
      metalness: 0.02
    });
    const neckTag = new THREE.Mesh(neckTagGeo, neckTagMat);
    neckTag.rotation.x = -Math.PI / 2;
    neckTag.position.set(0, 0.13, -1.35);
    tshirtGroup.add(neckTag);

    // 9. 3D Ribbed Crewneck Collar Trim (Curving down into chest)
    const collarGeo = new THREE.TorusGeometry(0.72, 0.13, 16, 48, Math.PI * 0.96);
    const collarMat = new THREE.MeshStandardMaterial({
      map: createCollarRibbingTexture(),
      color: 0x181a24,
      roughness: 0.94,
      metalness: 0.02
    });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.rotation.z = 0;
    collarMesh.position.set(0, 0.22, -1.72);
    collarMesh.castShadow = true;
    tshirtGroup.add(collarMesh);

    // 10. Outer Collar Stitching Ring
    const collarStitchGeo = new THREE.TorusGeometry(0.84, 0.035, 8, 48, Math.PI * 0.96);
    const collarStitchMat = new THREE.MeshStandardMaterial({ color: 0x222634, roughness: 0.95 });
    const collarStitch = new THREE.Mesh(collarStitchGeo, collarStitchMat);
    collarStitch.rotation.x = Math.PI / 2;
    collarStitch.rotation.z = 0;
    collarStitch.position.set(0, 0.215, -1.72);
    tshirtGroup.add(collarStitch);

    // Hit test target for raycasting
    [tsMesh, tsTop, collarMesh, sleeveL, sleeveR, neckTag].forEach((m) => {
      m.userData = { parentGroup: tshirtGroup, swagId: 'tee' };
      interactiveObjects.push(m);
    });

    boxGroup.add(tshirtGroup);

    // --- SWAG ITEM 2: WATER BOTTLE (Top-Right) ---
    const bottleGroup = new THREE.Group();
    bottleGroup.userData = { swagId: 'bottle', homePos: new THREE.Vector3(2.8, -0.32, -1.9), homeRot: new THREE.Euler(0, 0, 0) };
    bottleGroup.position.copy(bottleGroup.userData.homePos);

    const bBodyGeo = new THREE.CylinderGeometry(0.56, 0.56, 2.6, 48);
    const bBodyMat = new THREE.MeshStandardMaterial({
      color: 0x121418,
      roughness: 0.38,
      metalness: 0.16
    });
    const bBody = new THREE.Mesh(bBodyGeo, bBodyMat);
    bBody.rotation.x = Math.PI / 2;
    bBody.position.set(0, 0, 0.4);
    bBody.castShadow = true;
    bottleGroup.add(bBody);

    const bDecalGeo = new THREE.PlaneGeometry(0.92, 2.3);
    const bDecalMat = new THREE.MeshBasicMaterial({
      map: createBottleTexture(),
      transparent: true,
      depthWrite: false
    });
    const bDecal = new THREE.Mesh(bDecalGeo, bDecalMat);
    bDecal.rotation.x = -Math.PI / 2;
    bDecal.position.set(0, 0.57, 0.4);
    bottleGroup.add(bDecal);

    const steelMat = new THREE.MeshStandardMaterial({ color: 0xf0f4fc, roughness: 0.15, metalness: 0.95 });

    const bNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.52, 0.3, 32), steelMat);
    bNeck.rotation.x = Math.PI / 2;
    bNeck.position.set(0, 0, -1.05);
    bottleGroup.add(bNeck);

    const bCap = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.4, 32), steelMat);
    bCap.rotation.x = Math.PI / 2;
    bCap.position.set(0, 0, -1.35);
    bCap.castShadow = true;
    bottleGroup.add(bCap);

    const bLoop = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.055, 16, 28), steelMat);
    bLoop.position.set(0, 0.08, -1.65);
    bLoop.castShadow = true;
    bottleGroup.add(bLoop);

    bBody.userData = { parentGroup: bottleGroup, swagId: 'bottle' };
    bDecal.userData = { parentGroup: bottleGroup, swagId: 'bottle' };
    bCap.userData = { parentGroup: bottleGroup, swagId: 'bottle' };
    interactiveObjects.push(bBody, bDecal, bCap);

    boxGroup.add(bottleGroup);

    // --- SWAG ITEM 3: CERTIFICATE (Bottom-Left) ---
    const certGroup = new THREE.Group();
    certGroup.userData = { swagId: 'certificate', homePos: new THREE.Vector3(-1.85, -0.32, 2.1), homeRot: new THREE.Euler(0, 0, 0) };
    certGroup.position.copy(certGroup.userData.homePos);

    const certCardGeo = new THREE.BoxGeometry(3.6, 0.08, 2.5);
    const certCardMat = new THREE.MeshStandardMaterial({ color: 0xfbf8ee, roughness: 0.88 });
    const certCard = new THREE.Mesh(certCardGeo, certCardMat);
    certCard.castShadow = true;
    certCard.receiveShadow = true;
    certGroup.add(certCard);

    const certTopGeo = new THREE.PlaneGeometry(3.55, 2.45);
    const certTopMat = new THREE.MeshStandardMaterial({
      map: createCertificateTexture(),
      roughness: 0.82
    });
    const certTop = new THREE.Mesh(certTopGeo, certTopMat);
    certTop.rotation.x = -Math.PI / 2;
    certTop.position.y = 0.045;
    certGroup.add(certTop);

    certCard.userData = { parentGroup: certGroup, swagId: 'certificate' };
    certTop.userData = { parentGroup: certGroup, swagId: 'certificate' };
    interactiveObjects.push(certCard, certTop);

    boxGroup.add(certGroup);

    // --- SWAG ITEM 4: STICKERS (Bottom-Right) ---
    const stickersGroup = new THREE.Group();
    stickersGroup.userData = { swagId: 'stickers', homePos: new THREE.Vector3(2.25, -0.32, 2.1), homeRot: new THREE.Euler(0, 0, 0) };
    stickersGroup.position.copy(stickersGroup.userData.homePos);

    const vinylMat = (type: any) =>
      new THREE.MeshStandardMaterial({
        map: createStickerTexture(type),
        transparent: true,
        roughness: 0.15,
        metalness: 0.04
      });

    const s1 = new THREE.Mesh(new THREE.PlaneGeometry(1.35, 1.35), vinylMat('gdg_shield'));
    s1.rotation.x = -Math.PI / 2;
    s1.rotation.z = 0.04;
    s1.position.set(-0.7, 0.03, -0.45);
    stickersGroup.add(s1);

    const s2 = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.05), vinylMat('cloud'));
    s2.rotation.x = -Math.PI / 2;
    s2.rotation.z = -0.14;
    s2.position.set(0.65, 0.04, -0.45);
    stickersGroup.add(s2);

    const s3 = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.75), vinylMat('code'));
    s3.rotation.x = -Math.PI / 2;
    s3.rotation.z = 0.1;
    s3.position.set(-0.85, 0.05, 0.55);
    stickersGroup.add(s3);

    const s4 = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.75), vinylMat('cloud_server'));
    s4.rotation.x = -Math.PI / 2;
    s4.rotation.z = -0.06;
    s4.position.set(0.05, 0.06, 0.58);
    stickersGroup.add(s4);

    const s5 = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.95), vinylMat('google_g'));
    s5.rotation.x = -Math.PI / 2;
    s5.rotation.z = 0.16;
    s5.position.set(0.95, 0.07, 0.52);
    stickersGroup.add(s5);

    [s1, s2, s3, s4, s5].forEach((stk) => {
      stk.userData = { parentGroup: stickersGroup, swagId: 'stickers' };
      interactiveObjects.push(stk);
    });

    boxGroup.add(stickersGroup);

    // --- SEPARATE REMOVABLE 3D LID ---
    const lidGroup = new THREE.Group();
    const lidW = 8.7;
    const lidD = 8.7;
    const lidH = 1.35;
    const lidThick = 0.18;

    const lidRimN = new THREE.Mesh(new THREE.BoxGeometry(lidW, lidH, lidThick), boxMat);
    lidRimN.position.set(0, -lidH / 2, -lidD / 2 + lidThick / 2);
    lidGroup.add(lidRimN);

    const lidRimS = new THREE.Mesh(new THREE.BoxGeometry(lidW, lidH, lidThick), boxMat);
    lidRimS.position.set(0, -lidH / 2, lidD / 2 - lidThick / 2);
    lidGroup.add(lidRimS);

    const lidRimW = new THREE.Mesh(new THREE.BoxGeometry(lidThick, lidH, lidD - lidThick * 2), boxMat);
    lidRimW.position.set(-lidW / 2 + lidThick / 2, -lidH / 2, 0);
    lidGroup.add(lidRimW);

    const lidRimE = new THREE.Mesh(new THREE.BoxGeometry(lidThick, lidH, lidD - lidThick * 2), boxMat);
    lidRimE.position.set(lidW / 2 - lidThick / 2, -lidH / 2, 0);
    lidGroup.add(lidRimE);

    const lidTopGeo = new THREE.PlaneGeometry(lidW, lidD);
    const lidTopMat = new THREE.MeshStandardMaterial({
      map: createLidTexture(),
      roughness: 0.82,
      metalness: 0.05
    });
    const lidTop = new THREE.Mesh(lidTopGeo, lidTopMat);
    lidTop.rotation.x = -Math.PI / 2;
    lidTop.position.y = 0.01;
    lidTop.castShadow = true;
    lidGroup.add(lidTop);

    scene.add(lidGroup);

    // --- 3D SIMPLE & STYLISH CORNER SASH RIBBON (Preserves 100% text visibility) ---
    const ribbonGroup = new THREE.Group();
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x4285f4, // Google Blue silk satin
      roughness: 0.38,
      metalness: 0.15,
      transparent: true,
      opacity: 0.96
    });

    // Elegant diagonal sash across top-right corner of lid (leaving all center text 100% visible)
    const sashGeo = new THREE.BoxGeometry(4.4, 0.045, 0.62);
    const sashMesh = new THREE.Mesh(sashGeo, ribbonMat);
    sashMesh.position.set(2.8, 0.035, -2.5);
    sashMesh.rotation.y = -Math.PI / 4;
    sashMesh.castShadow = true;
    ribbonGroup.add(sashMesh);

    // Slim metallic gold accent stripe along the sash
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbc04,
      roughness: 0.28,
      metalness: 0.65
    });
    const stripeGeo = new THREE.BoxGeometry(4.4, 0.05, 0.08);
    const stripeMesh = new THREE.Mesh(stripeGeo, goldMat);
    stripeMesh.position.set(2.8, 0.04, -2.5);
    stripeMesh.rotation.y = -Math.PI / 4;
    ribbonGroup.add(stripeMesh);

    // Stylish luxury metallic seal clip in center of sash
    const sealGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.08, 32);
    const sealMesh = new THREE.Mesh(sealGeo, goldMat);
    sealMesh.position.set(2.8, 0.06, -2.5);
    sealMesh.castShadow = true;
    ribbonGroup.add(sealMesh);

    // Minimalist ribbon tail tabs
    const tailGeo = new THREE.BoxGeometry(0.48, 0.03, 0.85);
    const tail1 = new THREE.Mesh(tailGeo, ribbonMat);
    tail1.position.set(3.05, 0.05, -2.25);
    tail1.rotation.y = -Math.PI / 6;
    ribbonGroup.add(tail1);

    const tail2 = new THREE.Mesh(tailGeo, ribbonMat);
    tail2.position.set(2.55, 0.05, -2.75);
    tail2.rotation.y = -Math.PI / 3;
    ribbonGroup.add(tail2);

    lidGroup.add(ribbonGroup);

    // Raycasting setup
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);

    const onPointerMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (stateRef.current.currentOpenT > 0.85 && !stateRef.current.selectedId) {
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(interactiveObjects, false);
        if (hits.length > 0) {
          const hitSwagId = hits[0].object.userData?.swagId;
          setHoveredSwagId(hitSwagId || null);
          canvas.style.cursor = 'pointer';
        } else {
          setHoveredSwagId(null);
          canvas.style.cursor = 'default';
        }
      } else if (!stateRef.current.isOpen) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'default';
      }
    };

    const handleCanvasAction = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const clickY = -((clientY - rect.top) / rect.height) * 2 + 1;

      // If closed, click unboxes the gift
      if (!stateRef.current.isOpen) {
        handleOpenGift();
        return;
      }

      // If already open, test raycaster for swag items
      if (stateRef.current.currentOpenT > 0.85) {
        raycaster.setFromCamera(new THREE.Vector2(clickX, clickY), camera);
        const hits = raycaster.intersectObjects(interactiveObjects, false);
        if (hits.length > 0) {
          const hitSwagId = hits[0].object.userData?.swagId as SwagId;
          const found = SWAGS.find((s) => s.id === hitSwagId);
          if (found) {
            stateRef.current.selectedId = found.id;
            setSelectedSwag(found);
            return;
          }
        } else if (stateRef.current.selectedId) {
          // Clicked background: return item to box
          stateRef.current.selectedId = null;
          setSelectedSwag(null);
        }
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoved = false;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);
        if (dx > 8 || dy > 8) {
          touchMoved = true;
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchMoved && e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        handleCanvasAction(touch.clientX, touch.clientY);
      }
    };

    const onCanvasClick = (e: MouseEvent) => {
      handleCanvasAction(e.clientX, e.clientY);
    };

    canvas.addEventListener('mousemove', onPointerMove);
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });

    // Animation loop
    let animId = 0;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const elapsedTime = clock.getElapsedTime();
      const st = stateRef.current;

      // Smooth lerp for box opening progress
      st.currentOpenT += (st.targetOpenT - st.currentOpenT) * 0.055;
      const t = st.currentOpenT;

      // Positioning: Box on left, Lid on right matching Image 3!
      // In closed state (t = 0), both centered at (0, 0, 0)
      const openBoxTargetX = isMobile ? -2.9 : -3.6;
      boxGroup.position.x = THREE.MathUtils.lerp(0, openBoxTargetX, t);

      // Lid animation: lifts up, curves right, settles down
      const lidClosedPos = new THREE.Vector3(0, 0.75, 0);
      const lidOpenPos = new THREE.Vector3(isMobile ? 4.7 : 5.8, -0.4, 0.2);
      const lidLiftY = Math.sin(t * Math.PI) * 4.2;

      lidGroup.position.x = THREE.MathUtils.lerp(lidClosedPos.x, lidOpenPos.x, t);
      lidGroup.position.y = THREE.MathUtils.lerp(lidClosedPos.y, lidOpenPos.y, t) + lidLiftY;
      lidGroup.position.z = THREE.MathUtils.lerp(lidClosedPos.z, lidOpenPos.z, t);

      lidGroup.rotation.x = THREE.MathUtils.lerp(0, -0.04, t);
      lidGroup.rotation.y = THREE.MathUtils.lerp(0, 0.08, t);
      lidGroup.rotation.z = THREE.MathUtils.lerp(0, -0.02, t);

      // Idle floating motion in closed state
      if (t < 0.15) {
        const bob = Math.sin(elapsedTime * 1.8) * 0.08;
        boxGroup.position.y = bob;
        lidGroup.position.y = 0.75 + bob;
      } else {
        boxGroup.position.y = 0;
      }

      // Ribbon fade and vanish during opening
      if (t < 0.3) {
        ribbonGroup.visible = true;
        const ribFade = 1.0 - t / 0.3;
        ribbonMat.opacity = ribFade;
        ribbonGroup.scale.setScalar(THREE.MathUtils.lerp(1.0, 0.75, t / 0.3));
      } else {
        ribbonGroup.visible = false;
      }

      // Item Elevation on Click
      const swagGroups = [
        { id: 'tee', group: tshirtGroup },
        { id: 'bottle', group: bottleGroup },
        { id: 'certificate', group: certGroup },
        { id: 'stickers', group: stickersGroup }
      ];

      swagGroups.forEach(({ id, group }) => {
        const isSelected = st.selectedId === id;
        const isHovered = hoveredSwagId === id && !st.selectedId && t > 0.85;

        // Target elevation values
        let targetElev = isSelected ? 1.0 : isHovered ? 0.15 : 0.0;
        const curElev = st.itemElevations[id as SwagId];
        const nextElev = curElev + (targetElev - curElev) * 0.08;
        st.itemElevations[id as SwagId] = nextElev;

        const homePos = group.userData.homePos as THREE.Vector3;
        if (nextElev > 0.01) {
          // Lift out of cavity towards camera
          const targetWorldPos = new THREE.Vector3(0.0, 3.2, 2.6);
          group.position.x = THREE.MathUtils.lerp(homePos.x, targetWorldPos.x - boxGroup.position.x, nextElev);
          group.position.y = THREE.MathUtils.lerp(homePos.y, targetWorldPos.y, nextElev);
          group.position.z = THREE.MathUtils.lerp(homePos.z, targetWorldPos.z, nextElev);

          const targetScale = isSelected ? 1.45 : 1.05;
          group.scale.setScalar(THREE.MathUtils.lerp(1.0, targetScale, nextElev));

          if (isSelected) {
            // Gentle 3D inspection floating rotation
            if (id === 'bottle') {
              group.rotation.y = elapsedTime * 0.6;
              group.rotation.x = 0.15;
            } else if (id === 'tee') {
              group.rotation.x = -0.35 + Math.sin(elapsedTime * 1.5) * 0.05;
              group.rotation.y = Math.cos(elapsedTime * 1.2) * 0.15;
            } else if (id === 'certificate') {
              group.rotation.x = -0.3 + Math.sin(elapsedTime * 1.4) * 0.03;
              group.rotation.y = Math.sin(elapsedTime * 1.1) * 0.06;
            } else {
              group.rotation.x = -0.3 + Math.sin(elapsedTime * 1.3) * 0.04;
              group.rotation.y = Math.cos(elapsedTime * 1.1) * 0.1;
            }
          } else {
            group.rotation.set(0, 0, 0);
          }
        } else {
          group.position.copy(homePos);
          group.rotation.set(0, 0, 0);
          group.scale.setScalar(1.0);
        }
      });

      camera.position.set(targetCamX, targetCamY, targetCamZ);
      camera.lookAt(targetLookX, 0, 0.4);
      renderer.render(scene, camera);
    };

    renderLoop();

    // Resize handling
    const onResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight || 750;
      const aspect = width / height;
      const mobile = width < 768;
      camera.aspect = aspect;
      if (mobile) {
        camera.fov = 48;
        // Total required horizontal span for open box + open lid + margin = 18.8 units
        const reqSpan = 18.8;
        const vFovRad = THREE.MathUtils.degToRad(camera.fov);
        const reqDist = reqSpan / (2 * aspect * Math.tan(vFovRad / 2));
        targetCamY = Math.max(reqDist * 0.78, 23.5);
        targetCamZ = Math.max(reqDist * 0.62, 19.5);
        targetCamX = 0.8;
        targetLookX = 0.8;
      } else {
        camera.fov = 38;
        targetCamY = 15.0;
        targetCamZ = 12.5;
        targetCamX = 0.6;
        targetLookX = 0.6;
      }
      camera.position.set(targetCamX, targetCamY, targetCamZ);
      camera.lookAt(targetLookX, 0, 0.4);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onPointerMove);
      canvas.removeEventListener('click', onCanvasClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [createLidTexture, createTShirtTexture, createNeckTagTexture, createCollarRibbingTexture, createBottleTexture, createCertificateTexture, createStickerTexture, hoveredSwagId]);

  // Public control triggers
  const handleOpenGift = useCallback(() => {
    stateRef.current.isOpen = true;
    stateRef.current.targetOpenT = 1.0;
    setIsOpen(true);
  }, []);

  const handleCloseGift = useCallback(() => {
    stateRef.current.isOpen = false;
    stateRef.current.targetOpenT = 0.0;
    stateRef.current.selectedId = null;
    setSelectedSwag(null);
    setIsOpen(false);
  }, []);

  const handleSelectSwag = useCallback((swag: SwagInfo) => {
    if (!stateRef.current.isOpen) {
      handleOpenGift();
    }
    stateRef.current.selectedId = swag.id;
    setSelectedSwag(swag);
    if (typeof window !== 'undefined' && window.innerWidth < 768 && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [handleOpenGift]);

  const handleReturnToBox = useCallback(() => {
    stateRef.current.selectedId = null;
    setSelectedSwag(null);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedSwag) {
        handleReturnToBox();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedSwag, handleReturnToBox]);

  return (
    <section id="awards" className="sg-section" aria-labelledby="sg-title">
      {/* SECTION HEADER */}
      <div className="sg-heading">
        <div className="sg-eyebrow">
          <span className="sg-google-pill">
            <i style={{ backgroundColor: G_BLUE }} />
            <i style={{ backgroundColor: G_RED }} />
            <i style={{ backgroundColor: G_YELLOW }} />
            <i style={{ backgroundColor: G_GREEN }} />
          </span>
          GDG ON CAMPUS · NECN
        </div>
        <h2 id="sg-title">
          Rewards &amp; <span>Swags</span>
        </h2>
        <p>Every milestone deserves to be celebrated. Open your community swag box and explore what's inside.</p>
      </div>

      {/* 3D INTERACTIVE STAGE */}
      <div ref={containerRef} className="sg-3d-stage">
        <canvas ref={canvasRef} className="sg-webgl-canvas" aria-label="Interactive 3D Swag Gift Box" />

        {/* CLICK HINT OVERLAY IN CLOSED STATE */}
        {!isOpen && (
          <div className="sg-closed-hint-overlay" onClick={handleOpenGift}>
            <div className="sg-unboxing-pill">
              <span className="sg-sparkle">✦</span>
              <span>Tap or click box to unwrap your swags</span>
              <span className="sg-arrow">↗</span>
            </div>
          </div>
        )}

        {/* SWAG INSPECTION DETAIL HUD (FLOATING GLASS PANEL) */}
        {selectedSwag && (
          <div className="sg-hud-panel" role="dialog" aria-modal="false" aria-label={`${selectedSwag.name} details`}>
            <button className="sg-hud-close" type="button" onClick={handleReturnToBox} aria-label="Close item details">
              ×
            </button>
            <span className="sg-hud-badge">{selectedSwag.badge}</span>
            <h3 className="sg-hud-title">{selectedSwag.name}</h3>
            <p className="sg-hud-subtitle">{selectedSwag.subtitle}</p>
            <p className="sg-hud-desc">{selectedSwag.description}</p>

            <div className="sg-hud-specs">
              {selectedSwag.specs.map((spec, i) => (
                <div key={i} className="sg-spec-item">
                  <span className="sg-spec-dot" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>

            <button className="sg-hud-return-btn" type="button" onClick={handleReturnToBox}>
              <span>← Return to Swag Box</span>
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BUTTONS & SWAG TABS */}
      <div className="sg-actions">
        {!isOpen ? (
          <button className="sg-primary-button" type="button" onClick={handleOpenGift}>
            <span>✦</span> Unwrap Your GDG Gift <span>↗</span>
          </button>
        ) : (
          <div className="sg-open-controls">
            <p className="sg-open-hint">
              {selectedSwag ? 'Rotating 3D view. Press Esc or Return to put it back.' : 'Click any 3D item inside the box or select below to examine:'}
            </p>
            <div className="sg-swag-quick-tabs">
              {SWAGS.map((swag) => (
                <button
                  key={swag.id}
                  type="button"
                  className={`sg-quick-tab ${selectedSwag?.id === swag.id ? 'is-active' : ''}`}
                  onClick={() => handleSelectSwag(swag)}
                >
                  {swag.name.replace('GDG On Campus NECN ', '').replace('Google Cloud Matte ', '')}
                </button>
              ))}
            </div>

            {/* Mobile-optimized Inspection Card directly below buttons for 100% visibility */}
            {selectedSwag && (
              <div className="sg-mobile-card sm:hidden text-left bg-[#0f1117]/95 border border-amber-300/40 rounded-2xl p-4 my-3 text-slate-100 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="sg-hud-badge">{selectedSwag.badge}</span>
                  <button
                    type="button"
                    onClick={handleReturnToBox}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 px-2.5 py-1 rounded-lg bg-white/10 active:scale-95 transition-all"
                  >
                    ✕ Close
                  </button>
                </div>
                <h4 className="text-base font-bold text-white mb-0.5">{selectedSwag.name}</h4>
                <p className="text-xs text-amber-300/90 font-medium mb-2">{selectedSwag.subtitle}</p>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{selectedSwag.description}</p>
                <div className="space-y-1.5 mb-3.5 border-t border-white/10 pt-2.5">
                  {selectedSwag.specs.map((spec, i) => (
                    <div key={i} className="text-[11px] text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4285F4] shrink-0" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleReturnToBox}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 text-white text-xs font-bold border border-white/20 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>← Return to Swag Box</span>
                </button>
              </div>
            )}
            <button className="sg-secondary-button" type="button" onClick={handleCloseGift}>
              Close the Gift Box
            </button>
          </div>
        )}
      </div>

      <p className="sg-footnote">
        Official Swag Kit · Google Cloud Learn with Communities 2026 · <b>Narayana Engineering College, Nellore</b>
      </p>
    </section>
  );
};

export default SwagGiftExperience;
