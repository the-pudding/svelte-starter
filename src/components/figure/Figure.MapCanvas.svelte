<script>
	import { getContext, tick } from "svelte";

	import { geoPath, geoAlbersUsa } from "d3";

	export let features;
	export let fill = "none";
	export let stroke;
	export let strokeWidth = 0.5;
	export let projection = geoAlbersUsa();

	const { width, height, dpr, custom } = getContext("Figure");

	let canvasEl;

	$: ctx = canvasEl?.getContext("2d");
	$: contextWidth = $width * $dpr;
	$: contextHeight = $height * $dpr;

	$: projectionFn = projection.fitSize(
		[contextWidth, contextHeight],
		$custom.projectionObject
	);
	$: pathFn = geoPath().projection(projectionFn);

	$: if (pathFn && contextWidth && features) render();

	function drawPath({ path, strokeStyle, fillStyle }) {
		ctx.beginPath();
		pathFn.context(ctx);
		pathFn(path);

		if (strokeStyle) {
			ctx.lineWidth = strokeWidth;
			ctx.strokeStyle = strokeStyle;
			ctx.stroke();
		}

		if (fillStyle) {
			ctx.fillStyle = fillStyle;
			ctx.fill();
		}
	}

	async function render() {
		await tick();
		ctx.clearRect(0, 0, contextWidth, contextHeight);
		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		features.forEach((feature) => {
			const { properties } = feature;
			const strokeStyle = properties.stroke || stroke;
			const fillStyle = properties.fill || fill;
			const path = feature;
			drawPath({ path, strokeStyle, fillStyle });
		});
	}
</script>

<canvas width={contextWidth} height={contextHeight} bind:this={canvasEl} />
