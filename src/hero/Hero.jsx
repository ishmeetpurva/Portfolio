import { useEffect, useRef, useState } from 'react';
import { site, asset } from '../content.js';
import { Rich } from '../Rich.jsx';
import { useMotion } from '../hooks.js';
import { fetchModel, MODEL_URL } from './fetchModel.js';
import { makeDots } from './makeDots.js';

const RING = Array.from({ length: 96 }, (_, i) => {
  const a = (i / 96) * Math.PI * 2 - Math.PI / 2;
  return { cx: Math.round(92 * Math.cos(a) * 100) / 100, cy: Math.round(92 * Math.sin(a) * 100) / 100 };
});

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
};

/** `active` is false while a case study is open, so a deep link never downloads the 3D model. */
export default function Hero({ active = true }) {
  const hostRef = useRef(null);
  const stageRef = useRef(null);
  const engineRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading');
  const [error, setError] = useState(false);
  const [motion, toggleMotion] = useMotion();
  const motionRef = useRef(motion);
  motionRef.current = motion;
  const [started, setStarted] = useState(active);
  useEffect(() => { if (active) setStarted(true); }, [active]);

  useEffect(() => { engineRef.current?.setPaused(!motion); }, [motion]);

  useEffect(() => {
    if (!started) return;
    if (!hasWebGL()) { setError(true); return; }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctrl = new AbortController();
    let cancelled = false;

    (async () => {
      try {
        // Download the model and the three.js chunk in parallel.
        const [buffer, { createEngine }] = await Promise.all([
          fetchModel(MODEL_URL, setProgress, ctrl.signal),
          import('./scene3d.js'),
        ]);
        if (cancelled) return;
        const dots = await makeDots(buffer);
        if (cancelled) return;
        if (import.meta.env.DEV) console.info(`[hero] ${dots.count.toLocaleString()} dots`);
        setProgress(1);
        if (!reduced && motionRef.current) await new Promise((r) => setTimeout(r, 380));
        if (cancelled) return;
        engineRef.current = createEngine({
          stage: stageRef.current,
          host: hostRef.current,
          dots,
          reduced,
          paused: !motionRef.current,
          onReady: () => setPhase('ready'),
          onLost: () => setError(true),
        });
        // The loader fades as soon as the dots start moving, so the two never overlap.
        setPhase((p) => (p === 'ready' ? p : 'assembling'));
      } catch (e) {
        if (cancelled || e.name === 'AbortError') return;
        console.error(e);
        setError(true);
      }
    })();

    return () => {
      cancelled = true;
      ctrl.abort();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [started]);

  const pct = Math.round(progress * 100);
  const loading = started && phase === 'loading' && !error;

  return (
    <section className="hero" id="top" data-phase={phase} data-error={error ? '' : undefined}>
      <h1 className="t-tile t-silver t-headline">
        <span><Rich text={site.tagline} /></span>
      </h1>

      <div className="t-tile t-bust" ref={hostRef}>
        <div className="rays" aria-hidden="true" />
        <div className="stage" ref={stageRef} aria-hidden="true" />
        {/* If 3D can't run, a still of the same portrait takes its place. */}
        {error && <img className="t-still" src={asset('hero/portrait.webp')} alt="Portrait of Ishmeet made of thousands of points of light" />}
        {/* The ring fades out visually, and leaves the accessibility tree, once loading ends. */}
        {started && !error && (
          <div className="loader" {...(loading ? { role: 'progressbar', 'aria-label': 'Loading the dots', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': pct } : { 'aria-hidden': true })}>
            <svg viewBox="-110 -110 220 220" aria-hidden="true">
              {RING.map((c, i) => (
                <circle key={i} cx={c.cx} cy={c.cy} r={i / 96 < progress ? 2.2 : 1.6} data-on={i / 96 < progress ? '' : undefined} />
              ))}
            </svg>
            <span className="counter" aria-hidden="true">{String(pct).padStart(3, '0')}</span>
            <span className="label" aria-hidden="true">{site.dotsLabel}</span>
          </div>
        )}
        <p className="t-id mono">{site.name} · {site.role}</p>
        <button className="motion-btn" type="button" aria-pressed={!motion} onClick={toggleMotion}>
          <span aria-hidden="true">{motion ? '❚❚' : '▶'}</span> Pause motion
        </button>
      </div>

      <div className="t-tile t-now">
        <span className="mono">{site.current.label}</span>
        <a href={site.current.url} target="_blank" rel="noreferrer"><img src={asset(site.current.logo)} alt={site.current.company} width="46" height="40" /><span className="sr-only"> (opens in a new tab)</span></a>
      </div>
      <div className="t-tile t-open">
        <span className="mono">{site.status}</span>
        <a className="t-btn" href="#work">{site.workCta} <span aria-hidden="true">&nbsp;↓</span></a>
      </div>
    </section>
  );
}
