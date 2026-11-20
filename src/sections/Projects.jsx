import { useRef } from 'react';
import { work, asset } from '../content.js';
import { Rich } from '../Rich.jsx';
import { prefersReduced } from '../hooks.js';
import Reveal from './Reveal.jsx';
import Eyebrow from './Eyebrow.jsx';

function ProjectCard({ p, i }) {
  const card = useRef(null);
  const media = useRef(null);
  const onMove = (e) => {
    if (prefersReduced() || document.documentElement.dataset.motion === 'off') return;
    const r = media.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.current.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 8}deg) rotateX(${(0.5 - y) * 8}deg)`;
    media.current.style.setProperty('--mx', `${x * 100}%`);
    media.current.style.setProperty('--my', `${y * 100}%`);
  };
  const onLeave = () => { card.current.style.transform = ''; };
  const external = /^https?:/.test(p.url || '');
  return (
    <Reveal delay={i * 0.1}>
      <div className="project" onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="tilt" ref={card}>
          <div className="media" ref={media}>
            <span className="fig" aria-hidden="true">Fig. {String(i + 1).padStart(3, '0')}</span>
            {p.image && <img src={asset(p.image)} alt="" loading="lazy" />}
            {p.cta && <span className="cta-chip" aria-hidden="true">{p.cta} {external ? '↗' : '→'}</span>}
            <div className="sheen" />
          </div>
        </div>
        <div className="meta">
          <span className="mono">{p.category}</span>
          <span className="mono">{p.year}</span>
        </div>
        <div className="title-row">
          {p.logo && <img className="logo-mark" src={asset(p.logo)} alt="" />}
          <h3>
            {p.url ? (
              <a href={p.url} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                {p.title}<span className="sr-only">{`: ${p.cta || 'open'}${external ? ' (opens in a new tab)' : ''}`}</span>
              </a>
            ) : p.title}
          </h3>
        </div>
        {p.role && <span className="mono role">{p.role}</span>}
        <p>{p.summary}</p>
        {p.approach && <p className="approach"><span className="mono">Approach</span>{p.approach}</p>}
        {p.impact && <p className="impact">{p.impact}</p>}
        <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
      </div>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <section className="section trench" id="work">
      <div className="container">
        <div className="sec-head">
          <div>
            <Reveal><Eyebrow num="03">{work.eyebrow}</Eyebrow></Reveal>
            <Reveal as="h2" className="display md" delay={0.05}>
              <Rich text={work.heading} /><span className="count">({String(work.projects.length).padStart(2, '0')})</span>
            </Reveal>
          </div>
          <Reveal delay={0.1}><a className="link-u" href={work.linkUrl} target="_blank" rel="noreferrer">{work.linkLabel}</a></Reveal>
        </div>
        <div className="projects">
          {work.projects.map((p, i) => <ProjectCard key={p.title + i} p={p} i={i} />)}
        </div>
      </div>
    </section>
  );
}
