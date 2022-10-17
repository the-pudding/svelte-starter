<script>
	import { onMount } from "svelte";
	export const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];

	export let name;
	export let direction = "n";
	export let size = "1em"; // can be a number of a css value
	export let color = undefined;
	export let strokeWidth = undefined;

	let Component;

	const nameToComponent = (str) => {
		const camel = str.replace(/[^a-zA-Z0-9]+(.)/g, (m, c) => c.toUpperCase());
		const upper = str.charAt(0).toUpperCase();
		const sliced = camel.slice(1);
		return `${upper}${sliced}`;
	};

	$: rotation = directions.indexOf(direction) * 45;

	onMount(async () => {
		const key = nameToComponent(name);
		Component = (await import("lucide-svelte"))[key];
	});
</script>

{#if Component}
	<span class="icon" style="transform: rotate({rotation}deg);">
		<svelte:component this={Component} {size} {color} {strokeWidth} />
	</span>
{/if}

<style>
	span {
		display: inline-block;
	}
</style>
