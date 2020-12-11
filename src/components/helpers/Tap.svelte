<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "./Icon.svelte";

  export let debug = false;
  export let showArrows = false;
  export let arrowSize = "3rem";
  export let arrowStroke = "#000";
  export let arrowStrokeWidth = "2";
  export let arrowPosition = "center"; // start, center, end
  export let size = "4rem";
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
      class="{side} {arrowPosition}">{#if showArrows}
        <span style="font-size: {arrowSize};"><Icon
            name="chevron-{side}"
            stroke="{arrowStroke}"
            strokeWidth="{arrowStrokeWidth}" /></span>
      {/if}</button>
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
    border-radius: 0;
    outline: none;
    border: none;
    box-shadow: none;
    pointer-events: auto;
    display: flex;
  }

  .left.start,
  .right.start {
    align-items: flex-start;
  }

  .left.center,
  .right.center {
    align-items: center;
  }

  .left.end,
  .right-end {
    align-items: flex-end;
  }

  .top.start,
  .bottom.start {
    justify-content: flex-start;
  }

  .top.center,
  .bottom.center {
    justify-content: center;
  }

  .top.end,
  .bottom-end {
    justify-content: flex-end;
  }

  .left,
  .right {
    height: 100%;
    top: 0;
  }

  .left {
    left: 0;
    text-align: left;
  }
  .right {
    right: 0;
    text-align: right;
  }

  .top,
  .bottom {
    width: 100%;
    left: 0;
    text-align: center;
  }

  .top {
    top: 0;
  }

  .bottom {
    bottom: 0;
  }

  span {
    display: inline-block;
    line-height: 1;
    opacity: 0.5;
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
