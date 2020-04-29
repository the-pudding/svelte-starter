# Svelte Starter

Trying to get the best of both worlds: fast and easy svelte development with Sapper bake out html deploy.

#### Features

- [HMR](https://github.com/rixo/svelte-hmr) for lightning fast development
- Includes csv, json, and svg imports by default
- [SCSS](https://sass-lang.com/) ready (optional)
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

CSS or SCSS both work fine. Either do within style tag or externally like:

`<style src="../css/app.scss"></style> -->`

## Notes

Any html tags, e.g., `{@html user}` must be inside of a dom element so they can be properly hydrated.
