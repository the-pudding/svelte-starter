<script>
	import copy from "$data/copy.json";
	import raw from "$data/copy.json?raw";
	import CMS from "$components/helpers/CMS.svelte";
	import Test from "$components/demo/Demo.MicroCMSTest.svelte";

	const { body } = copy;
	const components = { Test };
</script>

<section id="cms">
	<h2>MicroCMS</h2>
	<code>
		<pre>{raw.replace(/\t/g, " ")}</pre>
	</code>
	<CMS {components} {body} />
</section>
