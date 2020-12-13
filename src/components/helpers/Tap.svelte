<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "./Icon.svelte";

  export let debug = false;
  export let showArrows = false;
  export let enableKeyboard = false;
  export let directions = ["left", "right"];
  export let size = "64px";
  export let arrowSize = "48px";
  export let arrowStroke = "#000";
  export let arrowStrokeWidth = "2";
  export let arrowPosition = "center"; // start, center, end

  const dispatch = createEventDispatcher();
  const getW = (dir) => (["left", "right"].includes(dir) ? size : "100%");
  const getH = (dir) => (["up", "down"].includes(dir) ? size : "100%");
  const onKeyDown = (e) => {
    const dir = e.key.replace("Arrow", "").toLowerCase();
    const hasDir = directions.includes(dir);
    if (enableKeyboard && hasDir) {
      e.preventDefault();
      dispatch("tap", dir);
    }
  };
</script>

<svelte:window on:keydown="{onKeyDown}" />

<section class="svelte-tap" class:debug>
  {#each directions as dir}
    <button
      on:click="{dispatch('tap', dir)}"
      style="width: {getW(dir)}; height: {getH(dir)};"
      class="{dir} {arrowPosition}">{#if showArrows}
        <span style="font-size: {arrowSize};"><Icon
            name="chevron-{dir}"
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

  .up.start,
  .down.start {
    justify-content: flex-start;
  }

  .up.center,
  .down.center {
    justify-content: center;
  }

  .up.end,
  .down-end {
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

  .up,
  .down {
    width: 100%;
    left: 0;
    text-align: center;
  }

  .up {
    top: 0;
  }

  .down {
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

  .debug .up {
    background: orange;
    opacity: 0.5;
  }

  .debug .down {
    background: orange;
    opacity: 0.5;
  }
</style>
