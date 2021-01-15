const fs = require("fs");
const archieml = require("archieml");
const request = require("request");

const CWD = process.cwd();
const CONFIG_PATH = `${CWD}/config.json`;
const CONFIG = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const { google } = CONFIG;

const fetchGoogle = ({ id, gid }) => {
	return new Promise((resolve, reject) => {
		console.log(`fetching...${id}`);
		const base= "https://docs.google.com";
		const post = gid ? `spreadsheets/u/1/d/${id}/export?format=json&id=${id}&gid=${gid}` : `document/d/${id}/export?format=txt`;
		const url = `${base}/${post}`;

		request(url, (error, response, body) => {
			if (error) reject(error);
			else if (response && gid) {
				resolve(body);
			} else if (response) {
				const parsed = archieml.load(body);
				const str = JSON.stringify(parsed);
				resolve(str);
			} else reject("no response");
		});
	});
};

(async () => {
	for (let d of google) {
		try {
			const str = await fetchGoogle(d);
			const file = `${CWD}/${d.filepath}`;
			fs.writeFileSync(file, str);
		} catch (err) {
			console.log(err);
		}
	}
})();