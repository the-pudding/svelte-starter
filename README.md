# Svelte Starter

This [starter template](https://github.com/russellgoldenberg/svelte-starter) aims for fast and easy web development with HMR, and pre-rendered HTML for optimal static hosting.

#### Features

- [HMR](https://github.com/rixo/svelte-hmr) for lightning fast development
- [Tabler-Icons](https://github.com/tabler/tabler-icons) for simple/easy svg icons
- [ArchieML](http://archieml.org/) for micro-CMS powered by Google Docs
- [LayerCake](https://layercake.graphics/) enabled by default for chart development
- Includes csv, json, and svg imports by default
- Pre-renders HTML on deploy with content that is hydrated on load
- Configured to make easy deploment to Github Pages

## Quickstart

New school: just click the `Use this template` button above.

Old school:

```bash
npx degit the-pudding/svelte-starter my-project
```

Then in your local repo:

```bash
npm install
npm run build
```

## Development

To start the dev server:

```bash
npm run dev
```

Modify content in `src` and `public/assets`.

## Deploy

```bash
npm run deploy
```

This generates a directory called `ssr` with the server-side rendered static-hostable app.

If deploying to github pages:

```bash
make github
```

## Style

You can use SCSS or another CSS preprocessor by installing the module (eg. `node-sass`) and including the property in the svelte-preprocess in the rollup config files.

## Google Docs

- Create a Google Doc
- Click `Share` button -> advanced -> Change... -> to "Anyone with this link"
- In the address bar, grab the ID - eg. ...com/document/d/**1IiA5a5iCjbjOYvZVgPcjGzMy5PyfCzpPF-LnQdCdFI0**/edit
- paste in the ID above into `config.json`

Running `npm run doc` at any point (even in new tab while server is running) will pull down the latest, and output a file to `src/data/copy.json` (or customize in the config file).

## Notes

Any @html tags, e.g., `{@html user}` must be the child of a dom element so they can be properly hydrated.
