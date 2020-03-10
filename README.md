# Svelte HMR and Sapper Export

Trying to get the best of both worlds: fast and easy svelte development with Sapper bake out html deploy.

## Development

```bash
npm run dev
```

Modify content in `src` and `public`.

## Deploy

For github deploy:

```bash
npm run export
make github
```

You need to modify the basepath in `package.json` depending on where it is hosted.
