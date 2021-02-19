<script>
  // Import the getContext function from svelte
  import { getContext } from "svelte";

  // Access the context using the 'LayerCake' keyword
  // Grab some helpful functions
  const { data, xGet, yGet } = getContext("LayerCake");
</script>


  {#each $data as d}
    <p style="left: {$xGet(d)}%; top: {$yGet(d)}%;">{d.text}</p>
  {/each}


<style>
	p {
		position: absolute;
		margin: 0;
		line-height: 1;
		transform: translate(-50%, 50%);
	}
</style>