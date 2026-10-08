# REX & M2EX Documentation

The documentation website for the REX and M2EX community patches, built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/).

## Local development

Node.js 22.12 or newer is required.

```sh
npm ci
npm run dev
```

Astro prints the local URL when the development server starts. Local and Cloudflare preview builds use `/`; GitHub Actions builds automatically use the `/rex/` path required by GitHub Pages.

## Validation

Run all checks before opening a pull request:

```sh
npm run validate
```

This runs Astro's diagnostics, creates a production build, and checks that generated internal links and assets resolve under the configured base path. The production output is written to `dist/`.

## Project structure

- `src/content/docs/` contains the documentation pages.
- `src/styles/Medieval2.css` contains the M2TW and Rome visual styles.
- `src/assets/` contains images and fonts processed by Astro.
- `public/` contains files that must retain stable public filenames, including downloads and the style-picker script.

## Deployment

The production target is GitHub Pages at `https://pannoniae.github.io/rex/`. `astro.config.mjs` detects GitHub Actions and applies the production origin and `/rex` base path automatically. Cloudflare Pages can therefore create root-hosted preview deployments from the same source.

Review and complete `ASSET-LICENSING.md` before making the site public.
