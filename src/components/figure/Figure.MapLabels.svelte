<script>
	import { getContext } from "svelte";
	import checkOverlap from "$actions/checkOverlap.js";
	import keepWithinBox from "$actions/keepWithinBox.js";

	export let features;
	export let fill = "#000";
	export let stroke = "none";
	export let offsetX = 0;
	export let offsetY = 0;
	export let strokeWidth = 1;

	const { width, height, custom } = getContext("Figure");
</script>

<g
	class="g-map-labels"
	use:checkOverlap={{ query: "text.stroke", reverse: true }}
>
	{#each features as feature}
		{@const coords = $custom.projectionFn(feature.geometry.coordinates)}
		{@const hasCoords = coords}
		{@const x = hasCoords ? coords[0] : 0}
		{@const y = hasCoords ? coords[1] : 0}
		{@const transform = `translate(${x}, ${y})`}
		{@const className = feature.properties.className}
		{#if hasCoords}
			<g {transform} class={className} use:keepWithinBox={{ width: $width }}>
				{#each [0, 1] as i}
					{@const isStroke = i === 0 && stroke !== "none"}
					{@const isRender = isStroke || i > 0}
					{#if isRender}
						<text
							x={offsetX}
							y={offsetY}
							class:stroke={isStroke}
							text-anchor="middle"
							alignment-baseline="baseline"
							style:stroke={isStroke ? stroke : "none"}
							style:stroke-width="{strokeWidth}px"
							style:fill={isStroke ? "none" : feature.properties.fill || fill}
							>{feature.properties.label}</text
						>
					{/if}
				{/each}
			</g>
		{/if}
	{/each}
</g>

<style>
	.g-map-labels {
		pointer-events: none;
	}

	:global(.is-overlap, .is-overlap + text) {
		display: none;
	}

	:global(.is-overlap + text) {
		display: none;
	}

	text {
		letter-spacing: 0.02em;
		transform: translate(0, -12px);
	}
</style>
