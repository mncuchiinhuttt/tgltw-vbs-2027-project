# TGLTW · VBS 2027 project page

The public project page for **TGLTW**, a live-first multimodal video retrieval system for the Video Browser Showdown 2027.

This repository is a React + Vite + TypeScript app styled with Tailwind CSS. The local `src/components/ui` primitives follow the shadcn/ui composition model, while `IsoIcon` turns Lucide icons into small top/front/side isometric marks used across the page.

## Links


- Public project page: <https://aegis.mncuchiinhuttt.dev/>
- System repository: <https://github.com/mncuchiinhuttt/aegis-vbs-2027> — README only; source code release pending.
- Paper and supplementary PDFs: will be released upon arXiv / camera-ready publication.
- Video Browser Showdown: <https://videobrowsershowdown.org/>
- VBS 2027 call for papers: <https://videobrowsershowdown.org/call-for-papers/>

## Evaluation and release status

Current production evaluation results have not been measured. GPU evaluation is blocked by unavailable server access and the lack of a real annotation manifest. The model-free production VQA replay/evaluator has been implemented but has not generated results.

The archived retrieval diagnostic records Recall@1 70.4%, Recall@5 76.0%, and MRR 0.7289. These values describe an earlier diagnostic only and do not validate the current pipeline. Provenance and limitations are recorded in the [archived diagnostic data](./public/artifacts/archived-retrieval-diagnostics.json). The project page labels interface material as illustration rather than live benchmark telemetry.

## Local development

```bash
npm install
npm run dev
```

Use `npm run build` to create the production bundle in `dist/`, or `npm run preview` to serve that bundle locally.

## Deployment

The project is configured for Cloudflare Workers (Workers Static Assets) via `wrangler.json`:

```bash
npm run deploy
```

- Build command: `npm run build`
- Assets directory: `./dist`
- Worker URL: <https://aegis-vbs-2027.vominhlongbentre.workers.dev>
- Custom domain target: `aegis.mncuchiinhuttt.dev` (requires deleting the external Vercel CNAME/A records in Cloudflare DNS first before attaching via Workers Custom Domains).

## Project structure

- [`src/App.tsx`](./src/App.tsx): page sections, task map, evaluation split, news tabs, and interactions.
- [`src/components/ui/`](./src/components/ui/): shadcn-style Button, Badge, Card, and Radix Tabs primitives.
- [`src/components/iso-icon.tsx`](./src/components/iso-icon.tsx): reusable isometric icon treatment.
- [`src/index.css`](./src/index.css): Tailwind theme tokens plus the small amount of CSS needed for the isometric planes and reveal motion.

Use <https://aegis.mncuchiinhuttt.dev/> as the public project entry point. The hero and footer link to the public README-only repository and explicitly mark the source code as pending. Do not substitute a private source-repository URL or describe the pipeline as already released.

Paper and supplementary PDF links are pending publication. Archived diagnostic data includes its provenance and limitations; it is not a current production benchmark.
