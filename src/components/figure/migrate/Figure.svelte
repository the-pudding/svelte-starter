<!--
Usage:
	<Figure>
		<svg></svg>
	</Figure>

Pass style prop directives to set dimensions (defaults are all "auto")
--aspect-ratio
--width
--height

example: <Figure --aspect-ratio="1"></Figure> 

Props: 
	debounce: number (default 250) - debounce resize event time in ms
	exclude: string (default "height") - exclude width or height from triggering resize event
	custom: object (default {}) - custom data store to pass to children components
-->
<script>
	import { writable } from "svelte/store";
	import { onMount, setContext, tick } from "svelte";
	import { browser } from "$app/environment";
	import resize from "$actions/resize.js";

	export let debounce = 250;
	export let exclude = "height";
	export let custom = {};

	const _width = writable(0);
	const _height = writable(0);
	const _dpr = writable(1);
	const _custom = writable({ ...custom });

	setContext("Figure", {
		width: _width,
		height: _height,
		dpr: _dpr,
		custom: _custom
	});

	let clientWidth;
	let clientHeight;

	async function onResize() {
		await tick();
		$_width = clientWidth;
		$_height = clientHeight;
	}

	$: $_dpr = browser ? Math.min(2, window.devicePixelRatio || 1) : 1;

	onMount(() => {
		onResize();
	});
</script>

<figure>
	<div
		class="figure-inner"
		bind:clientWidth
		bind:clientHeight
		use:resize={{ exclude, debounce }}
		on:resize={onResize}
	>
		<slot />
	</div>
	<slot name="figcaption" />
</figure>

<style>
	figure {
		display: block;
	}

	.figure-inner {
		position: relative;
		width: var(--width, "auto");
		height: var(--height, "auto");
		aspect-ratio: var(--aspect-ratio, "auto");
		overflow: hidden;
	}

	:global(.figure-inner > *) {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
