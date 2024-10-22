<script>
	import { getContext } from "svelte";
	import { line, curveLinear } from "d3";

	const { data, xGet, yGet } = getContext("LayerCake");

	export let stroke = "#ccc";

	export let curve = curveLinear;

	$: path = line().x($xGet).y($yGet).curve(curve);
	$: pathD = path($data);
</script>

<path d={pathD} {stroke} />

<style>
	path {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2;
	}
</style>
