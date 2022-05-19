import { timeFormat } from "d3";

export default function version() {
	const d = new Date();
	const v = timeFormat("%Y-%m-%d-%H:%M")(d);
	console.log("--- --- --- --- --- ---");
	console.log(`svelte-starter: ${__VERSION__}`);
	console.log(`build: ${v}`);
	console.log("--- --- --- --- --- ---");
}
