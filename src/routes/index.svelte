<script>
  import Meta from "$lib/components/Meta.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import scrollY from "$lib/stores/scrollY.js";
</script>

<Meta />

<main id="content">
  <h1>{$scrollY}</h1>
  <Footer />
</main>

<style>
  main {
    padding-top: 100vh;
  }
</style>
