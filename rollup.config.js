import svelte from "rollup-plugin-svelte-hot";
import sveltePreprocess from "svelte-preprocess";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svg from "rollup-plugin-svg";
import json from "@rollup/plugin-json";
import dsv from "@rollup/plugin-dsv";
import hmr from "rollup-plugin-hot";
import execute from "rollup-plugin-execute";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

const dev = !!process.env.ROLLUP_WATCH;

const preprocess = sveltePreprocess({
  scss: true,
  postcss: {
    plugins: [require("autoprefixer")]
  }
});

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js"
  },
  plugins: [
    svelte({
      dev: dev,
      hydratable: !dev,
      css: css => {
        css.write("public/build/bundle.css");
      },
      hot: dev && {
        optimistic: true,
        noPreserveState: false
      },
      preprocess
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"]
    }),
    commonjs(),
    dev && serve(),
    dev &&
      hmr({
        public: "public",
        inMemory: true,
        compatModuleHot: !dev
      }),
    json(),
    dsv(),
    svg(),
    !dev &&
      babel({
        extensions: [".js", ".mjs", ".html", ".svelte"],
        runtimeHelpers: true,
        exclude: ["node_modules/@babel/**", "node_modules/core-js/**"],
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                ie: "11"
              },
              useBuiltIns: "usage",
              corejs: 3
            }
          ]
        ],
        plugins: [
          "@babel/plugin-syntax-dynamic-import",
          [
            "@babel/plugin-transform-runtime",
            {
              useESModules: true
            }
          ]
        ]
      }),
    ,
    !dev && terser(),
    dev && execute("node copy-template.js")
  ],
  watch: {
    clearScreen: false
  }
};

function serve() {
  let started = false;
  return {
    name: "svelte/template:serve",
    writeBundle() {
      if (!started) {
        started = true;
        const flags = ["run", "start", "--", "--dev"];
        require("child_process").spawn("npm", flags, {
          stdio: ["ignore", "inherit", "inherit"],
          shell: true
        });
      }
    }
  };
}
