<script>
	import { getContext } from "svelte";

	export let features = [];
	export let fill = undefined;
	export let stroke = undefined;
	export let strokeWidth = 0.5;

	const { width, height, custom } = getContext("Figure");
</script>

<g class="g-map-points">
	{#each features as feature}
		{@const className = feature.properties.className}
		<path
			class={className}
			style:stroke
			style:stroke-width="{strokeWidth}px"
			fill={feature.properties.fill || fill}
			d={$custom.pathFn(feature)}
		/>
	{/each}
</g>

<style>
	.g-map-points {
		pointer-events: none;
	}
</style>
