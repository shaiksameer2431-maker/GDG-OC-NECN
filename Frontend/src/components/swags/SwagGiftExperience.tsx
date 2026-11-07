import React, { useState } from 'react';
import './SwagGiftExperience.css';

type SwagId = 'tee' | 'bottle' | 'stickers' | 'certificate';
type Swag = { id: SwagId; name: string; subtitle: string; description: string };

const SWAGS: Swag[] = [
  { id: 'tee', name: 'GDG T-shirt', subtitle: 'Wear the community', description: 'A GDG On Campus NECN branded T-shirt — a little reminder of the skills, people and experiences you earned along the way.' },
  { id: 'bottle', name: 'Google Cloud Bottle', subtitle: 'Carry your momentum', description: 'A reusable bottle for your next lab, campus meetup or build session.' },
  { id: 'stickers', name: 'Google Stickers', subtitle: 'Make it yours', description: 'A colourful sticker collection inspired by Google, Cloud and the developer community.' },
  { id: 'certificate', name: 'Certificate', subtitle: 'Celebrate your achievement', description: 'A certificate celebrating your participation in Google Cloud Learn with Communities 2026.' },
];

function GoogleMark() {
  return <span className="sg-google-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

function SwagArtwork({ id }: { id: SwagId }) {
  if (id === 'tee') return <div className="sg-art sg-shirt" aria-hidden="true"><div className="sg-shirt-neck" /><div className="sg-shirt-print"><GoogleMark /><b>GDG</b><small>ON CAMPUS<br />NECN</small></div></div>;
  if (id === 'bottle') return <div className="sg-art sg-bottle" aria-hidden="true"><div className="sg-bottle-cap" /><div className="sg-bottle-loop" /><div className="sg-bottle-label"><GoogleMark /><b>GDG</b><small>ON CAMPUS<br />NECN</small></div><div className="sg-bottle-stripe" /></div>;
  if (id === 'stickers') return <div className="sg-art sg-sticker-sheet" aria-hidden="true"><span className="sg-sticker sg-sticker-g">G</span><span className="sg-sticker sg-sticker-cloud">☁</span><span className="sg-sticker sg-sticker-code">&lt;/&gt;</span><span className="sg-sticker sg-sticker-gdg"><GoogleMark />GDG</span><span className="sg-sticker sg-sticker-star">✦</span></div>;
  return <div className="sg-art sg-certificate" aria-hidden="true"><div className="sg-cert-border"><GoogleMark /><b>CERTIFICATE</b><small>OF PARTICIPATION</small><span className="sg-cert-rule" /><strong>Google Cloud<br />Learn with Communities 2026</strong><em>GDG ON CAMPUS · NECN</em><span className="sg-cert-seal">★</span></div></div>;
}

export const SwagGiftExperience: React.FC = () => {
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState<Swag | null>(null);

  const openGift = () => { setSelected(null); setOpened(true); };
  const closeGift = () => { setSelected(null); setOpened(false); };

  return (
    <section id="awards" className="sg-section" aria-labelledby="sg-title">
      <div className="sg-heading">
        <span className="sg-eyebrow"><GoogleMark /> GDG ON CAMPUS · NECN</span>
        <h2 id="sg-title">Rewards &amp; <span>Swags</span></h2>
        <p>Every milestone deserves to be celebrated. Open your community swag box and explore what's inside.</p>
      </div>

      <div className={`sg-stage ${opened ? 'is-open' : ''} ${selected ? 'has-selection' : ''}`}>
        <div className="sg-stage-glow" />
        <div className="sg-floor-shadow" />

        <div
          className={`sg-gift ${!opened ? 'is-closed-clickable' : ''}`}
          aria-label="GDG On Campus NECN swag gift box"
          onClick={!opened ? openGift : undefined}
          role={!opened ? 'button' : undefined}
          tabIndex={!opened ? 0 : undefined}
          onKeyDown={!opened ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openGift(); } } : undefined}
        >
          <div className="sg-box-base">
            <div className="sg-box-interior">
              <div className="sg-box-padding" />
              <div className="sg-swag-grid">
                {SWAGS.map((swag, index) => (
                  <button
                    className={`sg-swag sg-swag-${swag.id} ${selected?.id === swag.id ? 'is-selected' : ''}`}
                    key={swag.id}
                    type="button"
                    onClick={() => { if (opened) setSelected(selected?.id === swag.id ? null : swag); }}
                    aria-label={`View ${swag.name}`}
                    tabIndex={opened ? 0 : -1}
                  >
                    <span className="sg-item-art"><SwagArtwork id={swag.id} /></span>
                    <span className="sg-item-label">{swag.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="sg-box-front"><span>GDG ON CAMPUS NECN</span><GoogleMark /></div>
            <div className="sg-box-left" />
            <div className="sg-box-right" />
          </div>

          <div className="sg-lid-wrap">
            <div className="sg-lid">
              <div className="sg-lid-top">
                <GoogleMark />
                <strong>GDG ON CAMPUS</strong>
                <span>NECN</span>
                <i>SWAGS</i>
                <small>LEARN · BUILD · EARN</small>
              </div>
              <div className="sg-lid-front" />
              <div className="sg-lid-side" />
            </div>
          </div>

          <div className="sg-ribbon sg-ribbon-vertical" />
          <div className="sg-ribbon sg-ribbon-horizontal" />
          <div className="sg-bow"><i /><i /><b /></div>
        </div>

        {selected && (
          <div className="sg-selected-panel" role="dialog" aria-modal="false" aria-label={`${selected.name} details`}>
            <button className="sg-panel-close" type="button" onClick={() => setSelected(null)} aria-label="Close item details">×</button>
            <span className="sg-panel-kicker">INSIDE YOUR SWAG BOX</span>
            <h3>{selected.name}</h3>
            <p className="sg-panel-subtitle">{selected.subtitle}</p>
            <p>{selected.description}</p>
            <button className="sg-back-button" type="button" onClick={() => setSelected(null)}>Back to the box</button>
          </div>
        )}
      </div>

      <div className="sg-actions">
        {!opened ? (
          <button className="sg-primary-button" type="button" onClick={openGift}><span>✦</span> Open your gift <span>↗</span></button>
        ) : (
          <>
            <p className="sg-open-hint">{selected ? 'Take a closer look at your reward.' : 'Tap any swag item inside the box to explore it.'}</p>
            <button className="sg-secondary-button" type="button" onClick={closeGift}>Close the gift box</button>
          </>
        )}
      </div>
      <p className="sg-footnote">A celebration of learning, progress and community. <b>GDG On Campus NECN</b></p>
    </section>
  );
};

export default SwagGiftExperience;
