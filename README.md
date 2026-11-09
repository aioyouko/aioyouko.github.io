# Heyang Chen — personal homepage and group website preview

This `demo` branch preserves the personal homepage and adds a Kanatzidis Group website preview for feedback.

- Personal homepage: https://aioyouko.github.io/#home
- Group demo: https://aioyouko.github.io/kanatzidis-demo/
- Entry links appear on the homepage and in Current Work.

## Publishing

GitHub Pages publishes this repository from the **`demo` branch, `/` (root)**. The `main` branch is unchanged. Future commits to `main` alone do not update the live website while Pages uses `demo`.

To return to publishing the original homepage, switch Settings → Pages → Branch back to `main`, `/` (root). The demo URL is available only while the published branch contains `kanatzidis-demo/`.

## Updating the personal homepage

Edit `index.html`, `assets/styles.css`, or `assets/main.js` on `demo`, then push `demo`. Existing homepage assets and section navigation are retained.

## Updating the group demo

`demo-source/` contains the editable Next.js source. `kanatzidis-demo/` contains the generated static website used by GitHub Pages. Do not edit generated files directly.

With Node.js 22.13 or later:

```sh
cd demo-source
npm ci
npm run build
cd ..
git add demo-source kanatzidis-demo
git commit -m "Update group website preview"
git push origin demo
```

The build exports every research and person page, uses `/kanatzidis-demo` as its URL prefix, and copies the export into the published folder. Publication search, year filtering and pagination run in the browser; no application server is required. The root `.nojekyll` file allows the `_next` assets to be served.

The preview is labeled for feedback and requests that search engines do not index it. Image and publication source links are retained on the relevant pages. Keep private lab files, credentials and unpublished research out of this public repository.

## ExtractBench

- Project page: https://aioyouko.github.io/extractbench/
- Full curve explorer: https://aioyouko.github.io/extractbench/explorer/
- Static source: `extractbench/index.html`, `style.css`, `app.js`, and `results.js`.
- Selected benchmark snapshot: 2026-11-04; public export: 2026-11-09.
- 64 complete configurations, 76 requested configurations, 114 question slots each.
- Scientific summaries and curves are taken from the verified archived-response export; no new benchmark requests were made.
- Curves load by dataset. Each dataset ZIP contains curves, Gold, metrics, and stability CSVs.
- `extractbench/explorer/data/release.json` records source and public-data SHA-256 checksums. Original API responses and operational source paths stay in the research archive.
- Publish updates to `demo`, the existing GitHub Pages source branch.
