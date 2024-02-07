import { browser } from "$app/environment";
import { readable } from "svelte/store";
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

export default readable({ width: 0, height: 0 }, (set) => {
	const onResize = () => set({ width: getWidth(), height: getHeight() });

	if (browser) {
		onResize();
		window.addEventListener("resize", debounce(onResize, 250));
	}

	return () => {
		if (browser) window.removeEventListener("resize", onResize);
	};
});
