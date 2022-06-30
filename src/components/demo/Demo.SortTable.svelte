<script>
	import SortTable from "$components/helpers/SortTable.svelte";

	const columns = [
		{ label: "Coin", prop: "name", sort: true, type: "text" },
		{ label: "Cents", prop: "value", sort: true, type: "number" }
	];

	const rows = [
		{ name: "penny", value: 1 },
		{ name: "nickel", value: 5 },
		{ name: "dime", value: 10, style: "background: var(--color-mark);" },
		{ name: "quarter", value: 25 }
	];
</script>

<section id="demo-table">
	<h2>Sortable Table</h2>
	<SortTable {rows} {columns} />
</section>
