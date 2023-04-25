import { range } from "d3";

export default function generateId(len = 4) {
	const vals = "0123456789abcdefghijklmnopqrstuvwxyz".split("");
	const id = range(len)
		.map(() => vals[Math.floor(Math.random() * vals.length)])
		.join("");
	return id;
}
