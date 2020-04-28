import App from "./components/App.svelte";

const dev = !!import.meta.hot;

const app = new App({
  target: document.querySelector("main"),
  hydrate: !dev
});

if (dev) {
  import.meta.hot.dispose(() => {
    app.$destroy();
  });
  import.meta.hot.accept();
}

export default app;
