const copydir = require("copy-dir");

copydir.sync("public/assets", "static/assets", {});

process.exit();
