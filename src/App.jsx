import { lazy, Suspense, useEffect, useState } from 'react';
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
  useEffect(() => {
    const onHash = () => {
      const next = read();
      setSlug(next);
      if (!next) {
        // Returning home: jump to the requested section once it's visible again.
        const id = window.location.hash.slice(1);
        requestAnimationFrame(() => {
          const el = id && document.getElementById(id);
          if (el) el.scrollIntoView(); else if (!id) window.scrollTo(0, 0);
        });
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return slug;
}

function Nav() {
  const [show, setShow] = useState(false);
  const [active, setActive] = useState('');
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
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
    <header className={`nav ${show ? 'show' : ''}`} aria-hidden={!show}>
      <a className="logo" href="#top" tabIndex={show ? 0 : -1}>{site.logo}</a>
      <ul>
        {nav.map((n) => (
          <li key={n.id}><a href={`#${n.id}`} className={active === n.id ? 'active' : ''} tabIndex={show ? 0 : -1}>{n.label}</a></li>
        ))}
      </ul>
      <a className="btn-outline" href="#contact" tabIndex={show ? 0 : -1}>Get in touch ↗</a>
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
      {!slug && <Nav />}
      <main>
        <Hero />
        <div className="hero-strip">
          <span className="mono"><span className="mouse" aria-hidden="true" />Scroll to explore</span>
          <span className="mono coords">+ Depth 024 m</span>
          <span className="mono">01 / {String(nav.length + 3).padStart(2, '0')}</span>
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
