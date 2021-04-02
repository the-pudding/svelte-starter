const fs = require("fs");
const node = require("@sveltejs/adapter-node");
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
			plugins: [
				dsv(),
				svg()
			]
		}
	}
};
