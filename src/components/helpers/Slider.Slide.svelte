<script>
  import { getContext } from "svelte";
  const { direction, width, height } = getContext("Slider");

  $: w = $direction === "horizontal" ? `${$width}px` : "100%";
  $: h = $direction === "vertical" ? `${$height}px` : "100%";
</script>

<div class="slide" style="width: {w}; height: {h};">
  <slot />
</div>

<style>
  .slide {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
