import { readable } from "svelte/store";

export default readable(false, (set) => {
	const query = "(prefers-reduced-motion: no-preference)";
	const mediaQueryList = window ? window.matchMedia(query) : {};

	const onChange = () => set(!mediaQueryList.matches);
	
	if (window) {
		mediaQueryList.addEventListener("change", onChange);
		onChange();
	}
	
	return () => mediaQueryList.removeEventListener('change', onChange);
});


