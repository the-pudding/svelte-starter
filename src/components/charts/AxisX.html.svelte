<script>
	import { getContext } from "svelte";

	const { xScale } = getContext("LayerCake");

	export let gridlines = true;
	export let tickMarks = false;
	export let baseline = false;
	export let snapTicks = false;
	export let yTick = 7;
	export let formatTick = (d) => d;
	export let ticks = undefined;
	// If *ticks* this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return. If nothing, it uses the default ticks supplied by the D3 function. */

	$: tickVals = Array.isArray(ticks)
		? ticks
		: typeof ticks === "function"
		? ticks($xScale.ticks())
		: $xScale.ticks(ticks);
</script>

<div class="axis x-axis" class:snapTicks>
	{#each tickVals as tick, i}
		{#if gridlines !== false}
			<div class="gridline" style="left:{$xScale(tick)}%;top: 0px;bottom: 0;" />
		{/if}
		{#if tickMarks === true}
			<div
				class="tick-mark"
				style="left:{$xScale(tick)}%;height:6px;bottom: -6px;"
			/>
		{/if}
		<div class="tick tick-{i}" style="left:{$xScale(tick)}%;top:100%;">
			<div class="text" style="top:{yTick}px;">{formatTick(tick)}</div>
		</div>
	{/each}
	{#if baseline === true}
		<div class="baseline" style="top: 100%;width: 100%;" />
	{/if}
</div>

<style>
	.axis,
	.tick,
	.tick-mark,
	.gridline,
	.baseline {
		position: absolute;
	}

	.axis {
		width: 100%;
		height: 100%;
	}

	.tick {
		font-size: 0.725em;
		font-weight: 200;
	}

	.gridline {
		border-left: 1px dashed var(--color-gray-300);
	}

	.tick-mark {
		border-left: 1px solid var(--color-gray-300);
		border-top: 1px solid var(--color-gray-300);
	}

	.tick .text {
		color: var(--color-gray-600);
		position: relative;
		white-space: nowrap;
		transform: translateX(-50%);
	}
	/* This looks a little better at 40 percent than 50 */
	.axis.snapTicks .tick:last-child {
		transform: translateX(-40%);
	}
	.axis.snapTicks .tick.tick-0 {
		transform: translateX(40%);
	}
</style>
