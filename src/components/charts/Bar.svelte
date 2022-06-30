<script>
	import { getContext } from "svelte";

	const { data, xGet, yGet, xScale, yScale } = getContext("LayerCake");

	export let fill = "#ccc";
</script>

<g>
	{#each $data as d, i}
		{@const x = $xScale.range()[0]}
		{@const y = $yGet(d)}
		{@const width = $xGet(d)}
		{@const height = $yScale.bandwidth()}
		<rect data-id={i} {x} {y} {width} {height} {fill} />
	{/each}
</g>
