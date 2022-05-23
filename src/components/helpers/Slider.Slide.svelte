<script>
  import { getContext } from "svelte";
  import canTab from "$actions/canTab.js";
  const { dir, cur, w, h } = getContext("Slider");

  export let index;

  $: width = $dir === "horizontal" ? `${$w}px` : "100%";
  $: height = $dir === "vertical" ? `${$h}px` : "100%";
  $: visible = index === $cur;
  $: disable = !visible;
</script>

<section
  class="slide"
  class:visible
  style:width
  style:height
  use:canTab={{ disable }}
>
  <slot />
</section>

<style>
  section {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
