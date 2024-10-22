<script>
	import { range, format } from "d3";
	export let min = 0;
	export let max = 100;
	export let step = 1;
	export let showTicks = false;
	export let value = min;
	export let label = "";

	const getDecimalCount = (value) => {
		if (Math.floor(value) === value) return 0;
		return value.toString().split(".")[1].length || 0;
	};

	$: decimals = getDecimalCount(step);
	$: ticks = showTicks ? range(min, max + step, step) : [];
</script>

<div class="range">
	<div class="ticks">
		{#each ticks as tick}
			<span class="tick">{format(`.${decimals}f`)(tick)}</span>
		{/each}
	</div>
	<input type="range" aria-label={label} {min} {max} {step} bind:value />
</div>

<style>
	.range {
		--thumb-width: 24px;
		--tick-font-size: 12px;
		position: relative;
		margin-bottom: calc(var(--thumb-width) * 2);
	}

	input[type="range"] {
		display: block;
		width: 100%;
		appearance: none;
		cursor: pointer;
		padding: 0;
		margin: 0;
		background: transparent;
		position: relative;
		outline: none;
	}

	input[type="range"]:focus {
		box-shadow: 0 0 4px 0 var(--color-focus, #999);
	}

	input[type="range"]:focus::-webkit-slider-thumb,
	input[type="range"]:focus::-moz-range-thumb,
	input[type="range"]:focus::-ms-thumb {
		box-shadow: 0 0 4px 0 var(--color-focus, #999);
	}

	input[type="range"]::-webkit-slider-runnable-track {
		width: 100%;
		height: calc(var(--thumb-width) / 4);
		background: var(--color-gray-300);
		border-radius: 4px;
	}

	input[type="range"]::-webkit-slider-thumb {
		height: var(--thumb-width);
		width: var(--thumb-width);
		border-radius: 50%;
		background: var(--color-gray-900);
		appearance: none;
		margin-top: calc(var(--thumb-width) / -3);
	}

	input[type="range"]:focus::-webkit-slider-runnable-track {
		background: var(--color-gray-300);
	}

	input[type="range"]::-moz-range-track {
		width: 100%;
		height: calc(var(--thumb-width) / 4);
		background: var(--color-gray-300);
		border-radius: 4px;
	}

	input[type="range"]::-moz-range-thumb {
		box-shadow: 1px 1px 1px var(--color-black), 0 0 1px var(--color-black);
		height: var(--thumb-width);
		width: var(--thumb-width);
		border-radius: 50%;
		background: var(--color-gray-900);
	}

	input[type="range"]::-ms-track {
		width: 100%;
		height: calc(var(--thumb-width) / 4);
		background: transparent;
		border-color: transparent;
		border-width: 16px 0;
		color: transparent;
	}

	input[type="range"]::-ms-fill-lower,
	input[type="range"]::-ms-fill-upper {
		background: var(--color-gray-300);
		border: 0.2px solid var(--color-black);
		border-radius: 4px;
		box-shadow: 1px 1px 1px var(--color-black), 0 0 1px var(--color-black);
	}

	input[type="range"]::-ms-thumb {
		height: var(--thumb-width);
		width: var(--thumb-width);
		border-radius: 50%;
		background: var(--color-gray-900);
	}

	input[type="range"]:focus::-ms-fill-lower,
	input[type="range"]:focus::-ms-fill-upper {
		background: var(--color-gray-300);
	}

	.ticks {
		width: 100%;
		display: flex;
		justify-content: space-between;
		padding: 0 calc(var(--thumb-width) / 2);
		margin: 0;
		user-select: none;
		position: absolute;
		left: 0;
		bottom: 0;
		transform: translate(0, 100%);
	}

	.tick {
		display: flex;
		justify-content: center;
		font-size: var(--tick-font-size);
		line-height: 1;
		text-align: center;
		width: 1px;
		background: transparent;
		color: var(--color-gray);
		padding-top: calc(var(--thumb-width) / 2);
		position: relative;
	}

	.tick:before {
		display: block;
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: calc(var(--thumb-width) / 3);
		background: var(--color-gray-300);
	}

	.tick:first-of-type {
		transform: translate(-1px, 0);
	}

	.tick:last-of-type {
		transform: translate(1px, 0);
	}
</style>
