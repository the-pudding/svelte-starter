<!-- 
	respects the user's system preferences
	saves the user's preference to local storage
	uses the prefers-color-scheme media query to detect the user's system preference on load

	requirement: structure app.css like this and change variables:

	:root {
		...
	}

	// c+p from root
	.light {
		...
	}

	@media screen and (prefers-color-scheme:dark) {
	:root {
		...
	}

	// c+p from dark mq root
	.dark {
		...
	}
 -->
<script>
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import { Moon, Sun } from "lucide-svelte";
	import mq from "$stores/mq.js";

	let darkMode = false;

	function setDarkMode(value, store) {
		darkMode = value;
		if (store) localStorage.setItem("darkMode", darkMode);
		document.documentElement.classList.toggle("dark", darkMode);
		document.documentElement.classList.toggle("light", !darkMode);
	}

	$: if (browser) setDarkMode($mq.darkMode);

	onMount(() => {
		const preset = localStorage.getItem("darkMode") === "true";
		setDarkMode(preset);
	});
</script>

<button
	class="icon"
	on:click={() => setDarkMode(!darkMode, true)}
	aria-label={darkMode ? "dark mode" : "light mode"}
	data-before={darkMode ? "dark mode" : "light mode"}
>
	{#if darkMode}
		<Moon size="28" />
	{:else}
		<Sun size="28" />
	{/if}
</button>

<style>
	button {
		position: absolute;
		top: 8px;
		right: 8px;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--color-fg);
		line-height: 1;
	}

	button.icon:before {
		content: attr(data-before);
		display: block;
		position: absolute;
		top: 50%;
		right: calc(100%);
		white-space: nowrap;
		color: var(--color-button-bg);
		transform: translate(0, 60%);
		transition: all 0.25s ease-in-out;
		opacity: 0;
		pointer-events: none;
		font-size: var(--14px);
	}

	@media (hover: hover) and (pointer: fine) {
		button.icon:hover:before {
			opacity: 1;
			transform: translate(0, -50%);
		}
	}
</style>
