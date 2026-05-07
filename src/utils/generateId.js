export default function generateId(len = 8) {
	const vals = "0123456789abcdefghijklmnopqrstuvwxyz";
	const bytes = crypto.getRandomValues(new Uint8Array(len));
	return Array.from(bytes, (b) => vals[b % vals.length]).join("");
}
