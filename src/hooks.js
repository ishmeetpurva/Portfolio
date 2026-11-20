import { useEffect, useRef, useState } from 'react';

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Adds `.in` once the element scrolls into view. */
export function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); }
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** True once the element has been seen. */
export function useSeen(threshold = 0.4) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen];
}

/**
 * Site-wide "Pause motion" switch (WCAG 2.2.2). Stored on <html data-motion> so CSS loops can
 * pause too, and remembered for the next visit. Starts off when the OS asks for reduced motion.
 */
const MOTION_KEY = 'motion';
const readMotion = () => {
  if (typeof window === 'undefined') return true;
  try { const v = localStorage.getItem(MOTION_KEY); if (v) return v === 'on'; } catch {}
  return !prefersReduced();
};
if (typeof document !== 'undefined') document.documentElement.dataset.motion = readMotion() ? 'on' : 'off';

export function useMotion() {
  const [on, setOn] = useState(readMotion);
  useEffect(() => {
    const sync = () => setOn(document.documentElement.dataset.motion !== 'off');
    window.addEventListener('motionchange', sync);
    return () => window.removeEventListener('motionchange', sync);
  }, []);
  const toggle = () => {
    const next = document.documentElement.dataset.motion === 'off';
    document.documentElement.dataset.motion = next ? 'on' : 'off';
    try { localStorage.setItem(MOTION_KEY, next ? 'on' : 'off'); } catch {}
    window.dispatchEvent(new Event('motionchange'));
  };
  return [on, toggle];
}
