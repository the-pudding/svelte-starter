<script>
	import { getContext } from "svelte";
	import CMS from "$components/helpers/CMS.svelte";
	import Test from "$components/demo/Demo.CMS.Test.svelte";

	const copy = getContext("copy");
	const components = { Test };
	const body = copy.body;
</script>

<section id="demo-cms">
	<h2>CMS</h2>
	<CMS {body} {components}></CMS>
</section>
