/**
 * GDG On Campus NECN - Premium Cinematic Fireworks Canvas Engine
 * 
 * High-performance, photorealistic cinematic fireworks simulation.
 * Pure light, radiant sparks, glowing projectile trails, and shockwave energy rings.
 * NO paper confetti, NO party poppers, NO cheap stickers.
 * 
 * Features:
 * - Trailing rocket projectiles with curved trajectories and gravity-affected sparks.
 * - Multi-tiered bursts: spherical, golden weeping willow, ring shockwaves, and chrysanthemum sparkle.
 * - Additive light blending (lighter / screen) for incandescent light intensity.
 * - Dynamic color palettes: 24K Gold, Champagne, Diamond White, and Google Quad-Colors (Blue, Red, Yellow, Green).
 */

export interface FireworksConfig {
  intensity?: 'subtle' | 'building' | 'grand_finale' | 'off';
  theme?: 'gold' | 'google' | 'mixed';
  speedMultiplier?: number;
}

// Particle colors
const GOLD_PALETTE = ['#FFF5CC', '#FFE066', '#FFD700', '#F59E0B', '#D97706', '#FFFFFF'];
const CHAMPAGNE_PALETTE = ['#FFFFFF', '#FDF8EC', '#F4E7CB', '#EBD4A8', '#FFDF9E'];
const GOOGLE_PALETTE = ['#4285F4', '#EA4335', '#FBBC04', '#34A853', '#FFFFFF', '#60A5FA'];
const MIXED_PALETTE = [...GOLD_PALETTE, ...GOOGLE_PALETTE, ...CHAMPAGNE_PALETTE];

interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  radius: number;
  decay: number;
  drag: number;
  gravity: number;
  flickerSpeed: number;
  sparkle: boolean;
  trail: { x: number; y: number; alpha: number }[];
}

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  palette: string[];
  trail: { x: number; y: number; alpha: number }[];
  pattern: 'sphere' | 'willow' | 'ring' | 'chrysanthemum';
  sparkCount: number;
  exploded: boolean;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
  lineWidth: number;
}

export class CinematicFireworksEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;
  private rockets: Rocket[] = [];
  private particles: SparkParticle[] = [];
  private shockwaves: Shockwave[] = [];
  private width: number = 0;
  private height: number = 0;
  private lastLaunchTime: number = 0;
  private launchInterval: number = 1800; // ms between auto launches
  private intensity: 'subtle' | 'building' | 'grand_finale' | 'off' = 'subtle';
  private currentTheme: 'gold' | 'google' | 'mixed' = 'mixed';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) {
      throw new Error('Canvas 2D context not supported');
    }
    this.ctx = context;
    this.handleResize();
  }

  public resize(): void {
    this.handleResize();
  }

  private handleResize(): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  public setIntensity(intensity: 'subtle' | 'building' | 'grand_finale' | 'off', theme?: 'gold' | 'google' | 'mixed'): void {
    this.intensity = intensity;
    if (theme) this.currentTheme = theme;

    switch (intensity) {
      case 'subtle':
        this.launchInterval = 1800;
        break;
      case 'building':
        this.launchInterval = 850;
        break;
      case 'grand_finale':
        this.launchInterval = 320;
        break;
      case 'off':
        this.launchInterval = 999999;
        break;
    }
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastLaunchTime = performance.now();
    this.loop();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public clear(): void {
    this.rockets = [];
    this.particles = [];
    this.shockwaves = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  public launchCustomRocket(
    startX?: number,
    targetY?: number,
    pattern: 'sphere' | 'willow' | 'ring' | 'chrysanthemum' = 'sphere',
    theme: 'gold' | 'google' | 'mixed' = 'gold'
  ): void {
    const x = startX !== undefined ? startX : this.width * (0.2 + Math.random() * 0.6);
    const y = this.height + 15;
    const destY = targetY !== undefined ? targetY : this.height * (0.18 + Math.random() * 0.32);
    
    // Choose palette
    let palette = GOLD_PALETTE;
    if (theme === 'google') palette = GOOGLE_PALETTE;
    else if (theme === 'mixed') palette = MIXED_PALETTE;

    const mainColor = palette[Math.floor(Math.random() * palette.length)];

    // Initial velocities
    const flightTime = 45 + Math.random() * 25; // frames
    const vy = (destY - y) / flightTime - 0.5 * 0.16 * flightTime;
    const vx = (Math.random() - 0.5) * 2.2;

    let sparkCount = 90;
    if (this.intensity === 'grand_finale') sparkCount = 140;
    if (pattern === 'willow') sparkCount = 130;

    this.rockets.push({
      x,
      y,
      vx,
      vy,
      targetY: destY,
      color: mainColor,
      palette,
      trail: [],
      pattern,
      sparkCount,
      exploded: false,
    });
  }

  public createInstantBurst(x: number, y: number, theme: 'gold' | 'google' | 'mixed' = 'gold', sparkCount: number = 120): void {
    let palette = GOLD_PALETTE;
    if (theme === 'google') palette = GOOGLE_PALETTE;
    else if (theme === 'mixed') palette = MIXED_PALETTE;

    this.createExplosion(x, y, palette, 'sphere', sparkCount);
  }

  private createExplosion(
    x: number,
    y: number,
    palette: string[],
    pattern: 'sphere' | 'willow' | 'ring' | 'chrysanthemum',
    count: number
  ): void {
    // 1. Shockwave Ring
    this.shockwaves.push({
      x,
      y,
      radius: 4,
      maxRadius: 65 + Math.random() * 35,
      alpha: 0.85,
      color: palette[0],
      lineWidth: 2.2,
    });

    // 2. Main Particle Swarm
    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      let vx = 0;
      let vy = 0;
      let drag = 0.965;
      let gravity = 0.065;
      let decay = 0.009 + Math.random() * 0.008;
      let radius = 1.2 + Math.random() * 1.6;

      if (pattern === 'sphere') {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.5 + Math.random() * 7.5;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      } else if (pattern === 'ring') {
        const angle = (i / count) * Math.PI * 2;
        const speed = 5.0 + (Math.random() - 0.5) * 0.8;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        drag = 0.955;
      } else if (pattern === 'willow') {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.8 + Math.random() * 5.5;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed - 1.2;
        drag = 0.985; // long floating decay
        gravity = 0.085;
        decay = 0.005 + Math.random() * 0.004;
        radius = 1.6 + Math.random() * 1.2;
      } else if (pattern === 'chrysanthemum') {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3.5 + Math.random() * 6.0;
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
        drag = 0.97;
      }

      this.particles.push({
        x,
        y,
        vx,
        vy,
        alpha: 1.0,
        color,
        radius,
        decay,
        drag,
        gravity,
        flickerSpeed: 0.1 + Math.random() * 0.2,
        sparkle: Math.random() > 0.4,
        trail: [],
      });
    }

    // 3. Central blinding flash spark
    for (let j = 0; j < 12; j++) {
      const angle = (j / 12) * Math.PI * 2;
      const speed = 8.5 + Math.random() * 3.0;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        color: '#FFFFFF',
        radius: 2.5,
        decay: 0.035, // flashes out fast
        drag: 0.92,
        gravity: 0.02,
        flickerSpeed: 0.3,
        sparkle: true,
        trail: [],
      });
    }
  }

  private loop = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();

    // Auto-launch rockets based on intensity
    if (this.intensity !== 'off' && now - this.lastLaunchTime > this.launchInterval) {
      this.lastLaunchTime = now;
      const patterns: ('sphere' | 'willow' | 'ring' | 'chrysanthemum')[] = ['sphere', 'willow', 'ring', 'chrysanthemum'];
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.launchCustomRocket(undefined, undefined, pattern, this.currentTheme);

      // In grand finale, launch twin or triple volleys
      if (this.intensity === 'grand_finale' && Math.random() > 0.35) {
        setTimeout(() => {
          if (!this.isRunning) return;
          this.launchCustomRocket(undefined, undefined, 'willow', 'gold');
        }, 120);
      }
    }

    // Render step
    this.updateAndDraw();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  private updateAndDraw(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Additive blending for luminous light trails & explosions
    ctx.globalCompositeOperation = 'lighter';

    // 1. Update & Draw Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 0.12;
      sw.alpha -= 0.045;

      if (sw.alpha <= 0.01 || sw.radius >= sw.maxRadius * 0.98) {
        this.shockwaves.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.alpha * 0.6;
      ctx.lineWidth = sw.lineWidth;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Update & Draw Rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const rocket = this.rockets[i];

      // Physics
      rocket.x += rocket.vx;
      rocket.y += rocket.vy;
      rocket.vy += 0.14; // Rocket gravity curve

      // Rocket trail
      rocket.trail.push({ x: rocket.x, y: rocket.y, alpha: 1.0 });
      if (rocket.trail.length > 14) {
        rocket.trail.shift();
      }

      // Draw Rocket Trail (Curved light streak)
      if (rocket.trail.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(rocket.trail[0].x, rocket.trail[0].y);
        for (let t = 1; t < rocket.trail.length; t++) {
          ctx.lineTo(rocket.trail[t].x, rocket.trail[t].y);
        }
        ctx.strokeStyle = rocket.color;
        ctx.globalAlpha = 0.85;
        ctx.lineWidth = 2.4;
        ctx.shadowColor = rocket.color;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // Check detonation criteria
      if (rocket.vy >= -0.8 || rocket.y <= rocket.targetY) {
        this.createExplosion(rocket.x, rocket.y, rocket.palette, rocket.pattern, rocket.sparkCount);
        this.rockets.splice(i, 1);
      }
    }

    // 3. Update & Draw Explosive Sparks
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Spark Physics
      p.vx *= p.drag;
      p.vy = p.vy * p.drag + p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      // Particle Trail
      p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
      if (p.trail.length > 5) {
        p.trail.shift();
      }

      if (p.alpha <= 0.01) {
        this.particles.splice(i, 1);
        continue;
      }

      // Sparkle modulation
      let currentAlpha = p.alpha;
      if (p.sparkle) {
        currentAlpha *= 0.65 + Math.sin(p.alpha * 30 * p.flickerSpeed) * 0.35;
      }

      ctx.save();
      // Draw spark streak/trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let t = 1; t < p.trail.length; t++) {
          ctx.lineTo(p.trail[t].x, p.trail[t].y);
        }
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = currentAlpha * 0.45;
        ctx.lineWidth = p.radius * 0.9;
        ctx.stroke();
      }

      // Draw glowing particle head
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = currentAlpha;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  }
}
