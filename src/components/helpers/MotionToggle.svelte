<!-- 
	<MotionToggle bind:value />
 -->
<script>
	import { browser } from "$app/env";
	import Icon from "$components/helpers/Icon.svelte";
	import reducedMotion from "$stores/reducedMotion.js";
	import mq from "$stores/mq.js";

	export let strokeWidth = "2px";
	export let showLabel = false;
	export let value = "on";

	export let name = "play-circle";

	const onToggle = () => {
		value = value === "on" ? "off" : "on";
	};

	$: value = $mq.reducedMotion || value;
	$: name = value === "on" ? "play-circle" : "pause-circle";
	$: aria = value === "on" ? "disable" : "enable";
	$: cssVar = value === "on" ? "1s" : "0s";
	$: reducedMotion.set(value === "off");
	$: if (browser) document.documentElement.style.setProperty("--1s", cssVar);
</script>

<div class="wrapper">
	{#if showLabel}
		<label for="motion-toggle">Motion</label>
	{/if}
	<button
		aria-label="{aria} motion"
		id="motion-toggle"
		style="--strokeWidth: {strokeWidth};"
		on:click={onToggle}
	>
		<div class="lines">
			<span />
			<span />
			<span />
		</div>
		<div class="icon">
			<Icon {strokeWidth} {name} />
		</div>
	</button>
</div>

<style>
	.wrapper {
		text-align: center;
	}

	button {
		line-height: 1;
		font-size: var(--24px);
		position: relative;
		display: flex;
		width: calc(var(--24px) * 2.5);
		align-items: stretch;
	}

	.lines {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		align-items: flex-end;
		width: 40%;
	}

	.icon {
		width: 60%;
	}

	span {
		display: block;
		height: var(--strokeWidth);
		background: var(--color-bg);
	}

	span:nth-of-type(1) {
		width: 100%;
	}

	span:nth-of-type(2) {
		width: 67%;
	}

	span:nth-of-type(3) {
		width: 33%;
	}

	:global(#motion-toggle svg) {
		display: block;
		width: 100%;
	}
</style>
