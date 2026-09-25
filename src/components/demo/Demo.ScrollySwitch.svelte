<script>
	import { prefersReducedMotion } from "svelte/motion";
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Switch from "$components/ui/Switch.svelte";

	let steps = [0, 1, 2, 3, 4];
	let value = $state();
	let chartData = [
		[20, 8, 17, 30, 25],
		[15, 25, 10, 35, 20],
		[25, 15, 20, 10, 30],
		[4, 12, 23, 34, 19],
		[10, 20, 30, 40, 50]
	];

	// Determine if user's default settings prefer reduced motion to set the default setting of the switch.
	let useScroller = $state(!prefersReducedMotion.current);
</script>

<!-- This could be a minimal icon (like a sound toggle button) too -->
<div class="controls">
	<p>
		The graphics in this story will utilize scroll-driven animations. Use this
		toggle to disable this and view static graphics instead.
	</p>
	<Switch labelText="Animations enabled" bind:checked={useScroller} />
</div>

<!-- Use snippets for the background and foreground content so you can render them in both the scroll-driven and stacked layouts. If the background graphics depend on state, make sure to pass the necessary state as props to the snippets -->
{#snippet background(value)}
	<h2>Scrolly <span>{value || "-"}</span></h2>
	{@render chart(chartData[value])}
{/snippet}

{#snippet foreground(text, value, active)}
	<div class="step" class:active>
		<p>{text}</p>
		<p class="sr-only">Describe the graphic in step {text}</p>
	</div>
{/snippet}

<!-- Example chart snippet. The data is dynamic based on the current step. -->
{#snippet chart(data)}
	<div class="chart">
		{#each data as d}
			<div class="col" style:--height={d}></div>
		{/each}
	</div>
{/snippet}

{#if useScroller}
	<section id="scrolly">
		<div class="background" aria-hidden="true">
			{@render background(value)}
		</div>
		<div class="spacer"></div>
		<Scrolly bind:value>
			{#each steps as text, i}
				{@const active = value === i}
				{@render foreground(text, value, active)}
			{/each}
		</Scrolly>
		<div class="spacer"></div>
	</section>
{:else}
	<!-- Stacking the graphics matches the DOM order with the reading order. This ensures that screen readers and other assistive technologies can navigate the content in a logical sequence. -->
	<section id="stacked">
		{#each steps as step, i}
			<div>
				<div class="background">
					{@render background(step)}
				</div>
				{@render foreground(step)}
			</div>
		{/each}
	</section>
{/if}

<style>
	#scrolly {
		.background {
			position: sticky;
			top: 4em;
		}
	}

	.spacer {
		height: 75vh;
	}

	.step {
		height: 80vh;
		background: var(--color-gray-100);
		text-align: center;
	}

	.step p {
		padding: 1rem;
	}

	.controls {
		display: flex;
		gap: 2rem;
		padding: 0.5rem;
		font-size: 0.75rem;
		background: var(--color-gray-100);

		p {
			flex: 1 1 75%;
		}

		:global(.bits-switch) {
			white-space: nowrap;
		}
	}

	.chart {
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		gap: 1rem;
		height: 50vh;
	}

	.col {
		flex: 1 1 auto;
		height: calc(var(--height) * 5px);
		background: var(--color-gray-400);
		transition: height var(--1s) cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
