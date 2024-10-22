/*
usage:
import Viewport from "$runes/Viewport.svelte.js";
const viewport = new Viewport();
*/

import debounce from "lodash.debounce";

function getWidth() {
	return window?.visualViewport?.width || document.documentElement.clientWidth;
}

function getHeight() {
	return (
		window?.visualViewport?.height || document.documentElement.clientHeight
	);
}

export default class Viewport {
	width = $state(0);
	height = $state(0);

	#debouncedResize;

	#onResize() {
		this.width = getWidth();
		this.height = getHeight();
	}

	constructor() {
		$effect(() => {
			this.#onResize();
			this.#debouncedResize = debounce(this.#onResize.bind(this), 250);

			window.addEventListener("resize", this.#debouncedResize);

			return () => {
				window.removeEventListener("resize", this.#debouncedResize);
			};
		});
	}
}
