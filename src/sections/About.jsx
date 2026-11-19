import { useEffect, useState } from 'react';
import { about } from '../content.js';
import { Rich } from '../Rich.jsx';
import { useSeen, prefersReduced } from '../hooks.js';
import Reveal from './Reveal.jsx';
import Eyebrow from './Eyebrow.jsx';

function Counter({ value, suffix }) {
  const [ref, seen] = useSeen(0.5);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (prefersReduced()) { setN(value); return; }
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
  return <span ref={ref} className="v">{n}{suffix}</span>;
}

export default function About() {
  return (
    <section className="section" id="about">
      <div className="container split">
        <div>
          <Reveal><Eyebrow num="02">{about.eyebrow}</Eyebrow></Reveal>
          <Reveal as="h2" className="display md" delay={0.05}><Rich text={about.heading} /></Reveal>
          {about.body.map((p, i) => (
            <Reveal as="p" className="lede" key={i} delay={0.1 + i * 0.05}>{p}</Reveal>
          ))}
          <Reveal as="ul" className="chips" delay={0.2}>
            {about.chips.map((c) => <li key={c}>{c}</li>)}
          </Reveal>
        </div>
        <div className="stats">
          {about.stats.map((s, i) => (
            <Reveal className="stat" key={s.label} delay={0.1 * i}>
              <Counter value={s.value} suffix={s.suffix} />
              <div className="l">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
