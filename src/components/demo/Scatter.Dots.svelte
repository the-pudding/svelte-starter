<script>
  // Import the getContext function from svelte
  import { getContext } from "svelte";

  // Access the context using the 'LayerCake' keyword
  // Grab some helpful functions
  const { data, xGet, yGet, width } = getContext("LayerCake");

  export let r = 2;
  export let scaled = false;

  $: radius = scaled ? r : (r / $width) * 100;
</script>

<g>
  {#each $data as d}
    <circle cx="{$xGet(d)}" cy="{$yGet(d)}" r="{radius}"> </circle>
  {/each}
</g>
