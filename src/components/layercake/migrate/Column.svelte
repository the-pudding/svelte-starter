<script>
	import { getContext } from "svelte";

	const { data, xGet, yGet, yRange, xScale } = getContext("LayerCake");

	$: columnWidth = (d) => {
		const vals = $xGet(d);
		return Math.max(0, vals[1] - vals[0]);
	};

	$: columnHeight = (d) => {
		return $yRange[0] - $yGet(d);
	};

	export let fill = "#ccc";
	export let stroke = "#000";
	export let strokeWidth = 0;
</script>

<g>
	{#each $data as d, i}
		{@const x = $xScale.bandwidth ? $xGet(d) : $xGet(d)[0]}
		{@const y = $yGet(d)}
		{@const width = $xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}
		{@const height = columnHeight(d)}
		<rect
			data-id={i}
			{x}
			{y}
			{width}
			{height}
			{fill}
			{stroke}
			stroke-width={strokeWidth}
		/>
	{/each}
</g>
