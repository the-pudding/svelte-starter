import { writable } from "svelte/store";

export const prefersReducedMotion = writable(false);
export const windowWidth = writable(0);
export const windowHeight = writable(0);
export const scrollY = writable(0);

if (window) {
	const change = () => prefersReducedMotion.set(!mediaQueryList.matches);
	const query = "(prefers-reduced-motion: no-preference)";
	const mediaQueryList = window.matchMedia(query);
	mediaQueryList.addEventListener("change", change);
	change();
}


