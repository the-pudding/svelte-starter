<script>
  import wordmarkSvg from "../svg/wordmark.svg";
  import petData from "../data/pets.csv";
  export let name;
</script>

<style>
  /* vars defined in global.css */
  h1 {
    color: var(--c1);
  }

  strong {
    color: var(--c2);
  }
</style>

<!-- <style src="../css/app.styl">

</style> -->

<a class="wordmark" href="https://pudding.cool">
  {@html wordmarkSvg}
</a>

<h1>Hello {name}!</h1>

{#each petData as { name, pet }}
  <p>
    {name} has
    <strong>{pet}.</strong>
  </p>
{/each}
