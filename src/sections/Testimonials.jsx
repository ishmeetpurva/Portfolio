import { testimonials, asset } from '../content.js';
import { Rich } from '../Rich.jsx';
import Reveal from './Reveal.jsx';

export default function Testimonials() {
  return (
    <section className="t-sec" id="words">
      <Reveal className="t-head">
        <div>
          <span className="mono">{testimonials.eyebrow}</span>
          <h2 className="t-h2"><Rich text={testimonials.heading} /></h2>
        </div>
      </Reveal>
      <div className="t-grid">
        {testimonials.items.map((t, i) => (
          <Reveal as="figure" className="t-tile t-silver t-quote" key={t.name} delay={0.08 * i}>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              <img src={asset(t.image)} alt="" loading="lazy" />
              <span>{t.name}<span>{t.role}, {t.company}</span></span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
