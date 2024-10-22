<script>
	import ButtonSet from "$components/helpers/ButtonSet.svelte";
	const options = [
		{ value: "penny" },
		{ value: "nickel" },
		{ value: "dime" },
		{ value: "quarter" }
	];

	let value;
</script>

<section id="demo-buttonset">
	<h2>Button Set <span>{value}</span></h2>
	<ButtonSet legend={"Choose"} {options} bind:value />
</section>
