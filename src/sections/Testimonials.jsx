import { useState } from 'react';
import { testimonials, asset } from '../content.js';
import { Rich } from '../Rich.jsx';
import Reveal from './Reveal.jsx';

export default function Testimonials() {
  const [picked, setPicked] = useState(0);

  return (
    <section className="t-sec" id="words">
      <Reveal className="t-head">
        <div>
          <span className="mono">{testimonials.eyebrow}</span>
          <h2 className="t-h2"><Rich text={testimonials.heading} /></h2>
        </div>
      </Reveal>
      <Reveal className="t-voices">
        <div className="t-people" role="group" aria-label="Choose a testimonial">
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
        <div className="t-tile t-silver t-stage">
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
