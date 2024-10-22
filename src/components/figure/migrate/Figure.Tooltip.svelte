<script>
	import { getContext } from "svelte";
	export let x = 0;
	export let y = 0;

	const { width, height } = getContext("Figure");

	$: left = `${x}px`;
	$: top = `${y}px`;
</script>

<div class="tooltip-container">
	<div class="tooltip-box" style:top style:left>
		<slot />
	</div>
</div>

<style>
	div {
		pointer-events: none;
	}
	.tooltip-box {
		position: absolute;
	}
</style>
