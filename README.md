# Svelte Starter

This [starter template](https://github.com/the-pudding/svelte-starter) aims to quickly scaffold a [SvelteKit](https://kit.svelte.dev/) project, designed around data-driven, visual stories at [The Pudding](https://pudding.cool).

### Notes
* _Do not use or reproduce The Pudding logos or fonts without written permission._
* _Prettier Formatting: Disable any text editor Prettier extensions to take advantage of the built-in rules._

### Features

- [Lucide Icons](https://lucide.dev/) for simple/easy svg icons
- [ArchieML](http://archieml.org/) for micro-CMS powered by Google Docs and Sheets
- [Style Dictionary](https://amzn.github.io/style-dictionary/) for CSS/JS style parity
- CSV, JSON, and SVG imports
- SSR static-hosted builds by default

## Quickstart
#### From Scratch
* Click the green `Use this template` button above.
* Alternatively: `npx degit the-pudding/svelte-starter my-project`

#### Pre-existing Project
* clone the repo

#### Installation
* In your local repo run `pnpm install` or `npm install`

## Development

```bash
npm run dev
```

Change the script in `package.json` to `"dev": "svelte-kit dev --host"` to test on your local network on a different device.

## Deploy
```bash
npm run build
```

This generates a directory called `build` with the statically rendered app.

A shortcut for github pages:
```bash
make github
```

Deploying to Pudding AWS:
```bash
make pudding
```

### Subdirectories
If you are hosting the project on a subdirectory, set it in `package.json`.

For example, if you are deploying to `https://domain.com/2021/01/test`:

```json
"subdirectory": "/2021/01/test"
```

## Style

There are a few stylesheets included by default in `src/styles`. Refer to them in `app.css`, the place for applying global styles.

For variable parity in both CSS and JS, modify files in the `properties` folder using the [Style Dictionary](https://amzn.github.io/style-dictionary/) API.

Run `npm run style` to regenerate the style dictionary.

#### Some css utility classes in reset.css
* `.sr-only`: makes content invisible available for screen reader
* `.text-outline`: adds a psuedo stroke to text element

### Fonts ⚠️
SvelteKit still hasn't resolved an issue with fonts with subdirectory-hosted projects. The simplest solution right now is to point to an absolute hosted font. If you need it to be local/relative to the project, ask Russell.

## Google Docs and Sheets

* Create a Google Doc or Sheet
* Click `Share` -> `Advanced` -> `Change...` -> `Anyone with this link`
* In the address bar, grab the ID - eg. "...com/document/d/**1IiA5a5iCjbjOYvZVgPcjGzMy5PyfCzpPF-LnQdCdFI0**/edit"
* paste in the ID above into `google.config.js`, and set the filepath to where you want the file saved
* If you want to do a Google Sheet, be sure to include the `gid` value in the url as well

Running `npm run gdoc` at any point (even in new tab while server is running) will fetch the latest from all Docs and Sheets.

## Structural Overview

### Pages
The `src/routes` directory contains pages for your app. For a single-page app (most cases) you don't have to modify anything in here. `+page.svelte` represents the root page, think of it as the `index.html` file. It is prepopulated with a few things like metadata and font preloading. It also includes a blank slate component `Index.svelte`. This is the file you want to really start in for your app.

### Embedding Data
For smaller datasets, it is often great to embed the data into the HTML file. If you want to use data as-is, you can use normal import syntax (e.g., `import data from "$data/file.csv"`). If you are working with data but you want to preserve the original or clean/parse just what you need to use in the browser to optimize the front-end payload, you can load it via `+page.server.js`, do some work on it, and return just what you need. This is passed automatically to `+page.svelte` and accessible in any component with `getContext("data")`.


## Pre-loaded helpers

### Components

Located in `src/lib/components`.

```js
// Usage
import Example from "$components/Example.svelte";
```

* `Footer.svelte`: Pudding recirculation and social links.
* `Header.svelte`: Pudding masthead.

### Helper Components

Located in `src/lib/components/helpers`.

```js
// Usage
import Example from "$components/helpers/Example.svelte";
```

* `ButtonSet.svelte`: Accessible button group inputs.
* `Chunk.svelte`: Split text into smaller dom element chunks.
* `Countdown.svelte`: Countdown timer text.
* `Icon.svelte`: Simple integration with Lucide Icons.
* `MotionToggle.svelte`: A toggle button to enable/disable front-end user motion preference.
* `Range.svelte`: Customizable range slider.
* `Scrolly.svelte`: Scrollytelling.
* `SortTable.svelte`: Sortable semantic table with customizable props.
* `Slider.svelte (and Slider.Slide.svelte)`: A slider widget, especially useful for swipe/slide stories.
* `Tap.svelte`: Edge-of-screen tapping library, designed to integrate with slider.
* `Toggle.svelte`: Accessible toggle inputs.
* `WIP.svelte`: A sticky banner saying this project is a WIP.

### Chart Components

Starter templates for various chart types to be used with [LayerCake](https://layercake.graphics/). Located in `src/lib/components/charts`.

```js
// Usage
import Example from "$components/charts/Example.svelte";
```

### Actions

Located in `src/lib/actions`.

```js
// Usage
import example from "$actions/action.js";
```

* `focusTrap.js`: Enable a keyboard focus trap for modals and menus.
* `inView.js`: detect when an element enters or exits the viewport.
* `canTab.js`: enable/disable tabbing on child elements.

### Stores

These are located in `src/lib/stores`. You can put custom ones in `src/lib/stores/misc.js` or create unique files for more complex ones.

```js
// Usage
import example from "$stores/example.js";
import { example } from "$stores/misc.js";
```

* `mq`: returns an object of media queries booleans if they are enabled or not. You can modify them in the js file.
* `previous`: returns the previous value of another store.
* `reducedMotion`: returns a boolean of front-end user event to enable/disable motion preference.
* `scrollY`: returns a number of window vertical scroll position. It is throttled using rAF for performance.
* `timer`: returns an object `{ timer, elapsed }`. `timer` has 5 methods (start, stop, toggle, set, reset) and `elapsed` is a store that is the number of ms.
* `viewport`: returns an object `{ width, height }` of the viewport dimensions. It is debounced for performance.

### Utils

Located in `src/lib/utils/`.

```js
// Usage
import example from "$utils/example.js";
```

* `checkOverlap.js`: Label overlapping detection. Loops through selection of nodes and adds a class to the ones that are overlapping. Once one is hidden it ignores it.
* `csvDownload.js`: Converts a flat array of data to CSV content ready to be used as an `href` value for download.
* `loadCsv.js`: Loads and parses a CSV file.
* `loadImage.js`: Loads an image.
* `loadJson.js`: Loads and parses a JSON file.
* `loadPixels.js`: Loads the pixel data of an image via an offscreen canvas.
* `localStorage.js`: Read and write to local storage.
* `mapToArray.js`: Convenience function to convert a map to an array.
* `move.js`: transform translate function shorthand.
* `previous.js`: keep track of the previous value of a store.
* `transformSvg.js`: Custom transition lets you apply an svg transform property with the in/out svelte transition. Parameters (with defaults):
* `translate.js`: Convenience function for transform translate css.
* `urlParams.js`: Get and set url parameters.

## Gotchas

* Any @html tags, e.g., `{@html user}` must be the child of a dom element so they can be properly hydrated.
* Putting asset paths in CSS doesn't work without some hacks for subdirectory hosted projects
