<script>
	import Range from "$components/helpers/Range.svelte";

	let value;
</script>

<section id="demo-range">
	<h2>Range <span>{value}</span></h2>
	<Range min={0} max={10} step={1} showTicks={true} bind:value />
</section>
