import adapterStatic from "@sveltejs/adapter-static";
import { sveltePreprocess } from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [autoprefixer]
	}
});

// TODO switch

const config = {
	compilerOptions: {
		runes: false
	},
	preprocess,
	kit: {
		adapter: adapterStatic({ strict: false })
	}
};

export default config;
