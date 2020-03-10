<script>
  import Child from "./Child.svelte";
  import wordmarkSvg from "../svg/wordmark.svg";
  import petData from "../data/pets.csv";
</script>

<style>
  /* vars defined in public/assets/global.css */
  h1 {
    color: var(--c1);
  }

  strong {
    color: var(--c2);
  }

  img {
    width: 20rem;
    display: block;
  }
</style>

<!-- <style src="../css/app.scss">

</style> -->

<a class="wordmark" href="https://pudding.cool">
  {@html wordmarkSvg}
</a>

<h1>Hello!</h1>

{#each petData as { name, pet }}
  <p>
    {name} has
    <strong>{pet}.</strong>
  </p>
{/each}

<img alt="smokey" src="assets/smokey.jpg" />
<Child />
