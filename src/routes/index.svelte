<script>
	import { setContext } from "svelte";
	import { browser } from "$app/env";
	import Meta from "$components/Meta.svelte";
	import App from "$components/App.svelte";
	import copy from "$data/copy.json";
	import version from "$utils/version.js";

	version();

	const preloadFont = [
		"https://pudding.cool/assets/fonts/tiempos/TiemposTextWeb-Regular.woff2",
		"https://pudding.cool/assets/fonts/tiempos/TiemposTextWeb-Bold.woff2",
		"https://pudding.cool/assets/fonts/national/National2Web-Regular.woff2",
		"https://pudding.cool/assets/fonts/national/National2Web-Bold.woff2"
	];

	const { title, description, url, keywords } = copy;
	setContext("copy", copy);
</script>

<Meta {title} {description} {url} {preloadFont} {keywords} />
<App />
