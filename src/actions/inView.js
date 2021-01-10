/**
 * This action triggers a custom event on node entering/exiting the viewport.
 * example:
 * <p
 * 	use:inView
 * 	on:enter={() => console.log("enter")}
 * 	on:exit={() => console.log("exit")}
 * >
 */

export default function inView(node) {
	const options = { root: null };
	const handleIntersect = (e) => {
		const v = e[0].isIntersecting ? "enter" : "exit";
		node.dispatchEvent(new CustomEvent(v));
	};
	const observer = new IntersectionObserver(handleIntersect, options);;
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}