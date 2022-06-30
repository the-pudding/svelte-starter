<script>
	import Select from "$components/helpers/Select.svelte";

	const options = [
		{ value: "penny" },
		{ value: "nickel" },
		{ value: "dime" },
		{ value: "quarter" }
	];

	let value;
</script>

<section id="demo-select">
	<h2>Select <span>{value}</span></h2>
	<Select label={"Select something"} {options} bind:value />
</section>
