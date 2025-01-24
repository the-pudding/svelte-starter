<script>
	import { base } from "$app/paths";
	import useFetcher from "$runes/useFetcher.svelte.js";

	const url = `${base}/assets/demo/test.csv`;
	const response = useFetcher(url);

	$effect(() => {
		// if you want to dynamically change the url to load new data
		// response.url = newUrl;
	});
</script>

<div class="c">
	<h2>Load Data</h2>

	<div class="response">
		{#if response.loading}
			<p>loading data...</p>
		{:else if response.error}
			<p>error: {response.error}</p>
		{:else}
			<p>data loaded</p>
			<pre>{JSON.stringify(response.data, null, 2)}</pre>
		{/if}
	</div>
</div>
