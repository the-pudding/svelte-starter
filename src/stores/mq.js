import { readable } from "svelte/store";

const queries = {
	"sm": "(min-width: 640px)",
	"md": "(min-width: 768px)",
	"lg": "(min-width: 1024px)",
	"xl": "(min-width: 1280px)",
	"reducedMotion": "(prefers-reduced-motion: reduce)"
};

function calculateMedia(mqls) {
	const media = { classNames: '' };
	const mediaClasses = [];
	for (let name in mqls) {
		media[name] = mqls[name].matches;
		if (media[name]) mediaClasses.push(`mq-${name}`);
	}
	media.classNames = mediaClasses.join(" ");
	return media;
}

export default readable({}, (set) => {
	if (typeof window === "undefined") return;
	const mqls = {};
	const onChange = () => set(calculateMedia(mqls));
	
	if (typeof window !== "undefined") {
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
