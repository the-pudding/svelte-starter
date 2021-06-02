import { ssr } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!doctype html>\n<html lang=\"en\">\n\n<head>\n\t" + head + "\n</head>\n\n<body>\n\t<a href=\"#content\" class=\"skip-to-main\">Skip to main content</a>\n\t<div id=\"svelte\">" + body + "</div>\n</body>\n\n</html>";

let options = null;

// allow paths to be overridden in svelte-kit start
// and in prerendering
export function init(settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: "/./_app/start-87c26320.js",
			css: ["/./_app/assets/start-9aa571ba.css"],
			js: ["/./_app/start-87c26320.js","/./_app/chunks/vendor-072d9e00.js"]
		},
		fetched: undefined,
		get_component_path: id => "/./_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: error => {
			console.error(error.stack);
			error.stack = options.get_stack(error);
		},
		hooks: get_hooks(user_hooks),
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		read: settings.read,
		root,
		router: true,
		ssr: true,
		target: "#svelte",
		template
	};
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [{"file":"assets/fonts/national/National2NarrowWeb-Black.woff","size":53853,"type":"font/woff"},{"file":"assets/fonts/national/National2NarrowWeb-Black.woff2","size":41026,"type":"font/woff2"},{"file":"assets/fonts/national/National2NarrowWeb-Bold.woff","size":52259,"type":"font/woff"},{"file":"assets/fonts/national/National2NarrowWeb-Bold.woff2","size":39488,"type":"font/woff2"},{"file":"assets/fonts/national/National2NarrowWeb-Extralight.woff","size":50203,"type":"font/woff"},{"file":"assets/fonts/national/National2NarrowWeb-Extralight.woff2","size":37687,"type":"font/woff2"},{"file":"assets/fonts/national/National2NarrowWeb-Regular.woff","size":50636,"type":"font/woff"},{"file":"assets/fonts/national/National2NarrowWeb-Regular.woff2","size":37963,"type":"font/woff2"},{"file":"assets/fonts/national/National2Web-Bold.woff","size":50580,"type":"font/woff"},{"file":"assets/fonts/national/National2Web-Bold.woff2","size":37556,"type":"font/woff2"},{"file":"assets/fonts/national/National2Web-Regular.woff","size":47469,"type":"font/woff"},{"file":"assets/fonts/national/National2Web-Regular.woff2","size":34900,"type":"font/woff2"},{"file":"assets/fonts/tiempos/TiemposHeadlineWeb-Regular.woff","size":56509,"type":"font/woff"},{"file":"assets/fonts/tiempos/TiemposHeadlineWeb-Regular.woff2","size":42658,"type":"font/woff2"},{"file":"assets/fonts/tiempos/TiemposTextWeb-Bold.woff","size":78172,"type":"font/woff"},{"file":"assets/fonts/tiempos/TiemposTextWeb-Bold.woff2","size":56985,"type":"font/woff2"},{"file":"assets/fonts/tiempos/TiemposTextWeb-Regular.woff","size":76476,"type":"font/woff"},{"file":"assets/fonts/tiempos/TiemposTextWeb-Regular.woff2","size":56337,"type":"font/woff2"}],
	layout: "src/routes/$layout.svelte",
	error: ".svelte/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/$layout.svelte", "src/routes/index.svelte"],
						b: [".svelte/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getContext: hooks.getContext || (() => ({})),
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, render }) => render(request))
});

const module_lookup = {
	"src/routes/$layout.svelte": () => import("../../src/routes/$layout.svelte"),".svelte/build/components/error.svelte": () => import("./components/error.svelte"),"src/routes/index.svelte": () => import("../../src/routes/index.svelte")
};

const metadata_lookup = {"src/routes/$layout.svelte":{"entry":"/./_app/pages/$layout.svelte-df7a6bb0.js","css":["/./_app/assets/pages/$layout.svelte-364654f7.css"],"js":["/./_app/pages/$layout.svelte-df7a6bb0.js","/./_app/chunks/vendor-072d9e00.js"],"styles":null},".svelte/build/components/error.svelte":{"entry":"/./_app/error.svelte-8c2e8ead.js","css":[],"js":["/./_app/error.svelte-8c2e8ead.js","/./_app/chunks/vendor-072d9e00.js"],"styles":null},"src/routes/index.svelte":{"entry":"/./_app/pages/index.svelte-01fb2e06.js","css":["/./_app/assets/pages/index.svelte-07f59c0f.css"],"js":["/./_app/pages/index.svelte-01fb2e06.js","/./_app/chunks/vendor-072d9e00.js"],"styles":null}};

async function load_component(file) {
	return {
		module: await module_lookup[file](),
		...metadata_lookup[file]
	};
}

init({ paths: {"base":"","assets":"/."} });

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return ssr({ ...request, host }, options, { prerender });
}