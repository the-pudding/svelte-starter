<script>
	/**
	 * This component is a wrapper for the visual that appears beneath the text in your IG story.
	 * It takes up the remaining space after the text + buffer.
	 */
	import { onMount, tick } from "svelte";
	import viewport from "$stores/viewport.js";

	export let activeSlide;

	let offset;
	let mounted = false;

	$: mobile = $viewport.width < 600;
	$: buffer = mobile ? 10 : 100;
	$: activeSlide, $viewport.width, updateSlideHeight();

	const updateSlideHeight = async () => {
		if (mounted) {
			await tick();
			const slideEl = document.getElementById(`slide-${activeSlide}`);
			offset = slideEl.clientHeight + buffer;
		}
	};

	onMount(() => {
		mounted = true;
		updateSlideHeight();
	});
</script>

<figure style={`--offset: ${offset}px; --buffer: 2rem`}>
	visual goes here
</figure>

<style>
	figure {
		position: absolute;
		top: calc(var(--offset) + var(--buffer));
		height: calc(100% - var(--offset) - var(--buffer));
		left: 50%;
		transform: translateX(-50%);
		overflow: hidden;
		width: 45rem;
		padding: 1rem;
		z-index: 3;
		pointer-events: none;
		transition: opacity calc(var(--1s) * 0.5) ease-in-out;
		background: lavender;
	}
</style>
