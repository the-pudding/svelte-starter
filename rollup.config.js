import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import svelte from "rollup-plugin-svelte";
import svg from "rollup-plugin-svg";
import json from "@rollup/plugin-json";
import dsv from "@rollup/plugin-dsv";
import { terser } from "rollup-plugin-terser";
import config from "sapper/config/rollup.js";
import sveltePreprocess from "svelte-preprocess";
import pkg from "./package.json";

const mode = process.env.NODE_ENV;
const dev = mode === "development";

const onwarn = (warning, onwarn) =>
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  onwarn(warning);
const dedupe = importee =>
  importee === "svelte" || importee.startsWith("svelte/");

const preprocess = sveltePreprocess({
  scss: true,
  postcss: {
    plugins: [require("autoprefixer")]
  }
});

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode)
      }),
      svelte({
        dev,
        preprocess,
        hydratable: true,
        emitCss: true
      }),
      resolve({
        browser: true,
        dedupe
      }),
      commonjs(),

      !dev &&
        terser({
          module: true
        }),
      json(),
      dsv(),
      svg()
    ],

    onwarn
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode)
      }),
      svelte({
        dev,
        preprocess,
        generate: "ssr"
      }),
      resolve({
        dedupe
      }),
      commonjs(),
      json(),
      dsv(),
      svg()
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules ||
        Object.keys(process.binding("natives"))
    ),

    onwarn
  }
};
