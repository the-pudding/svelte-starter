<script>
	import DollarSign from "@lucide/svelte/icons/dollar-sign";
	import Button from "$components/ui/Button.svelte";
	const variants = ["default", "secondary", "outline", "ghost", "link"];
	const sizes = ["sm", "default", "lg", "icon"];
</script>

<div id="ui">
	<h1>UI Components</h1>
	<p>
		Pre-styled components available using Bits UI. See the Readme for usage.
	</p>
	<section>
		<h2>Buttons</h2>

		<div class="variants">
			{#each variants as variant}
				<div class="variant">
					<Button {variant}>{variant}</Button>
				</div>
			{/each}
		</div>

		<div class="sizes">
			{#each sizes as size}
				{@const icon = size === "icon"}
				<div class="size">
					<p><code>{size}</code></p>
					<Button {size}
						>{#if icon}<DollarSign />{:else}Test{/if}</Button
					>
				</div>
			{/each}
		</div>
	</section>
</div>

<style>
	#ui {
		max-width: 40rem;
		margin: 0 auto;
		padding: 1rem;
	}

	section {
		margin: 2rem auto;
	}

	p {
		margin: 0.5rem 0;
	}

	section > div {
		margin: 2rem 0;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		/* text-align: center; */
	}

	code {
		background: var(--color-gray-200);
		padding: 0.25rem 0.5rem;
		font-size: var(--14px);
	}
</style>
