import { work, asset } from '../content.js';
import { Rich } from '../Rich.jsx';
import Reveal from './Reveal.jsx';

function ProjectCard({ p, i }) {
  const external = /^https?:/.test(p.url || '');
  return (
    <Reveal className="t-tile project" delay={(i % 3) * 0.08}>
      <img src={asset(p.image)} alt="" loading="lazy" />
      <div className="t-cap">
        <div className="t-cap-meta mono">
          <span>{p.role}</span>
          <span>{p.platform} · {p.year}</span>
        </div>
        <div className="t-cap-title">
          <img className="logo-mark" src={asset(p.logo)} alt="" />
          <h3>
            <a href={p.url} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
              {p.title}<span className="sr-only">{`: ${p.cta}${external ? ' (opens in a new tab)' : ''}`}</span>
            </a>
          </h3>
        </div>
        <p>{p.summary}</p>
        <div className="t-cap-foot">
          <div className="t-result">
            <strong>{p.metric}</strong>
            <span className="mono">{p.metricLabel}</span>
          </div>
          <span className="t-cta" aria-hidden="true">{p.cta} {external ? '↗' : '→'}</span>
        </div>
      </div>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section className="t-sec" id="work">
      <Reveal className="t-head">
        <div>
          <span className="mono">{work.eyebrow}</span>
          <h2 className="t-h2"><Rich text={work.heading} /></h2>
        </div>
        <a href={work.linkUrl} target="_blank" rel="noreferrer">{work.linkLabel}</a>
      </Reveal>
      <div className="t-grid">
        {work.projects.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
      </div>
    </section>
  );
}
