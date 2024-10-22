<script>
	export let text = "";
	export let max = text.length;
	export let space = true;
	export let tag = "span";
	export let className = "";

	$: regex = new RegExp(`[\\s\\S]{1,${max}}(?!\\S)`, "g");
	$: chunks = text
		.replace(regex, "$&\n")
		.split("\n")
		.map((d) => d.trim())
		.filter((d) => d)
		.map((d, i) => `${i > 0 && space ? "&nbsp;" : ""}${d}`);
</script>

{#each chunks as chunk}
	<svelte:element this={tag} class="chunk {className}"
		>{@html chunk}</svelte:element
	>
{/each}

<style>
	.chunk {
		display: inline-block;
	}
</style>
