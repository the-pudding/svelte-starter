# Svelte Starter

Trying to get the best of both worlds: fast and easy svelte development with Sapper bake out html deploy.

#### Features

- [HMR](https://github.com/rixo/svelte-hmr) for lightning fast development
- Includes csv, json, and svg imports by default
- [SCSS](https://sass-lang.com/) ready (optional)
- [LayerCake](https://layercake.graphics/) preloaded for graphic development
- [Tabler-Icons](https://github.com/tabler/tabler-icons) for simple/easy svg icons
- [Sapper](https://sapper.svelte.dev/) to deploy as pre-baked out HTML
- Configured to make easy deploment to Github Pages

## Insallation

Clone the repo and run `npm install`.

## Development

```bash
npm run dev
```

Modify content in `src` and `public/assets`.

## Deploy

For github deploy:

```bash
npm run deploy
make github
```

You need to modify the basepath in `package.json` and `Makefile`.

## Notes

Must put browser-dependent modules with dynamic load in `onMount`:

```
onMount(async () => {
    const module = await import("tone");
    if (!Tone) Tone = module.default;
});
```

## Style

CSS or SCSS both work fine. Either do within style tag or externally like:

`<style src="../css/app.scss"></style> -->`
