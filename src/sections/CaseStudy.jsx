import { useEffect, useRef, useState } from 'react';
import index from '../caseStudies/index.json';
import kfc from '../caseStudies/kfc.html?raw';
import getsociable from '../caseStudies/getsociable.html?raw';
import soil from '../caseStudies/soil.html?raw';
import { work, asset } from '../content.js';

// Case-study bodies were ported from the old site (github.com/ishmeetpurva/Portfolio).
const HTML = { kfc, getsociable, soil };

export default function CaseStudy({ slug }) {
  const meta = index[slug];
  const article = useRef(null);
  const [active, setActive] = useState(meta.sections[0]?.id);

  // Order of "next project" follows the work grid.
  const order = work.projects.filter((p) => p.url?.startsWith('#/work/'));
  const pos = order.findIndex((p) => p.url === `#/work/${slug}`);
  const next = order[(pos + 1) % order.length];
  const project = order[pos];

  useEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = `${project?.title ?? meta.title} — Ishmeet Kaur`;
    const els = meta.sections.map((s) => article.current.querySelector(`#${CSS.escape(s.id)}`)).filter(Boolean);
    // Active section = the last one whose top has passed 40% of the viewport.
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = els[0]?.id;
      for (const el of els) if (el.getBoundingClientRect().top <= line) current = el.id;
      setActive(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); document.title = prev; };
  }, [slug]);

  const jump = (id) => article.current.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="cs-page">
      <a className="skip" href="#content" onClick={(e) => { e.preventDefault(); document.getElementById('content')?.focus(); }}>Skip to content</a>
      <header className="cs-top">
        <a className="cs-back" href="#work">← All work</a>
        <span className="mono">Case study · {project?.title}</span>
        <a className="btn-outline" href="#contact">Get in touch ↗</a>
      </header>

      <main className="cs-wrap" id="content" tabIndex={-1}>
        <nav className="cs-side" aria-label="Case study sections">
          {meta.sections.map((s, i) => (
            <button key={s.id} className={active === s.id ? 'on' : ''} onClick={() => jump(s.id)}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>{s.label}
            </button>
          ))}
        </nav>
        <article className="cs-article" ref={article} dangerouslySetInnerHTML={{ __html: HTML[slug] }} />
      </main>

      {next && next.url !== `#/work/${slug}` && (
        <nav aria-label="Next case study">
        <a className="cs-next" href={next.url} aria-label={`Next case study: ${next.title}`}>
          <div>
            <span className="eyebrow"><span className="num">Next</span><span className="slash">/</span><span>Case study</span></span>
            <span className="display md">{next.title} <em className="accent">→</em></span>
          </div>
          <img src={asset(next.image)} alt="" loading="lazy" />
        </a>
        </nav>
      )}
    </div>
  );
}
