import { useEffect, useRef, useState } from 'react';
import { site } from '../content.js';
import { Rich } from '../Rich.jsx';
import { fetchModel, MODEL_URL } from './fetchModel.js';

const RING = Array.from({ length: 96 }, (_, i) => {
  const a = (i / 96) * Math.PI * 2 - Math.PI / 2;
  return { cx: Math.round(92 * Math.cos(a) * 100) / 100, cy: Math.round(92 * Math.sin(a) * 100) / 100 };
});

export default function Hero() {
  const hostRef = useRef(null);
  const stageRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading');
  const [error, setError] = useState(false);
  // Text never waits on the 3D: it shows at assembly, or after 1.2 s, whichever comes first.
  const [textIn, setTextIn] = useState(false);
  useEffect(() => {
    if (phase === 'ready') { setTextIn(true); return; }
    const id = setTimeout(() => setTextIn(true), window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1200);
    return () => clearTimeout(id);
  }, [phase]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctrl = new AbortController();
    let engine = null;
    let cancelled = false;

    (async () => {
      try {
        // Download the model and the three.js chunk in parallel.
        const [buffer, { parseModel, buildDots, createEngine }] = await Promise.all([
          fetchModel(MODEL_URL, setProgress, ctrl.signal),
          import('./scene3d.js'),
        ]);
        if (cancelled) return;
        const dots = buildDots(await parseModel(buffer));
        if (cancelled) return;
        if (import.meta.env.DEV) console.info(`[hero] ${dots.count.toLocaleString()} dots`);
        setProgress(1);
        if (!reduced) await new Promise((r) => setTimeout(r, 380));
        if (cancelled) return;
        engine = createEngine({
          stage: stageRef.current,
          host: hostRef.current,
          dots,
          reduced,
          onReady: () => setPhase('ready'),
        });
      } catch (e) {
        if (cancelled || e.name === 'AbortError') return;
        console.error(e);
        setError(true);
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
      engine?.dispose();
    };
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <section className="hero" id="top" ref={hostRef} data-phase={phase} data-text={textIn ? 'in' : undefined}>
      <div className="rays" aria-hidden="true" />
      <div className="stage" ref={stageRef} aria-hidden="true" />

      <div
        className="loader"
        role="progressbar"
        aria-label="Loading the dots"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <svg viewBox="-110 -110 220 220" aria-hidden="true">
          {RING.map((c, i) => (
            <circle key={i} cx={c.cx} cy={c.cy} r={i / 96 < progress ? 2.2 : 1.6} data-on={i / 96 < progress ? '' : undefined} />
          ))}
        </svg>
        <span className="counter">{error ? 'Could not load' : String(pct).padStart(3, '0')}</span>
        <span className="label">{error ? 'Refresh to try again' : site.dotsLabel}</span>
      </div>

      <p className="h-status"><span className="dot" aria-hidden="true" />{site.status}</p>
      <div className="h-name">
        <h1>{site.name}<span className="h-role">{site.role}</span></h1>
        <p className="h-now">
          <span className="mono">{site.current.label}</span>
          <a href={site.current.url} target="_blank" rel="noreferrer">{site.current.company} <span aria-hidden="true">↗</span></a>
        </p>
      </div>
      <p className="h-tag"><Rich text={site.tagline} /></p>
      <a className="btn h-cta" href="#work">{site.workCta} <span aria-hidden="true">↓</span></a>
      <p className="h-hint">{site.hint}</p>
    </section>
  );
}

