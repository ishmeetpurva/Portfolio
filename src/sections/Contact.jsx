import { useState } from 'react';
import { contact, site } from '../content.js';
import { Rich } from '../Rich.jsx';
import Reveal from './Reveal.jsx';
import Eyebrow from './Eyebrow.jsx';

export default function Contact() {
  const mail = `mailto:${site.email}`;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <>
      <section className="section contact" id="contact">
        <div className="container">
          <Reveal><Eyebrow dot>{contact.eyebrow}</Eyebrow></Reveal>
          <div className="row">
            <Reveal as="h2" className="display" delay={0.05}><Rich text={contact.heading} /></Reveal>
            <Reveal delay={0.15}><a className="circle-btn" href={mail} aria-label="Email me">↗</a></Reveal>
          </div>
          {/* The address is visible, so it works without a mail app set up. */}
          <Reveal className="email-row" delay={0.18}>
            <a href={mail}>{site.email}</a>
            <button className="copy-btn" type="button" onClick={copy}>{copied ? 'Copied' : 'Copy email'}</button>
            <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
          </Reveal>
          <Reveal className="links" delay={0.2}>
            <a className="link-u" href={mail}>{contact.cta}</a>
            {site.socials.map((s) => (
              <a key={s.label} className="btn-outline" href={s.url} target="_blank" rel="noreferrer">{s.label} <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>
            ))}
            {site.resumeUrl && <a className="btn" href={site.resumeUrl} target="_blank" rel="noreferrer">View CV <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>}
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
