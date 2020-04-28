import App from "./components/App.svelte";

const dev = false;

const app = new App({
  target: document.querySelector("main"),
  props: { name: "User" },
  hydrate: !dev
});

// if (dev) {
//   import.meta.hot.dispose(() => {
//     app.$destroy();
//   });
//   import.meta.hot.accept();
// }

export default app;
