import { useEffect, useRef, useState } from 'react';
import { why } from '../content.js';
import { Rich } from '../Rich.jsx';
import { prefersReduced } from '../hooks.js';
import Reveal from './Reveal.jsx';
import Eyebrow from './Eyebrow.jsx';

function SkillSphere({ skills, playing }) {
  const box = useRef(null);
  const tags = useRef([]);
  const state = useRef({ rx: 0.3, ry: 0, vx: 0, vy: 0.0035, drag: null });
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useEffect(() => {
    const n = skills.length;
    const pts = skills.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = i * Math.PI * (3 - Math.sqrt(5));
      return [Math.cos(th) * r, y, Math.sin(th) * r];
    });
    const s = state.current;
    const reduced = prefersReduced();
    let raf = 0;
    let visible = false;

    const draw = () => {
      const R = Math.min(box.current.clientWidth, box.current.clientHeight) * 0.42;
      const cx = Math.cos(s.rx), sx = Math.sin(s.rx), cy = Math.cos(s.ry), sy = Math.sin(s.ry);
      pts.forEach(([x, y, z], i) => {
        const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
        const y2 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
        const depth = (z2 + 1) / 2;
        const el = tags.current[i];
        if (!el) return;
        el.style.transform = `translate(-50%, -50%) translate3d(${x1 * R}px, ${y2 * R}px, ${z2 * R}px) scale(${0.7 + depth * 0.45})`;
        el.style.opacity = String(0.22 + depth * 0.78);
        el.style.color = depth > 0.8 ? '#f2f5f9' : depth > 0.45 ? '#c9d6e4' : '#8fb8d8';
      });
    };
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!s.drag && playingRef.current && !reduced) { s.ry += s.vy; s.rx += s.vx; s.vx *= 0.95; s.vy += (0.0035 - s.vy) * 0.02; }
      draw();
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) loop(); else draw();
    });
    io.observe(box.current);
    draw();

    const el = box.current;
    const down = (e) => { s.drag = { x: e.clientX, y: e.clientY }; el.setPointerCapture(e.pointerId); };
    const move = (e) => {
      if (!s.drag) return;
      const dx = e.clientX - s.drag.x, dy = e.clientY - s.drag.y;
      s.drag = { x: e.clientX, y: e.clientY };
      s.ry += dx * 0.006; s.rx -= dy * 0.006;
      s.vy = dx * 0.0015; s.vx = -dy * 0.0015;
      if (!visible || reduced) draw();
    };
    const up = () => { s.drag = null; };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      cancelAnimationFrame(raf); io.disconnect();
      el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
    };
  }, [skills]);

  return (
    <div className="sphere" ref={box} aria-label={`Skills: ${skills.join(', ')}`} role="img">
      {skills.map((s, i) => <span key={s} ref={(el) => (tags.current[i] = el)} aria-hidden="true">{s}</span>)}
    </div>
  );
}

export default function WhyHire() {
  const [playing, setPlaying] = useState(true);
  return (
    <section className="section" id="why">
      <div className="container split">
        <div>
          <Reveal><Eyebrow num="04">{why.eyebrow}</Eyebrow></Reveal>
          <Reveal as="h2" className="display md" delay={0.05}><Rich text={why.heading} /></Reveal>
          <ol className="reasons">
            {why.reasons.map((r, i) => (
              <Reveal as="li" key={r.title} delay={0.08 * i}>
                <span className="n">{String(i + 1).padStart(2, '0')}</span>
                <div><h3>{r.title}</h3><p>{r.text}</p></div>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal className="lab" delay={0.1}>
          <div className="lab-top">
            <span className="mono live">Live 3D</span>
            <span className="mono">Skills / {String(why.skills.length).padStart(3, '0')}</span>
          </div>
          <SkillSphere skills={why.skills} playing={playing} />
          <div className="lab-bottom">
            <div>
              <span className="mono">Toolkit · drag to rotate</span>
              <h3>What I work with</h3>
            </div>
            <button className="round-btn" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause rotation' : 'Play rotation'}>
              {playing ? '❚❚' : '▶'}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
