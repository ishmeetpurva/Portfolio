# Ishmeet Kaur — Portfolio

A one-page portfolio. It opens on a full-screen portrait of a bust drawn with 66,000 glowing dots in WebGL, then scrolls through About, Selected work, Why hire me, Qualities, Kind words and Contact.

Built with **React + Vite + three.js** and deployed to **GitHub Pages** by GitHub Actions.

## Edit the content

All text lives in [`src/content.js`](src/content.js). Anything marked `[PLACEHOLDER]` still needs your real details.

- Wrap **one word per headline** in asterisks to set it in the italic serif accent: `"Let's go *deeper.*"`
- To use a screenshot for a project, put the image in `public/` and add `image: "my-shot.jpg"` to that project.
- To link your résumé, add `public/resume.pdf` and set `resumeUrl: "resume.pdf"`.

## Case studies

The KFC Dubai, GetSociable and Soil case studies live at `#/work/<slug>` inside this site. Their content was ported from the old site ([ishmeetpurva/Portfolio](https://github.com/ishmeetpurva/Portfolio)) and is stored as HTML in `src/caseStudies/`, with images in `public/cs/`. They're styled by `src/caseStudy.css`.

## Link previews

`public/og-cover.jpg` is the image shown when the site is shared on LinkedIn, Slack and similar. The deploy workflow fills in the absolute site URL for it automatically.

## Fonts

- **Fraunces** for the serif accent and numbers. It loads from Google Fonts.
- **Gordita** for the sans text, self-hosted from `public/fonts/` (Light, Regular, Medium, Bold; Latin subset as `.woff2`). **Outfit** is the fallback while it loads.
- **Geist Mono** for the small uppercase labels.

## Run locally

```bash
npm install
npm run dev
```

## Go live on GitHub Pages

1. Create a GitHub repository and push this folder to its `main` branch.
2. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Each push to `main` builds and deploys the site to `https://<username>.github.io/<repo>/`. If the repo is named `<username>.github.io`, it deploys to `https://<username>.github.io/` instead.

## How this page was made

- The hero streams an untextured GLB bust (self-hosted in `public/models/`) and shows the real download progress on a 96-dot ring.
- 330,000 points are sampled from the mesh surface and thinned on a voxel grid so the density stays even. That leaves 66,000 dots.
- A wraparound visor is fitted to the face's height map and drawn from its own dots.
- Each dot gets a ridge/crease value and a thin-strand value from its neighbours. These drive the shading.
- A custom shader handles the entrance from the ring, breathing, head turn, cursor light, a single shine sweep and a repeating glint.
- Faint dust drifts upward and film grain sits over the whole page. `prefers-reduced-motion` is respected throughout.
