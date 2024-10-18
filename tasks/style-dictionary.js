import StyleDictionary from "style-dictionary";
const CWD = process.cwd();

new StyleDictionary({
	source: [`${CWD}/properties/**/*.json`],
	platforms: {
		css: {
			transformGroup: "css",
			buildPath: `${CWD}/src/styles/`,
			files: [
				{
					format: "css/variables",
					destination: "variables.css"
				}
			]
		},
		json: {
			buildPath: `${CWD}/src/data/`,
			files: [
				{
					format: "json/nested",
					destination: "variables.json"
				}
			]
		}
	}
}).buildAllPlatforms();
