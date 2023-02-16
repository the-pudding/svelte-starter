<script>
	import { getContext } from "svelte";

	const { data, xGet, yGet, zGet, xScale } = getContext("LayerCake");
</script>

<g>
	{#each $data as series, i}
		{#each series as d}
			{@const yVals = $yGet(d)}
			{@const height = yVals[0] - yVals[1]}
			{@const x = $xGet(d)}
			{@const y = yVals[1]}
			{@const width = $xScale.bandwidth()}
			<rect data-id={i} {x} {y} {width} {height} fill={$zGet(series)} />
		{/each}
	{/each}
</g>
