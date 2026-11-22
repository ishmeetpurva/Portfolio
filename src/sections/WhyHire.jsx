import { why, asset } from '../content.js';
import { Rich } from '../Rich.jsx';
import Reveal from './Reveal.jsx';
import DotIcon from './DotIcon.jsx';

export default function WhyHire() {
  return (
    <section className="t-sec" id="why">
      <Reveal className="t-head">
        <div>
          <span className="mono">{why.eyebrow}</span>
          <h2 className="t-h2"><Rich text={why.heading} /></h2>
        </div>
      </Reveal>
      <ol className="t-why">
        {why.reasons.map((r, i) => (
          <Reveal as="li" className="t-tile t-reason" key={r.title} delay={0.06 * i}>
            <span className="t-reason-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <DotIcon src={asset(r.icon)} delay={i * 140} />
            <h3>{r.title}</h3>
            <p>{r.text}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
