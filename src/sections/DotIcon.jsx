import { useEffect, useRef } from 'react';
import { prefersReduced } from '../hooks.js';

const SIZE = 112;      // CSS px
const DOTS = 1500;
const STAGGER = 450;   // ms: dots set off at slightly different times
const TRAVEL = 1050;   // ms: each dot's flight
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** Reads the icon's own pixels, so the dots fly in and land exactly where the icon's dots are. */
function sampleDots(img, res) {
  const c = document.createElement('canvas');
  c.width = c.height = res;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, res, res);
  const { data } = ctx.getImageData(0, 0, res, res);
  const lit = [];
  for (let y = 0; y < res; y++) for (let x = 0; x < res; x++) if (data[(y * res + x) * 4 + 3] > 70) lit.push((y * res + x) * 4);
  return Array.from({ length: Math.min(DOTS, lit.length) }, () => {
    const i = lit[Math.floor(Math.random() * lit.length)];
    const px = i / 4;
    return {
      x: ((px % res) / res) * SIZE,
      y: (Math.floor(px / res) / res) * SIZE,
      // Loose dots across the whole square, so no ring or circle ever forms.
      sx: Math.random() * SIZE,
      sy: Math.random() * SIZE,
      swirl: (Math.random() - 0.5) * 22,
      wait: Math.random() * STAGGER,
      r: 0.45 + Math.random() * 0.55,
      color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
    };
  });
}

/** A Why-me icon that gathers out of loose dots the first time it scrolls into view. */
export default function DotIcon({ src, delay = 0 }) {
  const box = useRef(null);
  const canvas = useRef(null);
  const img = useRef(null);

  useEffect(() => {
    const el = box.current;
    const still = () => prefersReduced() || document.documentElement.dataset.motion === 'off';
    const finish = () => { el.dataset.state = 'done'; };
    if (still()) { finish(); return; }

    let raf = 0;
    let timer = 0;
    const run = async () => {
      let dots;
      try {
        await img.current.decode();
        dots = sampleDots(img.current, SIZE * 2);
      } catch { finish(); return; }
      if (still() || !dots.length) { finish(); return; }
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cv = canvas.current;
      cv.width = cv.height = SIZE * dpr;
      const ctx = cv.getContext('2d');
      ctx.scale(dpr, dpr);
      el.dataset.state = 'playing';
      const t0 = performance.now();
      const frame = (now) => {
        const t = now - t0;
        if (t >= STAGGER + TRAVEL || still()) { finish(); return; }
        ctx.clearRect(0, 0, SIZE, SIZE);
        for (const d of dots) {
          const p = Math.max(0, Math.min(1, (t - d.wait) / TRAVEL));
          if (p <= 0) continue;
          const e = ease(p);
          const arc = Math.sin(e * Math.PI) * d.swirl;
          const dx = d.x - d.sx, dy = d.y - d.sy;
          const len = Math.hypot(dx, dy) || 1;
          ctx.globalAlpha = Math.min(1, p / 0.25);
          ctx.fillStyle = d.color;
          ctx.beginPath();
          ctx.arc(d.sx + dx * e - (dy / len) * arc, d.sy + dy * e + (dx / len) * arc, d.r, 0, 6.2832);
          ctx.fill();
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      timer = setTimeout(run, delay);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [delay]);

  return (
    <span className="t-icon" ref={box}>
      <img ref={img} src={src} alt="" width={SIZE} height={SIZE} />
      <canvas ref={canvas} aria-hidden="true" />
    </span>
  );
}
