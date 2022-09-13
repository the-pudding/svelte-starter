import { browser } from "$app/env";
import { readable } from "svelte/store";

const queries = {
	"20rem": "(min-width: 20rem)",
	"30rem": "(min-width: 30rem)",
	"40rem": "(min-width: 40rem)",
	"50rem": "(min-width: 50rem)",
	"60rem": "(min-width: 60rem)",
	"70rem": "(min-width: 70rem)",
	"80rem": "(min-width: 80rem)",
	"reducedMotion": "(prefers-reduced-motion: reduce)",
	"desktop": "(hover: hover) and (pointer: fine)"
};

function calculateMedia(mqls) {
	const media = { classNames: "" };
	const mediaClasses = [];
	for (let name in mqls) {
		media[name] = mqls[name].matches;
		if (media[name]) mediaClasses.push(`mq-${name}`);
	}
	media.classNames = mediaClasses.join(" ");
	return media;
}

export default readable({}, (set) => {
	if (!browser) return;
	const mqls = {};
	const onChange = () => set(calculateMedia(mqls));

	if (browser) {
		for (let q in queries) {
			mqls[q] = window.matchMedia(queries[q]);
			mqls[q].addListener(onChange);
		}

		onChange();
	}

	return () => {
		for (let q in mqls) {
			mqls[q].removeListener(onChange);
		}
	};
});
