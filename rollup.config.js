import svelte from "rollup-plugin-svelte-hot";
import sveltePreprocess from "svelte-preprocess";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import svg from "rollup-plugin-svg";
import json from "@rollup/plugin-json";
import dsv from "@rollup/plugin-dsv";
import hmr from "rollup-plugin-hot";
import execute from "rollup-plugin-execute";
import { terser } from "rollup-plugin-terser";

const isWatch = !!process.env.ROLLUP_WATCH;
const isLiveReload = !!process.env.LIVERELOAD;
const isDev = isWatch || isLiveReload;
const isProduction = !isDev;
const isHot = isWatch && !isLiveReload;

const preprocess = sveltePreprocess({
  postcss: {
    plugins: [require("autoprefixer")]
  }
});


function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    name: 'svelte/template:serve',
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn(
        'npm',
        ['run', 'start', '--', '--dev'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        }
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

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
      dev: !isProduction,
      hydratable: isProduction,
      css: css => {
        css.write("bundle.css");
      },
      hot: isHot && {
        optimistic: true,
      },
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
		
		// In dev mode, call `npm run start` once
    // the bundle has been generated
    isDev && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    isLiveReload && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    isProduction && terser(),


    isDev &&
      hmr({
        public: "public",
        inMemory: true,
        compatModuleHot: !isHot
      }),
    
    isDev && execute("node scripts/copy-template.js")
  ],
  watch: {
    clearScreen: false
  }
};
