import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages: set BASE to "/<repo-name>/" (the deploy workflow does this automatically).
// For a "<username>.github.io" repo, use "/".
export default defineConfig({
  base: process.env.BASE || '/',
  plugins: [react()],
  build: { chunkSizeWarningLimit: 900 },
});
