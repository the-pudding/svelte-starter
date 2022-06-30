<script>
	import { getContext } from "svelte";

	const { data, xGet, yGet, xScale, yScale } = getContext("LayerCake");

	export let r = 4;
	export let fill = "#ccc";
	export let stroke = "#000";
	export let strokeWidth = 0;

	$: width = `${r * 2}px`;
	$: height = width;
</script>

<div>
	{#each $data as d}
		{@const left = $xGet(d)}
		{@const top = $yGet(d)}
		<div
			class="circle"
			style:left
			style:top
			style:width
			style:height
			style:background-color={fill}
			style:border="{strokeWidth}px solid {stroke}"
		/>
	{/each}
</div>

<style>
	.circle {
		position: absolute;
		transform: translate(-50%, -50%);
		border-radius: 50%;
	}
</style>
