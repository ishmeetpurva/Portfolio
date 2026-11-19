import { useRef } from 'react';
import { work, asset } from '../content.js';
import { Rich } from '../Rich.jsx';
import { prefersReduced } from '../hooks.js';
import Reveal from './Reveal.jsx';
import Eyebrow from './Eyebrow.jsx';

// Placeholder artwork in the site palette. Add `image: "my-shot.jpg"` (in /public) to a project to replace it.
const ART = [
  // concentric tunnel
  <svg key="a" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="ga" cx="70%" cy="10%" r="90%"><stop offset="0" stopColor="#2f86c9" /><stop offset=".45" stopColor="#123a5e" /><stop offset="1" stopColor="#07111e" /></radialGradient>
      <linearGradient id="sa" x1="0" x2="1"><stop offset="0" stopColor="#f2f5f9" /><stop offset="1" stopColor="#6f8aa6" /></linearGradient>
    </defs>
    <rect width="400" height="250" fill="url(#ga)" />
    {Array.from({ length: 9 }, (_, i) => (
      <ellipse key={i} cx="200" cy="140" rx={150 - i * 16} ry={118 - i * 13} fill="none" stroke="url(#sa)" strokeWidth={6 - i * 0.55} opacity={0.9 - i * 0.08} />
    ))}
  </svg>,
  // spiral shell
  <svg key="b" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="gb" cx="40%" cy="40%" r="80%"><stop offset="0" stopColor="#1c4f86" /><stop offset="1" stopColor="#07111e" /></radialGradient>
    </defs>
    <rect width="400" height="250" fill="url(#gb)" />
    {Array.from({ length: 60 }, (_, i) => {
      const a = i * 0.32, r = 6 + i * 2.1;
      return <line key={i} x1={200 + Math.cos(a) * r * 0.4} y1={125 + Math.sin(a) * r * 0.4} x2={200 + Math.cos(a) * r} y2={125 + Math.sin(a) * r} stroke="#dfe7f0" strokeWidth="1.6" opacity={0.25 + i / 90} />;
    })}
  </svg>,
  // wave field
  <svg key="c" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2f86c9" /><stop offset="1" stopColor="#07111e" /></linearGradient>
    </defs>
    <rect width="400" height="250" fill="url(#gc)" />
    {Array.from({ length: 18 }, (_, i) => {
      const y = 70 + i * 10;
      let d = `M0 ${y}`;
      for (let x = 0; x <= 400; x += 20) d += ` L${x} ${y + Math.sin(x / 40 + i * 0.5) * (6 + i * 0.6)}`;
      return <path key={i} d={d} fill="none" stroke="#c9d6e4" strokeWidth="1" opacity={0.15 + i * 0.04} />;
    })}
  </svg>,
];

function ProjectCard({ p, i }) {
  const card = useRef(null);
  const media = useRef(null);
  const onMove = (e) => {
    if (prefersReduced()) return;
    const r = media.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.current.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 8}deg) rotateX(${(0.5 - y) * 8}deg)`;
    media.current.style.setProperty('--mx', `${x * 100}%`);
    media.current.style.setProperty('--my', `${y * 100}%`);
  };
  const onLeave = () => { card.current.style.transform = ''; };
  const Tag = p.url ? 'a' : 'div';
  const external = /^https?:/.test(p.url || '');
  return (
    <Reveal delay={i * 0.1}>
      <Tag className="project" href={p.url || undefined} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="tilt" ref={card}>
          <div className="media" ref={media}>
            <span className="fig">Fig. {String(i + 1).padStart(3, '0')}</span>
            {p.image ? <img src={asset(p.image)} alt={`${p.title} cover`} loading="lazy" /> : ART[i % ART.length]}
            {p.cta && <span className="cta-chip">{p.cta} {external ? '↗' : '→'}</span>}
            <div className="sheen" />
          </div>
        </div>
        <div className="meta">
          <span className="mono">{p.category}</span>
          <span className="mono">{p.year}</span>
        </div>
        <div className="title-row">
          {p.logo && <img className="logo-mark" src={asset(p.logo)} alt="" />}
          <h3>{p.title}</h3>
        </div>
        {p.role && <span className="mono role">{p.role}</span>}
        <p>{p.summary}</p>
        {p.approach && <p className="approach"><span className="mono">Approach</span>{p.approach}</p>}
        {p.impact && <p className="impact">{p.impact}</p>}
        <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
      </Tag>
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
