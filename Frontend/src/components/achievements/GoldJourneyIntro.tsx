import React, { useEffect, useRef, useState } from 'react';
import './GoldJourneyIntro.css';

interface GoldJourneyIntroProps {
  onComplete: () => void;
  onPreload?: () => void;
}

const chapters = [
  { kicker: 'EVERY GREAT ACHIEVEMENT HAS A STORY', title: <>IT WASN'T<br /><em>AN EASY JOURNEY.</em></>, body: 'There were tough situations, tight deadlines, difficult labs, and moments that tested our patience.', mark: '01 / THE CHALLENGE' },
  { kicker: 'WE FACED EVERY CHALLENGE', title: <>SOME DAYS WERE TOUGH.<br /><em>WE KEPT GOING.</em></>, body: 'Some problems took more than one attempt. Some goals felt far away. Still, we showed up and tried again.', mark: '02 / THE DETERMINATION' },
  { kicker: 'NO ONE WAS LEFT BEHIND', title: <>WE DIDN'T DO IT<br /><em>ALONE.</em></>, body: 'Students helped students. Volunteers cleared doubts. The team guided, encouraged, and stood together.', mark: '03 / THE COMMUNITY' },
  { kicker: 'EVERY EFFORT ADDED UP', title: <>TOGETHER, WE TURNED<br /><em>EFFORT INTO IMPACT.</em></>, body: 'Every completed lab, every earned badge, and every helping hand moved our entire community forward.', mark: '04 / THE BREAKTHROUGH' },
  { kicker: 'THIS MOMENT BELONGS TO ALL OF US', title: <>WE DID IT.<br /><strong>WE REACHED GOLD.</strong></>, body: '280 achievers. 2,661 skill badges. One team, one community, one unforgettable milestone.', mark: '05 / THE GOLD MOMENT' },
];

type Spark = { x:number; y:number; vx:number; vy:number; life:number; max:number; color:string; size:number; trail:number };
type Rocket = { x:number; y:number; targetY:number; vx:number; vy:number; color:string; trail:{x:number;y:number}[] };

export const GoldJourneyIntro: React.FC<GoldJourneyIntroProps> = ({ onComplete, onPreload }) => {
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const callbacks = useRef({ onComplete, onPreload });
  useEffect(() => { callbacks.current = { onComplete, onPreload }; }, [onComplete, onPreload]);

  // Fireworks are drawn as light trails and glowing sparks: no paper/confetti particles.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0, height = 0, raf = 0, lastLaunch = 0, start = 0;
    const sparks: Spark[] = [];
    const rockets: Rocket[] = [];
    const palette = ['#FFE7A0', '#F6C85F', '#FFFFFF', '#8CC8FF', '#FF9B83', '#9CE6B0'];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const launch = () => {
      const x = width * (0.12 + Math.random() * 0.76);
      const targetY = height * (0.13 + Math.random() * 0.36);
      const color = palette[Math.floor(Math.random() * palette.length)];
      rockets.push({ x, y: height + 8, targetY, vx: (Math.random() - .5) * 1.3, vy: -(7 + Math.random() * 2), color, trail: [] });
    };
    const burst = (x:number,y:number,color:string,power=1) => {
      const count = Math.round(48 * power);
      for (let i=0;i<count;i++) {
        const angle = Math.PI * 2 * i / count + Math.random() * .12;
        const speed = (1.1 + Math.random() * 4.3) * power;
        sparks.push({ x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:48+Math.random()*34,max:82,color,size:.7+Math.random()*1.8,trail:Math.random()*5 });
      }
      // Fine inner shimmer ring
      for (let i=0;i<18;i++) {
        const a = Math.PI*2*i/18;
        sparks.push({x,y,vx:Math.cos(a)*1.25,vy:Math.sin(a)*1.25,life:24,max:24,color:'#FFF7D8',size:1.5,trail:0});
      }
    };
    const tick = (now:number) => {
      if (!start) start = now;
      const elapsed = now - start;
      ctx.clearRect(0,0,width,height);
      if (!reduced && elapsed > 7900 && now-lastLaunch > 720) { launch(); lastLaunch = now; }
      ctx.globalCompositeOperation = 'lighter';
      for (let i=rockets.length-1;i>=0;i--) {
        const r=rockets[i];
        r.trail.push({x:r.x,y:r.y}); if(r.trail.length>9) r.trail.shift();
        r.x+=r.vx; r.y+=r.vy; r.vy+=.045;
        ctx.beginPath(); ctx.moveTo(r.x,r.y);
        for(let j=r.trail.length-1;j>=0;j--) ctx.lineTo(r.trail[j].x,r.trail[j].y);
        ctx.strokeStyle=r.color; ctx.globalAlpha=.75; ctx.lineWidth=1.4; ctx.shadowBlur=14; ctx.shadowColor=r.color; ctx.stroke();
        if(r.y<=r.targetY || r.vy>=-1) { burst(r.x,r.y,r.color, .8+Math.random()*.55); rockets.splice(i,1); }
      }
      for(let i=sparks.length-1;i>=0;i--) {
        const s=sparks[i]; s.x+=s.vx; s.y+=s.vy; s.vy+=.035; s.vx*=.986; s.vy*=.986; s.life--;
        const alpha=Math.max(0,s.life/s.max);
        ctx.beginPath(); ctx.arc(s.x,s.y,s.size,0,Math.PI*2);
        ctx.fillStyle=s.color; ctx.globalAlpha=alpha; ctx.shadowBlur=10*alpha; ctx.shadowColor=s.color; ctx.fill();
        if(s.trail>0) { ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.vx*s.trail,s.y-s.vy*s.trail); ctx.strokeStyle=s.color; ctx.globalAlpha=alpha*.5; ctx.lineWidth=.8; ctx.stroke(); }
        if(s.life<=0) sparks.splice(i,1);
      }
      ctx.globalAlpha=1; ctx.shadowBlur=0; ctx.globalCompositeOperation='source-over';
      raf=requestAnimationFrame(tick);
    };
    resize(); window.addEventListener('resize',resize);
    if (!reduced) raf=requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  }, []);

  useEffect(() => {
    const timers:number[]=[];
    [1,2,3,4].forEach(index => timers.push(window.setTimeout(()=>setActive(index), index*2050)));
    timers.push(window.setTimeout(()=>callbacks.current.onPreload?.(), 8500));
    timers.push(window.setTimeout(()=>setExiting(true), 11100));
    timers.push(window.setTimeout(()=>callbacks.current.onComplete(), 12300));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  const chapter=chapters[active];
  return (
    <div className={`gold-journey-overlay ${active===4?'gold-journey-victory ':''}${exiting?'gold-journey-exiting':''}`} role="dialog" aria-modal="true" aria-label="Our journey to Gold">
      <canvas ref={canvasRef} className="gold-journey-fireworks" aria-hidden="true" />
      <div className="gold-journey-aurora" aria-hidden="true" />
      <div className="gold-journey-glass-orbit gold-journey-orbit-one" aria-hidden="true" />
      <div className="gold-journey-glass-orbit gold-journey-orbit-two" aria-hidden="true" />
      <div className="gold-journey-content" key={active}>
        <div className="gold-journey-brand">
          <span className="gold-journey-gdg-mark">‹<b>›</b></span>
          <span>GDG ON CAMPUS NECN</span><span className="gold-journey-divider" /><span>GOOGLE CLOUD 2026</span>
        </div>
        <div className="gold-journey-copy">
          <div className="gold-journey-kicker"><i />{chapter.kicker}</div>
          <h1>{chapter.title}</h1>
          <p>{chapter.body}</p>
          {active===4 && <div className="gold-journey-achievement-stats"><div><strong>280</strong><span>ACHIEVERS</span></div><i /><div><strong>2,661</strong><span>SKILL BADGES</span></div><i /><div><strong>112%</strong><span>GOLD TARGET</span></div></div>}
        </div>
        <div className="gold-journey-footer">
          <span>{chapter.mark}</span>
          <div className="gold-journey-progress" aria-label={`Chapter ${active+1} of 5`}>{chapters.map((item,index)=><i key={item.mark} className={index<=active?'is-active':''}/>)}</div>
          <span>OUR STORY</span>
        </div>
      </div>
      <div className="gold-journey-bottom-note">LEARN TOGETHER <b>·</b> BUILD TOGETHER <b>·</b> ACHIEVE TOGETHER</div>
    </div>
  );
};
export default GoldJourneyIntro;
