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

  // 2. T-Shirt Texture
  const createTShirtTexture = useCallback(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const ctx = c.getContext('2d')!;

    ctx.fillStyle = '#14151a';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle cotton texture noise
    for (let i = 0; i < 20000; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.018)' : 'rgba(0,0,0,0.03)';
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
    }

    // Inside neck woven label
    ctx.fillStyle = '#08080c';
    ctx.fillRect(390, 100, 244, 140);
    ctx.strokeStyle = '#2b2e3a';
    ctx.lineWidth = 4;
    ctx.strokeRect(390, 100, 244, 140);
    drawGdgBrackets(ctx, 512, 170, 70);

    // Chest Print (Right chest of folded tee matching Image 3)
    drawGdgBrackets(ctx, 680, 490, 170);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '900 80px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('GDG', 680, 605);

    ctx.font = '700 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('On Campus', 680, 670);

    ctx.font = '900 56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('NECN', 680, 740);

    // Quad-color underline bar
    const barW = 250;
    const barH = 16;
    const barX = 680 - barW / 2;
    const barY = 785;
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

    const camera = new THREE.PerspectiveCamera(isMobile ? 44 : 38, width / height, 0.1, 100);
    camera.position.set(0.6, isMobile ? 20.0 : 15.0, isMobile ? 16.0 : 12.5);
    camera.lookAt(0.6, 0, 0.4);

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
    const ambLight = new THREE.AmbientLight(0xffffff, 0.72);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ea, 1.25);
    keyLight.position.set(9, 20, 14);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdde8ff, 0.55);
    fillLight.position.set(-12, 14, 6);
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

    // --- SWAG ITEM 1: T-SHIRT (Top-Left) ---
    const tshirtGroup = new THREE.Group();
    tshirtGroup.userData = { swagId: 'tee', homePos: new THREE.Vector3(-1.85, -0.25, -1.9), homeRot: new THREE.Euler(0, 0, 0) };
    tshirtGroup.position.copy(tshirtGroup.userData.homePos);

    const tsGeo = new THREE.BoxGeometry(4.3, 0.45, 3.7);
    const tsBaseMat = new THREE.MeshStandardMaterial({ color: 0x14151a, roughness: 0.94 });
    const tsMesh = new THREE.Mesh(tsGeo, tsBaseMat);
    tsMesh.castShadow = true;
    tsMesh.receiveShadow = true;
    tshirtGroup.add(tsMesh);

    const tsTopGeo = new THREE.PlaneGeometry(4.25, 3.65);
    const tsTopMat = new THREE.MeshStandardMaterial({
      map: createTShirtTexture(),
      roughness: 0.92,
      metalness: 0.02
    });
    const tsTop = new THREE.Mesh(tsTopGeo, tsTopMat);
    tsTop.rotation.x = -Math.PI / 2;
    tsTop.position.y = 0.23;
    tshirtGroup.add(tsTop);

    const collarGeo = new THREE.TorusGeometry(0.72, 0.14, 16, 40, Math.PI);
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x090a0d, roughness: 0.98 });
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.rotation.z = Math.PI;
    collarMesh.position.set(0, 0.24, -1.38);
    tshirtGroup.add(collarMesh);

    // Hit test target
    tsMesh.userData = { parentGroup: tshirtGroup, swagId: 'tee' };
    tsTop.userData = { parentGroup: tshirtGroup, swagId: 'tee' };
    interactiveObjects.push(tsMesh, tsTop);

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

    // --- 3D SATIN RIBBON & BOW (Wrapped around closed box) ---
    const ribbonGroup = new THREE.Group();
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0x4285f4,
      roughness: 0.45,
      metalness: 0.12,
      transparent: true,
      opacity: 1.0
    });

    const ribZ = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.06, lidD + 0.1), ribbonMat);
    ribZ.position.y = 0.04;
    ribbonGroup.add(ribZ);

    const ribX = new THREE.Mesh(new THREE.BoxGeometry(lidW + 0.1, 0.06, 0.72), ribbonMat);
    ribX.position.y = 0.045;
    ribbonGroup.add(ribX);

    // 3D Ribbon Bow on top
    const bowKnot = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.25, 0.48), new THREE.MeshStandardMaterial({ color: 0xfbbc04, roughness: 0.5 }));
    bowKnot.position.y = 0.16;
    ribbonGroup.add(bowKnot);

    const bowLoopGeo = new THREE.TorusGeometry(0.5, 0.12, 16, 28, Math.PI * 1.3);
    const bowLoopL = new THREE.Mesh(bowLoopGeo, ribbonMat);
    bowLoopL.rotation.y = Math.PI / 4;
    bowLoopL.rotation.z = Math.PI * 0.4;
    bowLoopL.position.set(-0.35, 0.32, 0);
    ribbonGroup.add(bowLoopL);

    const bowLoopR = new THREE.Mesh(bowLoopGeo, ribbonMat);
    bowLoopR.rotation.y = -Math.PI / 4;
    bowLoopR.rotation.z = -Math.PI * 0.4;
    bowLoopR.position.set(0.35, 0.32, 0);
    ribbonGroup.add(bowLoopR);

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

    const onCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // If closed, click unboxes the gift
      if (!stateRef.current.isOpen) {
        stateRef.current.isOpen = true;
        stateRef.current.targetOpenT = 1.0;
        setIsOpen(true);
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

    canvas.addEventListener('mousemove', onPointerMove);
    canvas.addEventListener('click', onCanvasClick);

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
      const openBoxTargetX = isMobile ? -3.4 : -3.6;
      boxGroup.position.x = THREE.MathUtils.lerp(0, openBoxTargetX, t);

      // Lid animation: lifts up, curves right, settles down
      const lidClosedPos = new THREE.Vector3(0, 0.75, 0);
      const lidOpenPos = new THREE.Vector3(isMobile ? 5.4 : 5.8, -0.4, 0.2);
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

      renderer.render(scene, camera);
    };

    renderLoop();

    // Resize handling
    const onResize = () => {
      if (!container || !canvas) return;
      width = container.clientWidth;
      height = container.clientHeight || 750;
      const mobile = width < 768;
      camera.fov = mobile ? 46 : 38;
      camera.position.set(0.6, mobile ? 20.0 : 15.0, mobile ? 16.0 : 12.5);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onPointerMove);
      canvas.removeEventListener('click', onCanvasClick);
      renderer.dispose();
    };
  }, [createLidTexture, createTShirtTexture, createBottleTexture, createCertificateTexture, createStickerTexture, hoveredSwagId]);

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
