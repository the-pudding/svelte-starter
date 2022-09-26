import { browser } from "$app/environment";
import { readable } from "svelte/store";
import debounce from "lodash.debounce";

export default readable({ width: 0, height: 0 }, (set) => {
	const onResize = () => set({ width: window.innerWidth, height: window.innerHeight });

	if (browser) {
		onResize();
		window.addEventListener("resize", debounce(onResize, 250));
	}

	return () => {
		if (browser) window.removeEventListener("resize", onResize);
	};
});
