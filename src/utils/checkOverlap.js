const isOverlapping = (nodes) => {
	const root = nodes[0];
	const { top, left, right, bottom } = root.getBoundingClientRect();
	const a = [left, top, right, bottom];
	const matches = nodes.slice(1).find((node) => {
		const r = node.getBoundingClientRect();
		const b = [r.left, r.top, r.right, r.bottom];
		return intersects(a, b);
	});

	return !!matches;
};

export default function checkOverlap({ elements, reverse: false }) {
	const labels = [...elements];
	if (reverse) players.reverse();
	labels.forEach((el, i) => {
		const order = labels.length - i - 1;
		const overlap = isOverlapping(labels.slice(i));
		if (overlap) el.classList.add("is-overlap");
	});
}