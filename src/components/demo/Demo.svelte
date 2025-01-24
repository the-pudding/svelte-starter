<script>
	import DemoLink from "$components/demo/Demo.Link.svelte";
	import DemoImg from "$components/demo/Demo.Img.svelte";
	import DemoSvelteElement from "$components/demo/Demo.SvelteElement.svelte";
	import DemoSvelteComponent from "$components/demo/Demo.SvelteComponent.svelte";
	import DemoScrolly from "$components/demo/Demo.Scrolly.svelte";
	import DemoMicroCMS from "$components/demo/Demo.MicroCMS.svelte";
	import DemoSvelte5 from "$components/demo/Demo.Svelte5.svelte";
	import DemoLoadData from "$components/demo/Demo.LoadData.svelte";
	let value = $state(0);

	function onRandom(v) {
		console.log(v);
	}
</script>

<div id="demo">
	<h1>Demo</h1>
	<DemoSvelte5 bind:value random={onRandom} />
	<DemoLink />
	<DemoImg />
	<DemoSvelteElement />
	<DemoSvelteComponent />
	<DemoMicroCMS />
	<DemoLoadData />
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
