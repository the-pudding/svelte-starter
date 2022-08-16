<script>
	import { getContext } from "svelte";
	import Demo from "$components/demo/Demo.svelte";
	import WIP from "$components/helpers/WIP.svelte";
	// import Footer from "$components/Footer.svelte";

	const copy = getContext("copy");
	const data = getContext("data");
	console.log(data);
</script>

<p>{data}</p>
<WIP />
<Demo />
<!-- <Footer /> -->
