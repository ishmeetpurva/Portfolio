import { useState } from 'react';
import { contact, site } from '../content.js';
import { Rich } from '../Rich.jsx';
import Reveal from './Reveal.jsx';

const NewTab = () => <><span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></>;

export default function Contact() {
  const mail = `mailto:${site.email}`;
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(site.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <section className="t-contact" id="contact">
      <Reveal>
        <span className="mono">{contact.eyebrow}</span>
        <h2 className="t-h2"><Rich text={contact.heading} /></h2>
        {/* The address is visible, so it works without a mail app set up. */}
        <div className="email-row">
          <a href={mail}>{site.email}</a>
          <button className="copy-btn" type="button" onClick={copy}>{copied ? 'Copied' : 'Copy email'}</button>
          <span className="sr-only" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
        </div>
      </Reveal>
      {/* Not a Reveal: this row sits at the very bottom of the page, where it might never scroll far enough to trigger one. */}
      <div className="t-links">
        <a className="t-btn" href={mail}>{contact.cta}</a>
        {site.socials.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noreferrer">{s.label}<NewTab /></a>
        ))}
        {site.resumeUrl && <a href={site.resumeUrl} target="_blank" rel="noreferrer">View CV<NewTab /></a>}
      </div>
    </section>
  );
}
