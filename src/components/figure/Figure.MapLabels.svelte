<script>
	import { getContext, tick } from "svelte";

	import { geoAlbersUsa } from "d3";

	export let features;
	export let fill = "#000";
	export let stroke = "none";
	export let offsetX = 0;
	export let offsetY = 0;
	export let strokeWidth = 1;
	export let projection = geoAlbersUsa();

	const { width, height, custom } = getContext("Figure");

	$: projectionFn = projection.fitSize(
		[$width, $height],
		$custom.projectionObject
	);
</script>

{#if features && $width}
	<svg width={$width} height={$height}>
		{#each features as feature}
			{@const [x, y] = projectionFn(feature.geometry.coordinates)}
			{@const transform = `translate(${x}, ${y})`}
			<g {transform}>
				{#each [0, 1] as i}
					{@const isStroke = i === 0 && stroke !== "none"}
					{@const isRender = isStroke || i > 0}
					{#if isRender}
						<text
							x={offsetX}
							y={offsetY}
							text-anchor="middle"
							aligment-baseline="middle"
							style:stroke={isStroke ? stroke : "none"}
							style:stroke-width="{strokeWidth}px"
							style:fill={isStroke ? "none" : feature.properties.fill || fill}
							>{feature.properties.label}</text
						>
					{/if}
				{/each}
			</g>
		{/each}
	</svg>
{/if}
