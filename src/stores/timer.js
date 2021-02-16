import { writable } from "svelte/store";

let req;
let prev;
const elapsed = writable(0);

const tick = (timestamp) => {
	if (!prev) prev = timestamp;
	const diff = Math.round(timestamp - prev);
	prev = timestamp;
	elapsed.update(e => e + diff);
	req = window.requestAnimationFrame(tick);
};

const timer = {
	start() {
		if (typeof window === "undefined") return;
		else if (!req) {
			prev = null;
			req = window.requestAnimationFrame(tick);
		}
	},
	stop() {
		if (typeof window === "undefined") return;
		else if (req) {
			window.cancelAnimationFrame(req);
			req = null;
		}
	},
	toggle() {
		req ? timer.stop() : timer.start();
	},
	set(val) {
		if (typeof val === "number") elapsed.set(val);
	},
	reset() {
		timer.set(0);
	}
};

export { timer, elapsed };