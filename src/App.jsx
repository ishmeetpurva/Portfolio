import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Hero from './hero/Hero.jsx';
import About from './sections/About.jsx';
import Projects from './sections/Projects.jsx';
import WhyHire from './sections/WhyHire.jsx';
import Testimonials from './sections/Testimonials.jsx';
import Contact from './sections/Contact.jsx';
import caseIndex from './caseStudies/index.json';

// Case-study pages (and their HTML) load only when one is opened.
const CaseStudy = lazy(() => import('./sections/CaseStudy.jsx'));
const CASE_SLUGS = Object.keys(caseIndex);
import { nav, site } from './content.js';

/** Hash routing so case studies work on GitHub Pages: #/work/<slug>. Anything else is the home page. */
function useRoute() {
  const read = () => {
    const m = window.location.hash.match(/^#\/work\/([\w-]+)/);
    return m && CASE_SLUGS.includes(m[1]) ? m[1] : null;
  };
  const [slug, setSlug] = useState(read);
  const prev = useRef(slug);
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    const onHash = () => {
      const next = read();
      const from = prev.current;
      prev.current = next;
      setSlug(next);
      if (!next && from) {
        // Leaving a case study: put focus (and the view) back on the card that opened it.
        requestAnimationFrame(() => {
          const card = document.querySelector(`.project a[href="#/work/${from}"]`);
          const id = window.location.hash.slice(1);
          const target = (id && id !== 'work' && document.getElementById(id)) || card;
          if (target) { target.scrollIntoView({ block: 'center' }); (target === card ? card : target).focus?.({ preventScroll: true }); }
        });
      } else if (!next) {
        const id = window.location.hash.slice(1);
        requestAnimationFrame(() => { if (!id) window.scrollTo(0, 0); });
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return slug;
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    [...nav.map((n) => n.id), 'contact'].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  const links = [...nav, { id: 'contact', label: 'Get in touch ↗' }];
  return (
    <header className={`nav ${open ? 'open' : ''}`}>
      <a className="logo" href="#top">{site.logo}</a>
      <nav aria-label="Main">
        <ul id="nav-menu">
          {links.map((n) => (
            <li key={n.id}><a href={`#${n.id}`} className={active === n.id ? 'active' : ''} aria-current={active === n.id ? 'true' : undefined} onClick={() => setOpen(false)}>{n.label}</a></li>
          ))}
        </ul>
      </nav>
      <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="nav-menu" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
        <span aria-hidden="true">{open ? '✕' : '☰'}</span>
      </button>
    </header>
  );
}

export default function App() {
  const slug = useRoute();
  return (
    <>
      <div className="grain" aria-hidden="true" />
      {slug && <Suspense fallback={<div className="cs-page" />}><CaseStudy key={slug} slug={slug} /></Suspense>}
      {/* Home stays mounted while a case study is open, so the 3D hero isn't rebuilt on return. */}
      <div hidden={!!slug}>
        <div className="t-page">
          {!slug && <a className="skip" href="#about">Skip to content</a>}
          {!slug && <Nav />}
          <main className="t-main">
            <Hero active={!slug} />
            <About />
            <Projects />
            <WhyHire />
            <div className="t-tail">
              <Testimonials />
              <Contact />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
