<script>
	import { getContext, tick } from "svelte";

	import { geoPath, geoAlbersUsa } from "d3";

	export let features;
	export let fill;
	export let stroke;
	export let strokeWidth = 0.5;
	export let radius = 5;
	export let projection = geoAlbersUsa();

	const { width, height, custom } = getContext("Figure");

	$: projectionFn = projection.fitSize(
		[$width, $height],
		$custom.projectionObject
	);
	$: pathFn = geoPath().projection(projectionFn).pointRadius(radius);
</script>

{#if features && $width}
	<svg width={$width} height={$height}>
		{#each features as feature}
			<path
				style:stroke
				style:stroke-width="{strokeWidth}px"
				class="place-path"
				fill={feature.properties.fill || fill}
				d={pathFn(feature)}
			/>
		{/each}
	</svg>
{/if}
