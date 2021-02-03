<script>
  import debounceFn from "lodash.debounce";
  import { onMount } from "svelte";
  import { windowWidth, windowHeight, scrollY } from "../../stores/global.js";

  export let debounce = 300;

  let ticking = false;
  let lastScrollY = 0;

  const onResize = () => {
    $windowWidth = window.innerWidth;
    $windowHeight = window.innerHeight;
  };

  const updateScrollY = () => {
    $scrollY = lastScrollY;
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) requestAnimationFrame(updateScrollY);
    ticking = true;
  };

  const onScroll = () => {
    lastScrollY = window.scrollY;
    requestTick();
  };

  onMount(() => {
    onResize();
  });
</script>

<svelte:window
  on:resize="{debounceFn(onResize, debounce)}"
  on:scroll="{onScroll}"
/>
