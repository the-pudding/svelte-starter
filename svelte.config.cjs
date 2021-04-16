// const fs = require("fs");
const path = require("path");
// const node = require("@sveltejs/adapter-node");
const static = require("@sveltejs/adapter-static");
const svg = require("vite-plugin-svgstring");
const dsv = require("@rollup/plugin-dsv");
const sveltePreprocess = require("svelte-preprocess");
const pkg = require("./package.json");

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [require("autoprefixer")]
	}
});

module.exports = {
	preprocess,
	kit: {
		adapter: static(),
		target: "#svelte",
		vite: {
			ssr: {
				noExternal: Object.keys(pkg.dependencies || {}),
			},
			resolve: {
				alias: {
					"$actions": path.resolve("./src/actions"),
					"$components": path.resolve("./src/components"),
					"$data": path.resolve("./src/data"),
					"$stores": path.resolve("./src/stores"),
					"$styles": path.resolve("./src/styles"),
					"$svg": path.resolve("./src/svg"),
					"$utils": path.resolve("./src/utils")
				}
			},
			plugins: [
				dsv(),
				svg()
			]
		}
	}
};
