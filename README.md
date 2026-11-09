# Heyang Chen — personal homepage and group website preview

This working copy preserves the personal homepage and the Kanatzidis Group website preview for feedback.

- Personal homepage: https://aioyouko.github.io/#home
- Group demo: https://aioyouko.github.io/kanatzidis-demo/
- Entry links appear on the homepage and in Current Work.

## Source of truth and branch scope

- Make all shared homepage changes on **`main` first**, including TE Materials, the personal introduction, About/CV, navigation, styles, and the group website preview.
- GitHub Pages publishes from **`demo`, `/` (root)**. After validating and committing shared changes on `main`, explicitly **merge `main` into `demo`** and push `demo`. This synchronization does not happen automatically.
- ExtractBench is maintained separately on `demo`. Keep its directory, navigation link, and homepage card on `demo`; they are intentionally absent from `main`.
- **Do not merge the entire `demo` branch back into `main`.** Keep `main` independent of ExtractBench. Resolve any `main` → `demo` conflicts by retaining the shared homepage updates and the existing ExtractBench additions.
- The shared group preview (`demo-source/` and `kanatzidis-demo/`) was verified against `origin/demo` at `9fbdbc1` on 2026-11-09 before establishing this workflow.

## Publishing

Commits to `main` alone do not update the live website while Pages uses `demo`. After committing and validating changes on `main`, run the following with a clean working tree:

```sh
git switch main
git pull --ff-only origin main
git push origin main
git fetch origin
git switch demo # first local checkout: git switch --track origin/demo
git pull --ff-only origin demo
git merge main
# Resolve any conflicts and verify the homepage and ExtractBench before pushing.
git push origin demo
git switch main
```

If a merge conflicts, resolve and commit it before continuing. Preserve the ExtractBench directory, navigation link, and homepage card on `demo`. Keep the Pages source branch unchanged unless explicitly requested.

## Updating the personal homepage

Edit `index.html`, `assets/styles.css`, or `assets/main.js` on `main`. The About page's CV is stored in `assets/cv/Heyang_Chen_CV.pdf`. Validate and commit the changes on `main`, then merge `main` into `demo` using the publishing workflow above. Existing homepage assets and section navigation are retained.

## Updating the group demo

`demo-source/` contains the editable Next.js source. `kanatzidis-demo/` contains the generated static website used by GitHub Pages. Do not edit generated files directly.

With Node.js 22.13 or later:

```sh
git switch main
cd demo-source
npm ci
npm run build
cd ..
git add demo-source kanatzidis-demo
git commit -m "Update group website preview"
```

Then follow the publishing workflow above to push `main`, merge it into `demo`, and push `demo`.

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
