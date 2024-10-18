import { browser } from "$app/environment";
import debounce from "lodash.debounce";

const getWidth = () => {
	if (browser)
		return (
			window?.visualViewport?.width || document.documentElement.clientWidth
		);

	return 0;
};

const getHeight = () => {
	if (browser)
		return (
			window?.visualViewport?.height || document.documentElement.clientHeight
		);
	return 0;
};

export default function createViewport() {
	let width = $state(0);
	let height = $state(0);

	const onResize = () => {
		width = getWidth();
		height = getHeight();
	};

	if (browser) {
		onResize();
		window.addEventListener("resize", debounce(onResize, 250));
	}

	// TODO how?
	// return () => {
	// 	if (browser) window.removeEventListener("resize", onResize);
	// };

	return {
		get width() {
			return width;
		},
		get height() {
			return height;
		}
	};
}
