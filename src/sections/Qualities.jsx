import { qualities } from '../content.js';
import { Rich } from '../Rich.jsx';
import Reveal from './Reveal.jsx';
import Eyebrow from './Eyebrow.jsx';

export default function Qualities() {
  return (
    <section className="section trench" id="qualities">
      <div className="container">
        <div className="sec-head">
          <div>
            <Reveal><Eyebrow num="05">{qualities.eyebrow}</Eyebrow></Reveal>
            <Reveal as="h2" className="display md" delay={0.05}><Rich text={qualities.heading} /></Reveal>
          </div>
        </div>
        <div className="qual-grid">
          {qualities.items.map((q, i) => (
            <Reveal className="qual" key={q.title} delay={(i % 3) * 0.08}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{q.title}</h3>
              <p>{q.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
