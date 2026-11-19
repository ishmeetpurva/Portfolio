import { useEffect, useRef, useState } from 'react';
import { testimonials, asset } from '../content.js';
import { Rich } from '../Rich.jsx';
import { prefersReduced } from '../hooks.js';
import Reveal from './Reveal.jsx';
import Eyebrow from './Eyebrow.jsx';

export default function Testimonials() {
  const items = testimonials.items;
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);
  const paused = useRef(false); // hover / focus pause
  const [playing, setPlaying] = useState(() => !prefersReduced());
  const touch = useRef(null);

  const go = (n) => {
    const next = (n + items.length) % items.length;
    if (prefersReduced()) { setI(next); return; }
    setFade(false);
    setTimeout(() => { setI(next); setFade(true); }, 280);
  };

  useEffect(() => {
    if (!playing || items.length < 2) return;
    const id = setInterval(() => { if (!paused.current) go(i + 1); }, 6500);
    return () => clearInterval(id);
  });

  const t = items[i];
  return (
    <section className="section" id="words">
      <Reveal
        className="container quotes"
        onPointerEnter={() => (paused.current = true)}
        onPointerLeave={() => (paused.current = false)}
        onFocus={() => (paused.current = true)}
        onBlur={() => (paused.current = false)}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current == null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
          touch.current = null;
        }}
      >
        <Eyebrow num="06">{testimonials.eyebrow}</Eyebrow>
        <h2 className="sr-only">What people I've worked with say</h2>
        <div aria-live="polite" style={{ opacity: fade ? 1 : 0, transform: fade ? 'none' : 'translateY(8px)', transition: 'opacity .28s, transform .28s' }}>
          <blockquote className="quote"><span>“<Rich text={t.quote} />”</span></blockquote>
          <div className="quote-by">
            {t.image && <img className="avatar" src={asset(t.image)} alt="" />}
            <div className="mono"><strong>{t.name}</strong>{t.role}, {t.company}</div>
          </div>
        </div>
        {items.length > 1 && (
          <div className="q-ctrl">
            <button className="round-btn" onClick={() => go(i - 1)} aria-label="Previous quote">←</button>
            <div className="q-dots">
              {items.map((_, k) => (
                <button key={k} aria-label={`Quote ${k + 1}`} aria-current={k === i} onClick={() => go(k)} />
              ))}
            </div>
            <button className="round-btn" onClick={() => go(i + 1)} aria-label="Next quote">→</button>
            <button className="round-btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause quotes' : 'Play quotes'} aria-pressed={!playing}>
              {playing ? '❚❚' : '▶'}
            </button>
          </div>
        )}
      </Reveal>
    </section>
  );
}
