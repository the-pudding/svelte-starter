<script>
	import { getContext } from "svelte";

	import { geoPath, geoAlbersUsa, zoom, select, pointer } from "d3";

	export let projection = geoAlbersUsa();
	export let pointRadius = 2;

	let svgEl;
	let transform = "translate(0, 0) scale(1)";

	const { width, height, dpr, custom } = getContext("Figure");

	// $: zoomFn = zoom().scaleExtent([1, 8]).on("zoom", onZoom);

	$: $custom.projectionFn = projection.fitSize(
		[$width, $height],
		$custom.projectionObject
	);

	$: $custom.pathFn = geoPath()
		.projection($custom.projectionFn)
		.pointRadius(pointRadius);
	$: if (svgEl) select(svgEl).call(zoomFn);

	// function onZoom(event) {
	// 	const [x, y] = pointer(event);
	// 	const center = `translate(${-$width / 4}, ${-$height / 4})`;
	// 	const s = 2;
	// 	const scale = `scale(${s})`;
	// 	const x1 = $width / 2 - x - $width / (s * 2);
	// 	const y1 = $height / 2 - y - $height / (s * 2);
	// 	const move = `translate(${x1}, ${y1})`;
	// 	transform = ` ${scale} ${move}`;
	// }
</script>

{#if $custom.pathFn && $width}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<svg width={$width} height={$height} on:mousemove>
		<g {transform}>
			<slot />
		</g>
	</svg>
{/if}
