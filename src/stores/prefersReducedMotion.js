import { readable } from "svelte/store";

export default readable(false, (set) => {
	const query = "(prefers-reduced-motion: no-preference)";
	const mediaQueryList = typeof window !== "undefined" ? window.matchMedia(query) : {};

	const onChange = () => set(!mediaQueryList.matches);
	
	if (typeof window !== "undefined") {
		mediaQueryList.addListener(onChange);
		onChange();
	}
	
	return () => {
		if (typeof window !== "undefined") mediaQueryList.removeListener(onChange);
	}
});
