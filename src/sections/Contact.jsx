import { contact, site } from '../content.js';
import { Rich } from '../Rich.jsx';
import Reveal from './Reveal.jsx';
import Eyebrow from './Eyebrow.jsx';

export default function Contact() {
  const mail = `mailto:${site.email}`;
  return (
    <>
      <section className="section contact" id="contact">
        <div className="container">
          <Reveal><Eyebrow dot>{contact.eyebrow}</Eyebrow></Reveal>
          <div className="row">
            <Reveal as="h2" className="display" delay={0.05}><Rich text={contact.heading} /></Reveal>
            <Reveal delay={0.15}><a className="circle-btn" href={mail} aria-label="Email me">↗</a></Reveal>
          </div>
          <Reveal className="links" delay={0.2}>
            <a className="link-u" href={mail}>{contact.cta}</a>
            {site.socials.map((s) => (
              <a key={s.label} className="btn-outline" href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>
            ))}
            {site.resumeUrl && <a className="btn" href={site.resumeUrl} target="_blank" rel="noreferrer">Download CV ↗</a>}
          </Reveal>
        </div>
      </section>
      <footer className="footer">
        <span className="mono">© {new Date().getFullYear()} {site.name}</span>
        <a className="mono" href="#top" style={{ textDecoration: 'none' }}>Back to surface ↑</a>
      </footer>
    </>
  );
}
