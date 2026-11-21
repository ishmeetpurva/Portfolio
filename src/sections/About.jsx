import { useEffect, useState } from 'react';
import { about } from '../content.js';
import { Rich } from '../Rich.jsx';
import { useSeen, prefersReduced } from '../hooks.js';
import Reveal from './Reveal.jsx';

function Counter({ value, suffix }) {
  const [ref, seen] = useSeen(0.5);
  const [n, setN] = useState(() => (prefersReduced() ? value : 0));
  useEffect(() => {
    if (!seen) return;
    if (prefersReduced() || document.documentElement.dataset.motion === 'off') { setN(value); return; }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1600);
      setN(Math.round(value * (1 - (1 - p) ** 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);
  // Screen readers get the final number; the count-up is visual only.
  return (
    <span ref={ref} className="t-num">
      <span aria-hidden="true">{n}{suffix}</span>
      <span className="sr-only">{value}{suffix}</span>
    </span>
  );
}

export default function About() {
  return (
    <section className="t-sec" id="about">
      <Reveal className="t-head t-about">
        <div>
          <span className="mono">{about.eyebrow}</span>
          <h2 className="t-h2"><Rich text={about.heading} /></h2>
        </div>
        <p>{about.body}</p>
      </Reveal>
      <div className="t-grid">
        {about.stats.map((s, i) => (
          <Reveal className="t-tile t-stat" key={s.label} delay={0.08 * i}>
            <Counter value={s.value} suffix={s.suffix} />
            <span className="mono">{s.label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
