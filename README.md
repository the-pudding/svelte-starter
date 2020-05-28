# Svelte Starter

This [starter template](https://github.com/russellgoldenberg/svelte-starter) aims for fast and easy web development with HMR, and pre-rendered HTML for optimal static hosting.

#### Features

- [HMR](https://github.com/rixo/svelte-hmr) for lightning fast development
- Includes csv, json, and svg imports by default
- [SCSS](https://sass-lang.com/) ready
- [LayerCake](https://layercake.graphics/) preloaded for graphic development
- [Tabler-Icons](https://github.com/tabler/tabler-icons) for simple/easy svg icons
- Pre-render on deploy for a baked-out HTML with content that is hydrated on load
- Configured to make easy deploment to Github Pages

## Quickstart

```bash
npx degit russellgoldenberg/svelte-starter my-project
cd my-project

npm install
npm run dev
```

## Development

Modify content in `src` and `public/assets`.

## Deploy

```bash
npm run deploy
```

If deploying to github pages:

```bash
make github
```

## Style

Style with normal CSS in the file or externally like:

`<style src="../css/app.scss"></style> -->`

You can use SCSS or another CSS preprocessor by installing the module (eg. `node-sass`) and including the property in the svelte-preprocess in the rollup config files.

## Notes

Any html tags, e.g., `{@html user}` must be inside of a dom element so they can be properly hydrated.
