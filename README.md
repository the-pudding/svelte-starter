# Svelte Starter

This [starter template](https://github.com/russellgoldenberg/svelte-starter) aims for fast and easy web development with HMR, and pre-rendered HTML for optimal static hosting.

#### Features

- [HMR](https://github.com/rixo/svelte-hmr) for lightning fast development
- [LayerCake](https://layercake.graphics/) enabled by default for chart development
- [Tabler-Icons](https://github.com/tabler/tabler-icons) for simple/easy svg icons
- [SCSS](https://sass-lang.com/) ready
- [ArchieML](http://archieml.org/) for micro-CMS powered by Google Docs
- Includes csv, json, and svg imports by default
- Pre-renders HTML on deploy with content that is hydrated on load
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

You can use SCSS or another CSS preprocessor by installing the module (eg. `node-sass`) and including the property in the svelte-preprocess in the rollup config files.

You can use external stylesheets like so:

`<style src="../css/app.scss"></style>`

## Google Docs

- Create a Google Doc
- Click `Share` button -> advanced -> Change... -> to "Anyone with this link"
- In the address bar, grab the ID - eg. ...com/document/d/**1IiA5a5iCjbjOYvZVgPcjGzMy5PyfCzpPF-LnQdCdFI0**/edit
- paste in the ID above into `config.json`

Running `npm run doc` at any point (even in new tab while server is running) will pull down the latest, and output a file to `src/data/copy.json` (or customize in the config file).

## Notes

Any @html tags, e.g., `{@html user}` must be the child of a dom element so they can be properly hydrated.
