const CWD = process.cwd();

const fs = require("fs");
const archieml = require("archieml");
const fetch = require("node-fetch");
const docs = require(`${CWD}/google.config.cjs`);

const fetchGoogle = async ({ id, gid }) => {
	console.log(`fetching...${id}`);

	const base = "https://docs.google.com";
	const post = gid ? `spreadsheets/u/1/d/${id}/export?format=csv&id=${id}&gid=${gid}` : `document/d/${id}/export?format=txt`;
	const url = `${base}/${post}`;

	try {
		const response = await fetch(url);
		const text = await response.text();

		if (gid) return text;

		const parsed = archieml.load(text);
		const str = JSON.stringify(parsed);
		return str;

	} catch (err) {
		throw new Error(err);
	}
};

(async () => {
	for (let d of docs) {
		try {
			const str = await fetchGoogle(d);
			const file = `${CWD}/${d.filepath}`;
			fs.writeFileSync(file, str);
		} catch (err) {
			console.log(err);
		}
	}
})();