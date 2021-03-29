/**
 * This action triggers a custom event on node entering/exiting the viewport.
 * example:
 * <p
 * 	use:inView
 * 	on:enter={() => console.log("enter")}
 * 	on:exit={() => console.log("exit")}
 * >
 * 
 * optional params { root, top, bottom }
 * top and bottom are numbers
 * use:inView={ bottom: 100 } // 100 pixels from bottom of viewport
 */

export default function inView(node, params = {}) {
	let observer;

	const handleIntersect = (e) => {
		const v = e[0].isIntersecting ? "enter" : "exit";
		node.dispatchEvent(new CustomEvent(v));
	};
	
	const setObserver = ({ root, top, bottom }) => {
		const marginTop = top ? top * -1 : 0;
		const marginBottom = bottom ? bottom * -1 : 0;
		const rootMargin = `${marginTop}px 0px ${marginBottom}px 0px`;
		const options = { root, rootMargin };
		if (observer) observer.disconnect();
		observer = new IntersectionObserver(handleIntersect, options);;
		observer.observe(node);
	}

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