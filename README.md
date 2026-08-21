# TGLTW · VBS 2027 project page

The public project page for **TGLTW**, a live-first multimodal video retrieval system for the Video Browser Showdown 2027.

This repository is a React + Vite + TypeScript app styled with Tailwind CSS. The local `src/components/ui` primitives follow the shadcn/ui composition model, while `IsoIcon` turns Lucide icons into small top/front/side isometric marks used across the page.

## Links

- Project page source: <https://github.com/mncuchiinhuttt/tgltw-vbs-2027-project>
- System repository: <https://github.com/mncuchiinhuttt/tgltw-vbs-2027>
- Paper source: <https://github.com/mncuchiinhuttt/tgltw-vbs-2027/blob/main/paper/main.tex>
- Video Browser Showdown: <https://videobrowsershowdown.org/>
- VBS 2027 call for papers: <https://videobrowsershowdown.org/call-for-papers/>

## Local development

```bash
npm install
npm run dev
```

Use `npm run build` to create the production bundle in `dist/`, or `npm run preview` to serve that bundle locally.

## Deployment

### Vercel

Import this repository and let Vercel detect Vite. If it asks for settings, use:

- Build command: `npm run build`
- Output directory: `dist`

### Cloudflare Pages

Create a Pages project from this repository and use:

- Build command: `npm run build`
- Build output directory: `dist`

The generated `dist/` folder is also suitable for Cloudflare Workers Static Assets if the project is later wrapped with Wrangler.

### GitHub Pages

Build with `npm run build` and publish the generated `dist/` directory through a Pages workflow. Vercel or Cloudflare Pages is the simpler default because both can build the Vite app directly from `main`.

## Project structure

- [`src/App.tsx`](./src/App.tsx): page sections, task map, evaluation split, news tabs, and interactions.
- [`src/components/ui/`](./src/components/ui/): shadcn-style Button, Badge, Card, and Radix Tabs primitives.
- [`src/components/iso-icon.tsx`](./src/components/iso-icon.tsx): reusable isometric icon treatment.
- [`src/index.css`](./src/index.css): Tailwind theme tokens plus the small amount of CSS needed for the isometric planes and reveal motion.

The paper currently uses the GitHub repository URL as the stable project-page URL. Once a Vercel or Cloudflare URL is deployed, replace that canonical URL in the paper with the deployed address.
