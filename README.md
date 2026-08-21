# TGLTW · VBS 2027 project page

The public project page for **TGLTW**, a live-first multimodal video retrieval system for the Video Browser Showdown 2027.

## Links

- Project page source: <https://github.com/mncuchiinhuttt/tgltw-vbs-2027-project>
- System repository: <https://github.com/mncuchiinhuttt/tgltw-vbs-2027>
- Paper source: <https://github.com/mncuchiinhuttt/tgltw-vbs-2027/blob/main/paper/main.tex>
- Video Browser Showdown: <https://videobrowsershowdown.org/>
- VBS 2027 call for papers: <https://videobrowsershowdown.org/call-for-papers/>

## Local preview

This is a framework-free static site. From this directory, run:

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Deployment

No build step or environment variables are required.

### Vercel

Import this repository, select **Other** as the framework, leave the build command empty, and use the repository root as the output directory.

### Cloudflare Pages

Create a Pages project from this repository, leave the build command empty, and set the output directory to `.` (the repository root).

### GitHub Pages

In **Settings → Pages**, choose **Deploy from a branch**, select `main`, and choose `/ (root)`.

## Updating the page

The hero, task map, evaluation notes, links, and news feed live in [`index.html`](./index.html). Styling is in [`styles.css`](./styles.css), and the only behavior—mobile navigation, reveal transitions, news filters, and citation copying—is in [`script.js`](./script.js).

The paper currently uses the GitHub repository URL as the stable project-page URL. Once a Vercel or Cloudflare URL is deployed, replace that canonical URL in the paper with the deployed address.
