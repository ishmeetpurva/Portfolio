import { useEffect, useRef, useState } from 'react';
import { testimonials, asset } from '../content.js';
import { prefersReduced } from '../hooks.js';
import { Rich } from '../Rich.jsx';
import Reveal from './Reveal.jsx';

const TICK = 200; // ms
/** Longer quotes stay up longer, so each one can be read before it changes. */
const readTime = (quote) => 3000 + quote.split(/\s+/).length * 180;

export default function Testimonials() {
  const [picked, setPicked] = useState(0);
  const stage = useRef(null);
  const inView = useRef(false);
  const hovered = useRef(false);
  const focused = useRef(false);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; }, { threshold: 0.5 });
    io.observe(stage.current);
    return () => io.disconnect();
  }, []);

  // The clock only runs while the quote can actually be read, and restarts on every change.
  useEffect(() => {
    let elapsed = 0;
    const wait = readTime(testimonials.items[picked].quote);
    const id = setInterval(() => {
      const held = hovered.current || focused.current || !inView.current || document.hidden;
      if (held || prefersReduced() || document.documentElement.dataset.motion === 'off') return;
      elapsed += TICK;
      if (elapsed >= wait) setPicked((picked + 1) % testimonials.items.length);
    }, TICK);
    return () => clearInterval(id);
  }, [picked]);

  const hold = {
    onPointerEnter: (e) => { if (e.pointerType === 'mouse') hovered.current = true; },
    onPointerLeave: () => { hovered.current = false; },
    onFocus: (e) => { focused.current = e.target.matches(':focus-visible'); },
    onBlur: () => { focused.current = false; },
  };

  return (
    <section className="t-sec" id="words">
      <Reveal className="t-head">
        <div>
          <span className="mono">{testimonials.eyebrow}</span>
          <h2 className="t-h2"><Rich text={testimonials.heading} /></h2>
        </div>
      </Reveal>
      <Reveal className="t-voices">
        <div className="t-people" role="group" aria-label="Choose a testimonial" {...hold}>
          {testimonials.items.map((t, i) => (
            <button
              className="t-person"
              type="button"
              key={t.name}
              aria-pressed={i === picked}
              onClick={() => setPicked(i)}
            >
              <img src={asset(t.image)} alt="" loading="lazy" />
              <span className="t-person-id">
                <span>{t.name}</span>
                <span>{t.role}, {t.company}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="t-tile t-silver t-stage" ref={stage} {...hold}>
          {/* Every quote stays in the same cell, so the box keeps the height of the longest one. */}
          {testimonials.items.map((t, i) => (
            <figure className="t-spot" data-active={i === picked} key={t.name}>
              <div
                className="t-mark"
                aria-hidden="true"
                style={{ '--mark': `url(${asset('quote-mark.webp')})` }}
              />
              <div className="t-spot-copy">
                <p className="t-pull">“{t.pull}”</p>
                <blockquote>{t.quote}</blockquote>
              </div>
              <figcaption>{t.name} <span>· {t.role}, {t.company}</span></figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
