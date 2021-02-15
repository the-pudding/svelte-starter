import { linear } from 'svelte/easing';
import { interpolateTransformSvg } from "d3-interpolate";

export default function transform(node, params) {
	const a = node.getAttribute("transform");
	const b = `${params.relative ? a : ""} ${params.target}`;
	const interpolator = interpolateTransformSvg(a, b);
	
	return {
		delay: params.delay || 0,
		duration: params.duration || 250,
		easing: params.easing || linear,
		tick: (t, u) => {
			const transform = interpolator(u);
			node.setAttribute("transform", transform);
		},
		css: (t) => params.opacity ? `opacity: ${t}` : null
	};
}