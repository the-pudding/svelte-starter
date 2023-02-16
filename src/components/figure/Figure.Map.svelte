<script>
	import { getContext, tick } from "svelte";

	import { geoPath, geoAlbersUsa } from "d3";

	export let mode = "svg"; // canvas
	export let features;
	export let fill;
	export let stroke;
	export let strokeWidth = 0.5;
	export let projection = geoAlbersUsa();

	const { width, height, dpr, custom } = getContext("Figure");

	let canvasEl;

	$: ctx = canvasEl?.getContext("2d");
	$: mult = mode === "canvas" ? $dpr : 1;
	$: contextWidth = $width * mult;
	$: contextHeight = $height * mult;

	$: projectionFn = projection.fitSize(
		[contextWidth, contextHeight],
		$custom.projectionObject
	);
	$: pathFn = geoPath().projection(projectionFn);

	$: if (mode === "canvas" && pathFn && contextWidth) render();

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

{#if mode === "svg"}
	{#if features && contextWidth}
		<svg width={contextWidth} height={contextHeight}>
			{#each features as feature}
				<path
					style:stroke
					style:stroke-width="{strokeWidth}px"
					style:fill={feature.properties.fill || "none"}
					d={pathFn(feature)}
				/>
			{/each}
		</svg>
	{/if}
{:else if mode === "canvas"}
	<canvas width={contextWidth} height={contextHeight} bind:this={canvasEl} />
{/if}
