<script>
	import Figure from "$components/figure/Figure.svelte";
</script>

<section id="demo-figure">
	<h2>Figure</h2>
	<Figure --aspect-ratio="1">
		<!-- svelte-ignore a11y-structure -->
		<svg style="background: var(--color-mark);" />
		<figcaption slot="figcaption">Figure caption</figcaption>
	</Figure>
</section>
