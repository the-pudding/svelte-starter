<script>
  import { getContext } from "svelte";
  const { direction, width, height } = getContext("Slider");

  $: w = $direction === "horizontal" ? $width : "100%";
  $: h = $direction === "vertical" ? $height : "100%";
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
