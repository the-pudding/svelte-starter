import { writable } from "svelte/store";

export const prefersReducedMotion = writable(false);

if (window) {
	const change = () => prefersReducedMotion.set(!mediaQueryList.matches);
	const query = "(prefers-reduced-motion: no-preference)";
	const mediaQueryList = window.matchMedia(query);
	mediaQueryList.addEventListener("change", change);
	change();
}


