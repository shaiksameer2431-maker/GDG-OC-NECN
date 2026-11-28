import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import './GoldJourneyIntro.css';

interface GoldJourneyIntroProps {
  onComplete: () => void;
  onPreload?: () => void;
}

const chapters = [
  {
    kicker: 'EVERY GREAT ACHIEVEMENT HAS A STORY',
    title: <>IT WASN'T<br /><em>AN EASY JOURNEY.</em></>,
    body: 'There were tough situations, tight deadlines, difficult labs, and moments that tested our patience.',
    mark: '01 / THE CHALLENGE',
  },
  {
    kicker: 'WE FACED EVERY CHALLENGE',
    title: <>SOME DAYS WERE TOUGH.<br /><em>WE KEPT GOING.</em></>,
    body: 'Some problems took more than one attempt. Some goals felt far away. Still, we showed up and tried again.',
    mark: '02 / THE DETERMINATION',
  },
  {
    kicker: 'NO ONE WAS LEFT BEHIND',
    title: <>WE DIDN'T DO IT<br /><em>ALONE.</em></>,
    body: 'Students helped students. Volunteers cleared doubts. The team guided, encouraged, and stood together.',
    mark: '03 / THE COMMUNITY',
  },
  {
    kicker: 'EVERY EFFORT ADDED UP',
    title: <>TOGETHER, WE TURNED<br /><em>EFFORT INTO IMPACT.</em></>,
    body: 'Every completed lab, every earned badge, and every helping hand moved our entire community forward.',
    mark: '04 / THE BREAKTHROUGH',
  },
  {
    kicker: 'THIS MOMENT BELONGS TO ALL OF US',
    title: <>WE DID IT.<br /><strong>WE REACHED GOLD.</strong></>,
    body: '280 achievers. 2,661 skill badges. One team, one community, one unforgettable milestone.',
    mark: '05 / THE GOLD MOMENT',
  },
];

export const GoldJourneyIntro: React.FC<GoldJourneyIntroProps> = ({ onComplete, onPreload }) => {
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const callbacks = useRef({ onComplete, onPreload });

  useEffect(() => { callbacks.current = { onComplete, onPreload }; }, [onComplete, onPreload]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const party = canvas ? confetti.create(canvas, { resize: true, useWorker: true }) : null;
    const timers: number[] = [];

    chapters.forEach((_, index) => {
      if (index > 0) timers.push(window.setTimeout(() => setActive(index), index * 2100));
    });

    timers.push(window.setTimeout(() => callbacks.current.onPreload?.(), 9300));
    timers.push(window.setTimeout(() => {
      if (!reduced && party) {
        const colors = ['#F9C846', '#E6B84A', '#FFF4C2', '#FFFFFF', '#4285F4', '#EA4335', '#34A853'];
        party({ particleCount: 90, spread: 100, startVelocity: 38, origin: { x: 0.5, y: 0.58 }, colors, ticks: 260 });
        party({ particleCount: 45, angle: 60, spread: 65, origin: { x: 0.08, y: 0.8 }, colors, ticks: 220 });
        party({ particleCount: 45, angle: 120, spread: 65, origin: { x: 0.92, y: 0.8 }, colors, ticks: 220 });
      }
    }, 8500));
    timers.push(window.setTimeout(() => setExiting(true), 10800));
    timers.push(window.setTimeout(() => callbacks.current.onComplete(), 12000));

    return () => {
      timers.forEach(window.clearTimeout);
      party?.reset();
    };
  }, []);

  const chapter = chapters[active];

  return (
    <div className={`gold-journey-overlay ${exiting ? 'gold-journey-exiting' : ''}`} role="dialog" aria-modal="true" aria-label="Our journey to Gold">
      <canvas ref={canvasRef} className="gold-journey-confetti" aria-hidden="true" />
      <div className="gold-journey-grain" aria-hidden="true" />
      <div className="gold-journey-orbit gold-journey-orbit-one" aria-hidden="true" />
      <div className="gold-journey-orbit gold-journey-orbit-two" aria-hidden="true" />
      <div className="gold-journey-google-mark" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="gold-journey-content" key={active}>
        <div className="gold-journey-brand">
          <span className="gold-journey-gdg-mark">‹<b>›</b></span>
          <span>GDG ON CAMPUS NECN</span>
          <span className="gold-journey-divider" />
          <span>GOOGLE CLOUD 2026</span>
        </div>
        <div className="gold-journey-copy">
          <div className="gold-journey-kicker">{chapter.kicker}</div>
          <h1>{chapter.title}</h1>
          <p>{chapter.body}</p>
        </div>
        <div className="gold-journey-footer">
          <span>{chapter.mark}</span>
          <div className="gold-journey-progress" aria-label={`Chapter ${active + 1} of 5`}>
            {chapters.map((item, index) => <i key={item.mark} className={index <= active ? 'is-active' : ''} />)}
          </div>
          <span>OUR STORY</span>
        </div>
      </div>
      <div className="gold-journey-bottom-note">LEARN TOGETHER · BUILD TOGETHER · ACHIEVE TOGETHER</div>
    </div>
  );
};

export default GoldJourneyIntro;
