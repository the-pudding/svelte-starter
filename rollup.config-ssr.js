import svelte from "rollup-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svg from "rollup-plugin-svg";
import json from "@rollup/plugin-json";
import dsv from "@rollup/plugin-dsv";
import execute from "rollup-plugin-execute";

const preprocess = sveltePreprocess({
  postcss: {
    plugins: [require("autoprefixer")]
  }
});

export default {
  input: "src/components/App.svelte",
  output: {
    format: "cjs",
    file: ".tmp/ssr.js"
  },
  plugins: [
    svelte({
      generate: "ssr",
      preprocess
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"]
    }),
    commonjs(),
    json(),
    dsv(),
    svg(),
    execute("node pre-render.js")
  ]
};
