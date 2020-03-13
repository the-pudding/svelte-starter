# Svelte HMR and Sapper Export

Trying to get the best of both worlds: fast and easy svelte development with Sapper bake out html deploy.

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

You need to modify the basepath in `package.json` depending on where it is hosted.

## Notes

Must put browser-dependent modules with dynamic load in `onMount`:

```
onMount(async () => {
    const module = await import("tone");
    if (!Tone) Tone = module.default;
});
```
