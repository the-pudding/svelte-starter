<script>
	import copy from "$data/copy.json";
	import CMS from "$components/helpers/CMS.svelte";
	import Test from "$components/demo/Demo.MicroCMSTest.svelte";

	const { body } = copy;
	const components = { Test };

	console.log({ components, body });
</script>

<section id="cms">
	<h2>MicroCMS</h2>
	<CMS {components} {body} />
</section>
