export default async function loadJson(url) {
	const response = await fetch(url);
	const data = await response.json();
	return data;
};