import { browser } from "$app/env";
import { readable } from "svelte/store";

export default readable(0, (set) => {
	let ticking = false;
	let lastScrollY = 0;

	const updateScrollY = () => {
		set(lastScrollY);
		ticking = false;
	};

	const onScroll = () => {
		lastScrollY = window.scrollY;
		if (!ticking) {
			requestAnimationFrame(updateScrollY);
			ticking = true;
		}
	};

	if (browser) document.addEventListener("scroll", onScroll);

	return () => {
		if (browser) document.removeEventListener("scroll", onScroll);
	};
});
