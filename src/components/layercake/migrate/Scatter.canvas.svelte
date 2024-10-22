<script>
	import { getContext } from "svelte";
	import { scaleCanvas } from "layercake";

	const { data, xGet, yGet, width, height } = getContext("LayerCake");

	const { ctx } = getContext("canvas");

	export let r = 4;
	export let fill = "#ccc";
	export let stroke = "#000";
	export let strokeWidth = 0;

	$: if ($ctx) {
		scaleCanvas($ctx, $width, $height);
		$ctx.clearRect(0, 0, $width, $height);

		$data.forEach((d) => {
			$ctx.beginPath();
			$ctx.arc($xGet(d), $yGet(d), r, 0, 2 * Math.PI, false);
			$ctx.lineWidth = strokeWidth;
			$ctx.strokeStyle = stroke;
			$ctx.stroke();
			$ctx.fillStyle = fill;
			$ctx.fill();
		});
	}
</script>
