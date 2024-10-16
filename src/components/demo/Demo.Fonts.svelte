<script>
	import { groups, descending } from "d3";
	import Sample from "$components/demo/Demo.Fonts.Sample.svelte";
	import fontData from "$components/demo/demo-fonts.json";
	let { size = 18, text = "The quick brown fox jumps over the lazy dog." } =
		$props();

	const grouped = groups(fontData, (d) => d.type);
	grouped.sort((a, b) => descending(a[1].length, b[1].length));
</script>

<div id="info">
	<h1>Hosted Fonts on The Pudding</h1>
	<p>
		<em>Do not use fonts hosted by The Pudding without written permission.</em>
	</p>
	<form>
		<label for="size">font-size: {size}px</label>
		<input id="size" type="range" min="12" max="48" bind:value={size} />
		<label for="text">text sample</label>
		<input id="text" type="text" maxlength="100" bind:value={text} />
	</form>
</div>

<article>
	{#each grouped as [type, fonts]}
		<h2>{type}</h2>
		<section>
			{#each fonts as { family, id }}
				<Sample {id} {family} {size} {text} />
			{/each}
		</section>
	{/each}
</article>

<style>
	#info {
		text-align: center;
	}

	article {
		margin: 32px auto;
		max-width: 75em;
	}

	section {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 64px;
	}

	label {
		display: block;
		margin-bottom: 8px;
	}
</style>
