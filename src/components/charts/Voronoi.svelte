<script>
	import { getContext, createEventDispatcher } from "svelte";
	import { uniques } from "layercake";
	import { Delaunay } from "d3";

	const { data, xGet, yGet, width, height } = getContext("LayerCake");

	export let stroke = undefined;

	let dispatcher = createEventDispatcher();

	const onEnter = (point) => dispatcher("voronoi-mouseover", point);

	$: points = $data.map((d) => {
		const point = [$xGet(d), $yGet(d)];
		point.data = d;
		return point;
	});
	$: uniquePoints = uniques(points, (d) => d.join(), false);
	$: voronoi = Delaunay.from(uniquePoints).voronoi([0, 0, $width, $height]);
</script>

{#each uniquePoints as point, i}
	<path
		style:stroke
		d={voronoi.renderCell(i)}
		on:mouseover={() => onEnter(point)}
		on:focus={() => onEnter(point)}
	/>
{/each}

<style>
	path {
		fill: none;
		stroke: none;
		pointer-events: all;
		outline: none;
	}
</style>
