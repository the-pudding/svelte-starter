<script>
	import Button from "$components/ui/Button.svelte";
	import DollarSign from "@lucide/svelte/icons/dollar-sign";
	let { text = "Tip", href = "#" } = $props();
</script>

<Button {href} target="_blank" rel="noreferrer">
	{text} <span><DollarSign color="currentColor" /></span>
</Button>

<style>
	span {
		display: inline-block;
		width: 1.25rem;
		height: 1.25rem;
		margin-left: 0.25rem;
	}
</style>
