/*
usage:
import useWindowDimensions from "$runes/useWindowDimensions.svelte.js";
let dimensions = new useWindowDimensions();
// optionally pass debounce time in ms
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

export default class useWindowDimensions {
	#width = $state(0);
	#height = $state(0);

	#debouncedResize;

	#onResize() {
		this.#width = getWidth();
		this.#height = getHeight();
	}

	constructor(ms = 250) {
		$effect(() => {
			this.#onResize();
			this.#debouncedResize = debounce(this.#onResize.bind(this), ms);

			window?.visualViewport.addEventListener("resize", this.#debouncedResize);

			return () => {
				window?.visualViewport.removeEventListener(
					"resize",
					this.#debouncedResize
				);
			};
		});
	}

	get width() {
		return this.#width;
	}

	get height() {
		return this.#height;
	}
}
