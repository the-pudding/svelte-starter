<script>
	const items = [
		{
			tag: "h3",
			text: "I am a h3 tag."
		},
		{
			tag: "p",
			text: "I am p tag."
		}
	];
</script>

<section id="demo-element">
	<h2>Dynamic Svelte Element</h2>
	{#each items as { tag, text }}
		<svelte:element this={tag}>
			{text}
		</svelte:element>
	{/each}
</section>
