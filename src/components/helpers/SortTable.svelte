<script>
	import { createEventDispatcher } from "svelte";
	export let caption = "";
	export let rows = []; // [{ class, style }]
	export let columns = []; // [{ label, prop, sort = true, type = "text", dir = undefined, sortFn: undefined, formatFn }];
	export let scrollable = false; // allow for scrollable + sticky header (requires --height);
	export let mobile = false; // toggle to responsive table
	export let filter = undefined; // the prop name that can be searched/filtered

	const dispatch = createEventDispatcher();

	const sortFn = {
		asc: (a, b) =>
			a == null || b == null ? NaN : a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN,
		desc: (a, b) =>
			a == null || b == null ? NaN : b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN
	};

	const onSort = ({ prop, i, same }) => {
		const dir = th[i].dir;
		const newDir = same ? dir : dir === "asc" ? "desc" : "asc";
		const customSort = th[i].sortFn;

		th.forEach((d) => (d.dir = undefined));
		th[i].dir = newDir;
		th = [...th];

		tr.sort((a, b) =>
			customSort
				? customSort(a, b, sortFn[newDir])
				: sortFn[newDir](a[prop], b[prop])
		);
		tr = [...tr];

		if (tbodyEl) tbodyEl.scrollTop = 0;
	};

	const autoSort = () => {
		const match = th.find((d) => d.dir);
		if (match) {
			const { prop, i } = match;
			const same = true;
			onSort({ prop, i, same });
		}
	};

	let tbodyEl;
	let inputValue;

	$: th = columns.map((d, i) => ({ sort: true, type: "text", ...d, i }));
	$: tr = rows.map((d) => ({
		...d,
		style: d.style || "",
		class: d.class || ""
	})).filter(d => {
		if (!filter || !inputValue) return true;
		const a = d[filter]?.toLowerCase();
		const b = inputValue.toLowerCase();
		return a.includes(b);
	});
	$: autoSort(tr);
	$: filterLabel = filter ? th.find((d) => d.prop === filter).label : "";
</script>

<table class:scrollable class:mobile class:filter={!!filter}>
	<caption>{caption}</caption>
	<thead>
		<tr>
			{#each th as { label, prop, type, sort, dir }, i}
				<th
					class:is-sortable={sort}
					class:is-number={type === "number"}
					class:is-asc={dir === "asc"}
					class:is-desc={dir === "desc"}
				>
					{#if sort}
						<button on:click={() => onSort({ prop, i })}>{label}</button>
					{:else}
						{label}
					{/if}
				</th>
			{/each}
		</tr>
		{#if filter}
		<tr>
			<th>
				<input type="text" placeholder="Filter {filterLabel}..." bind:value={inputValue}>
			</th>
		</tr>
		{/if}
	</thead>
	<tbody bind:this={tbodyEl}>
		{#each tr as r}
			<tr style={r.style}
						class={r.class} on:click={() => dispatch("chart", r)}>
				{#each columns as { label, prop, type, formatFn = (d) => d }}
					{@const value = formatFn(r[prop])}
					<td
						data-th={label}
						class:is-number={type === "number"}
					>
						{@html value}
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	caption {
		font-weight: bold;
	}

	table {
		width: 100%;
		margin: 0 auto;
		table-layout: auto;
	}

	
	td {
		vertical-align: bottom;
		line-height: 1.2;
		font-weight: normal;
		padding: 8px;
		text-align: left;
	}

	tbody tr {
		border-top: 1px solid currentColor;
	}

	tbody tr:first-of-type {
		border: none;
	}

	thead tr {
		border-bottom: 2px solid currentColor;
	}

	th {
		padding: 0px;
		vertical-align: bottom;
	}

	th button {
		color: inherit;
		margin: 0;
		background: transparent;
		border: none;
		border-radius: 0;
		appearance: none;
		width: 100%;
		height: 100%;
		line-height: 1.2;
		padding: 8px;
		padding-right: 1.25em;
		text-align: left;
		font-weight: bold;
		position: relative;
	}

	
	th.is-sortable button:after {
		content: "⇅";
		display: flex;
		position: absolute;
		bottom: 0.5em;
		right: 0;
		width: 1.25em;
		justify-content: center;
		align-items: flex-end;
		opacity: 0.5;
	}

	th.is-sortable.is-asc button:after {
		content: "↑";
		visibility: visible;
		opacity: 1;
	}

	th.is-sortable.is-desc button:after {
		content: "↓";
		visibility: visible;
		opacity: 1;
	}

	th.is-number button,
	td.is-number {
		text-align: right;
	}

	/* scrollable */
	.scrollable tbody {
		max-height: var(--height, "auto");
		overflow: auto;
		display: block;
	}

	.scrollable thead tr, .scrollable tbody tr {
		display: table;
		width: 100%;
		table-layout: fixed;
	}

	/* mobile */
	table.mobile {
		/* max-width: 90%; */
		margin: 0 auto;
	}

	.mobile:not(.filter) thead {
    display: none;
  }

	.mobile.filter thead tr:first-of-type {
    display: none;
  }
  
	.mobile tbody {
    width: 100%;
  }
  
	.mobile tr,
  .mobile th,
  .mobile td {
    display: block;
    padding: 0;
  }
  
	.mobile tr {
    border-bottom: none;
    margin: 0;
  }

	.mobile td {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		text-align: left;
		width: auto;
		border-bottom: 1px solid currentColor;
		padding: 4px 8px;
	}

	.mobile td[data-th]:before {
    content: attr(data-th);
    font-weight: bold;
    display: block;
    content: attr(data-th);
		max-width: 50%;
  }

	.filter tr:last-of-type th {
		width: 100%;
	}

	th input {
		width: 100%;
		margin: 8px 0;
		font-size: 0.9em;
	}
</style>
