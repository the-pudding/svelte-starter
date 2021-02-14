import { readable } from "svelte/store";

export default readable(0, (set) => {
	let req;
	let start;

	const tick = (timestamp) => {
		if (!start) start = timestamp;
		const elapsed = Math.round(timestamp - start);
		set(elapsed);
		req = window.requestAnimationFrame(tick);
	};

	if (typeof window !== "undefined") req = window.requestAnimationFrame(tick);
	
	return () => {
		if (typeof window !== "undefined") window.cancelAnimationFrame(req);
	};
});
