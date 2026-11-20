import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Hero from './hero/Hero.jsx';
import About from './sections/About.jsx';
import Projects from './sections/Projects.jsx';
import WhyHire from './sections/WhyHire.jsx';
import Qualities from './sections/Qualities.jsx';
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
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    const onScroll = () => { const s = window.scrollY > 80; setShow(s); if (!s) setOpen(false); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    nav.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); };
  }, []);
  return (
    <header className={`nav ${show ? 'show' : ''} ${open ? 'open' : ''}`} aria-hidden={!show}>
      <a className="logo" href="#top" tabIndex={show ? 0 : -1}>{site.logo}</a>
      <nav aria-label="Main">
        <ul id="nav-menu">
          {nav.map((n) => (
            <li key={n.id}><a href={`#${n.id}`} className={active === n.id ? 'active' : ''} aria-current={active === n.id ? 'true' : undefined} tabIndex={show ? 0 : -1} onClick={() => setOpen(false)}>{n.label}</a></li>
          ))}
          {/* On phones the "Get in touch" button folds into the menu */}
          <li className="nav-m-only"><a href="#contact" tabIndex={show ? 0 : -1} onClick={() => setOpen(false)}>Contact</a></li>
        </ul>
      </nav>
      <div className="nav-right">
        <a className="btn-outline" href="#contact" tabIndex={show ? 0 : -1}>Get in touch ↗</a>
        <button className="nav-toggle" type="button" aria-expanded={open} aria-controls="nav-menu" aria-label="Menu" tabIndex={show ? 0 : -1} onClick={() => setOpen((o) => !o)}>
          <span aria-hidden="true">{open ? '✕' : '☰'}</span>
        </button>
      </div>
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
      {!slug && <a className="skip" href="#about">Skip to content</a>}
      {!slug && <Nav />}
      <main>
        <Hero active={!slug} />
        <div className="hero-strip">
          <span className="mono"><span className="mouse" aria-hidden="true" />Scroll to explore</span>
          <span className="mono coords">+ Depth 024 m</span>
          <span className="mono">01 / 06</span>
        </div>
        <About />
        <Projects />
        <WhyHire />
        <Qualities />
        <Testimonials />
        <Contact />
      </main>
      </div>
    </>
  );
}
