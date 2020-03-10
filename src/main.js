import App from "./components/App.svelte";

const app = new App({
  target: document.querySelector("main")
});

export default app;

// recreate the whole app if an HMR update touches this module
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    app.$destroy();
  });
  import.meta.hot.accept();
}
