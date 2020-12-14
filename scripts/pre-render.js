const fs = require("fs");
const path = require("path");
const shell = require("shelljs");

const CWD = process.cwd();
const templatePath = path.resolve(CWD, "src/template.html");
const inPath = path.resolve(CWD, "public");
const outPath = path.resolve(CWD, "ssr");
const tmpPath = path.resolve(CWD, ".tmp");
const ssrPath = `${tmpPath}/ssr.js`;

shell.cp("-Rf", `${inPath}/*`, tmpPath);
shell.mkdir("-p", outPath);
shell.mkdir("-p", tmpPath);

const template = fs.readFileSync(templatePath, "utf8");
const app = require(ssrPath);

const version = Date.now();
const { html, head } = app.render();

const result = template
  .replace("<!-- HTML -->", html)
  .replace("<!-- HEAD -->", head)
  .replace(/\.css/g, `.css?version=${version}`)
  .replace(/\.js/g, `.js?version=${version}`);

fs.writeFileSync(`${tmpPath}/index.html`, result);
shell.rm(`${tmpPath}/ssr.js`);
shell.cp("-Rf", `${tmpPath}/*`, outPath);
shell.rm("-Rf", tmpPath);

process.exit();
