function getXY(node) {
	return node
		.getAttribute("transform")
		.split(",")
		.map((d) => +d.replace(/[^0-9.]/g, ""));
}

// TODO top and bottom
export default function keepWithinBox(node, params = {}) {
	function check({ width }) {
		const { top, left, right, bottom } = node.getBoundingClientRect();
		let transform;
		const [x, y] = getXY(node);
		const w = right - left;
		const rightEdge = x + w / 2;
		const leftEdge = x - w / 2;

		if (rightEdge > width) {
			const diff = rightEdge - width;
			transform = `translate(${x - diff}, ${y})`;
			node.setAttribute("transform", transform);
		} else if (leftEdge < 0) {
			const diff = Math.abs(leftEdge);
			transform = `translate(${x + diff}, ${y})`;
			node.setAttribute("transform", transform);
		}
	}

	check(params);

	return {
		update(params) {
			check(params);
		},

		destroy() {}
	};
}
