import sirv from "sirv";
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV, BASEPATH } = process.env;
const dev = NODE_ENV === "development";
const basepath = BASEPATH || "/";
polka()
  .use(
    basepath,
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });
