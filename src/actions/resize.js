import debounce from "lodash.debounce";

/**
 * This action triggers a resize event on node resizing, with optional debounce for performance.
 * example:
 * <p
 * 	use:resize
 * 	on:resize={() => console.log("enter")}
 * >
 *
 * optional params { debounce, exclude }
 * // debounce: ms to debounce resize event
 * // exclude: "width" or "height" to exclude from triggering resize event
 * use:resize={{ debounce: 250, exclude: "height" }}
 *
 */

export default function resize(node, params = {}) {
	let observer;
	let w;
	let h;

	const handleResize = (entries) => {
		const firstTime = w === undefined;

		for (const entry of entries) {
			const { width, height } = entry.contentRect;
			const widthTrigger = params.exclude !== "width" && width !== w;
			const heightTrigger = params.exclude !== "height" && height !== h;
			if (widthTrigger || heightTrigger) {
				w = width;
				h = height;
				if (!firstTime) node.dispatchEvent(new CustomEvent("resize"));
			}
		}
	};

	const setObserver = () => {
		if (observer) observer.disconnect();
		const cb = params.debounce
			? debounce(handleResize, params.debounce)
			: handleResize;
		observer = new ResizeObserver(cb);
		observer.observe(node);
	};

	setObserver(params);

	return {
		update(params) {
			setObserver(params);
		},

		destroy() {
			if (observer) observer.disconnect();
		}
	};
}
