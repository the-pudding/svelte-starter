<script>
	import A from "$components/demo/Demo.SvelteComponent.A.svelte";
	import B from "$components/demo/Demo.SvelteComponent.B.svelte";
	const components = { A, B };

	const data = [
		{
			component: "A",
			number: 42
		},
		{
			component: "B",
			name: "Russell"
		}
	];
</script>

<section id="demo-component">
	<h2>Dynamic Svelte Component</h2>
	{#each data as d}
		{@const C = components[d.component]}
		<C {...d} />
	{/each}
</section>
