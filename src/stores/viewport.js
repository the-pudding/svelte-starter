import { readable } from "svelte/store";
import debounce from "lodash.debounce";

export default readable({ width: 0, height: 0 }, (set) => {
	const onResize = () => set({ width: window.innerWidth, height: window.innerHeight });

	if (typeof window !== "undefined") {	
		onResize();
		window.addEventListener('resize', debounce(onResize, 250));
	}
	
	return () => {
		if (typeof window !== "undefined") window.removeEventListener('resize', onResize);
	};
});
