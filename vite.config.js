import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Local builds have no live URL; the deploy workflow sets VITE_SITE_URL for real link previews.
process.env.VITE_SITE_URL ??= '';

// Content-Security-Policy for the built site only (the dev server needs inline scripts for hot reload).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval'", // the model's meshopt decoder is WebAssembly
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
].join('; ');

const csp = {
  name: 'csp-meta',
  apply: 'build',
  transformIndexHtml: (html) => html.replace('<meta charset="utf-8" />', `<meta charset="utf-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`),
};

// GitHub Pages: set BASE to "/<repo-name>/" (the deploy workflow does this automatically).
// For a "<username>.github.io" repo, use "/".
export default defineConfig({
  base: process.env.BASE || '/',
  plugins: [react(), csp],
  build: { chunkSizeWarningLimit: 900 },
});
