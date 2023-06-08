import adapterStatic from "@sveltejs/adapter-static";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";

const preprocess = sveltePreprocess({
	postcss: {
		plugins: [autoprefixer]
	}
});

const config = {
	preprocess,
	kit: {
		adapter: adapterStatic()
	},
	vitePlugin: {
		// experimental: {
		// 	inspector: { holdMode: true },
		// }
	}
};

export default config;
