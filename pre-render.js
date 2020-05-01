const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");
const minifier = require("html-minifier");

const CWD = process.cwd();
const templatePath = path.resolve(CWD, "src/template.html");
const ssrPath = path.resolve(CWD, "public/.tmp/ssr.js");
const indexPath = path.resolve(CWD, "public/index.html");
const tempPath = path.resolve(CWD, "public/.tmp");

const template = fs.readFileSync(templatePath, "utf8");
const app = require(ssrPath);

const version = Date.now();
const { html, head } = app.render();

const result = template
  .replace("<!-- HTML -->", html)
  .replace("<!-- HEAD -->", head)
  .replace(/\.css/g, `.css?version=${version}`)
  .replace(/\.js/g, `.js?version=${version}`);

const minified = minifier.minify(result, {
  minifyCSS: true,
  collapseWhitespace: true
});

fs.writeFileSync(indexPath, minified);
rimraf.sync(tempPath);
process.exit();
