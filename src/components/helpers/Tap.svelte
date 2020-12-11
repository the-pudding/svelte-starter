<script>
  import { createEventDispatcher } from "svelte";
  export let size = "4em";
  export let debug = false;
  export let sides = ["left", "right"];

  const dispatch = createEventDispatcher();
  const getW = (side) => (["left", "right"].includes(side) ? size : "100%");
  const getH = (side) => (["top", "bottom"].includes(side) ? size : "100%");
</script>

<section class="svelte-tap" class:debug>
  {#each sides as side}
    <button
      on:click="{dispatch('tap', side)}"
      style="width: {getW(side)}; height: {getH(side)};"
      class="{side}"></button>
  {/each}
</section>

<style>
  section {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 100;
    z-index: var(--z-overlay);
    pointer-events: none;
  }

  button {
    position: absolute;
    cursor: pointer;
    background: none;
    opacity: 0;
    border-radius: 0;
    outline: none;
    border: none;
    box-shadow: none;
    pointer-events: auto;
  }

  .left,
  .right {
    height: 100%;
    top: 0;
  }

  .left {
    left: 0;
  }
  .right {
    right: 0;
  }

  .top,
  .bottom {
    width: 100%;
    left: 0;
  }

  .top {
    top: 0;
  }

  .bottom {
    bottom: 0;
  }

  .debug .left {
    background: red;
    opacity: 0.5;
  }

  .debug .right {
    background: red;
    opacity: 0.5;
  }

  .debug .top {
    background: orange;
    opacity: 0.5;
  }

  .debug .bottom {
    background: orange;
    opacity: 0.5;
  }
</style>
