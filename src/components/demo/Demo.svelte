<script>
	import DemoLink from "$components/demo/Demo.Link.svelte";
	import DemoImg from "$components/demo/Demo.Img.svelte";
	import DemoSvelteElement from "$components/demo/Demo.SvelteElement.svelte";
	import DemoSvelteComponent from "$components/demo/Demo.SvelteComponent.svelte";
	import DemoScrolly from "$components/demo/Demo.Scrolly.svelte";
	import DemoMicroCMS from "$components/demo/Demo.MicroCMS.svelte";
	// import DemoFigure from "$components/demo/Demo.Figure.svelte";
	// import DemoTip from "$components/demo/Demo.Tip.svelte";
	// import DemoLayerCake from "$components/demo/Demo.LayerCake.svelte";
</script>

<div id="demo">
	<h1>Demo</h1>
	<DemoLink />
	<DemoImg />
	<DemoSvelteElement />
	<DemoSvelteComponent />
	<DemoMicroCMS />
	<DemoScrolly />
</div>

<style>
	#demo {
		max-width: 40rem;
		padding: 16px;
		margin: 0 auto;
	}

	:global(#demo section) {
		margin: 32px auto;
		padding-top: 32px;
	}

	:global(#demo h2 span) {
		background: var(--color-mark);
		padding: 0 8px;
	}
</style>
