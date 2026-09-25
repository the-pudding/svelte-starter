<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	let value = $state();
</script>

<section id="scrolly">
	<!-- Adding `aria-hidden="true"` to the background section will hide all children content from screen readers -->
	<div class="background" aria-hidden="true">
		<h2>Scrolly <span>{value || "-"}</span></h2>
	</div>
	<div class="spacer"></div>
	<Scrolly bind:value>
		{#each [0, 1, 2, 3, 4] as text, i}
			{@const active = value === i}
			<div class="step" class:active>
				<p>{text}</p>
				<!-- Use screen reader only elements to describe the graphic in each step -->
				<p class="sr-only">Describe the graphic in step {text}</p>
			</div>
		{/each}
	</Scrolly>
	<div class="spacer"></div>
</section>

<style>
	.background {
		position: sticky;
		top: 4em;
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
</style>
