<script>
	import { getContext, createEventDispatcher } from "svelte";

	export let features;
	export let fill = "none";
	export let stroke;
	export let strokeWidth = 0.5;
	export let pointerEvents = false;

	let active;

	const { width, height, dpr, custom } = getContext("Figure");

	const dispatch = createEventDispatcher();

	function onMouseEnter(event, feature) {
		active = feature.id;
		const datum = feature.properties;
		dispatch("mouseenter", { event, feature });
	}

	$: mesh = !!features.type;
</script>

<g
	class="g-map-path"
	class:interactive={pointerEvents}
	style="--stroke-width: {strokeWidth};"
>
	{#if mesh}
		<path
			style:stroke
			style:stroke-width="{strokeWidth}px"
			style:fill
			d={$custom.pathFn(features)}
		/>
	{:else}
		{#each features as feature (feature.id)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<path
				style:stroke
				style:stroke-width={strokeWidth}
				style:fill={feature.properties.fill || fill}
				class:active={active === feature.id}
				d={$custom.pathFn(feature)}
				on:mouseleave={() => dispatch("mouseleave")}
				on:mouseenter={(e) => onMouseEnter(e, feature)}
			/>
		{/each}
	{/if}
</g>

<style>
	.g-map-path {
		pointer-events: none;
	}

	.interactive {
		pointer-events: auto;
		cursor: crosshair;
	}

	path {
		z-index: var(--z-middle);
	}
</style>
