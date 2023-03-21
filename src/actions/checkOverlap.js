function intersects(
	[minAx, minAy, maxAx, maxAy],
	[minBx, minBy, maxBx, maxBy]
) {
	const aLeftOfB = maxAx < minBx;
	const aRightOfB = minAx > maxBx;
	const aAboveB = minAy > maxBy;
	const aBelowB = maxAy < minBy;

	return !(aLeftOfB || aRightOfB || aAboveB || aBelowB);
}

const isOverlapping = (nodes) => {
	const root = nodes[0];
	const { top, left, right, bottom } = root.getBoundingClientRect();
	const a = [left, top, right, bottom];
	const matches = nodes.slice(1).find((node) => {
		if (node.classList.contains("is-overlap")) return false;
		const r = node.getBoundingClientRect();
		const b = [r.left, r.top, r.right, r.bottom];
		return intersects(a, b);
	});

	return !!matches;
};

export default function checkOverlap(node, params = {}) {
	function check({ reverse, query }) {
		const elements = [
			...node.querySelectorAll(query || ":scope > *:not(iframe)")
		];
		if (reverse) elements.reverse();
		elements.forEach((el, i) => {
			const overlap = isOverlapping(elements.slice(i));
			if (overlap) el.classList.add("is-overlap");
			else el.classList.remove("is-overlap");
		});
	}

	check(params);

	return {
		update(params) {
			check(params);
		},

		destroy() {}
	};
}
