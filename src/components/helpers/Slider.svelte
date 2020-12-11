<script>
  import { setContext, onMount } from "svelte";
  import { writable } from "svelte/store";
  import Slide from "./Slider.Slide.svelte";

  export let direction = "horizontal";
  export let duration = "500ms";
  export let timing = "cubic-bezier(0.5, 0, 0.5, 1);";
  export const next = () => move(1);
  export const prev = () => move(-1);
  export const jump = (val) => move(val, true);

  let active = 0;
  let width = 0;
  let height = 0;
  let children = 0;
  let translateEl;

  let _direction = writable();
  let _width = writable();
  let _height = writable();

  const move = (val, jump) => {
    const target = jump ? val : active + val;
    active = Math.max(0, Math.min(children - 1, target));
  };

  $: w = direction === "horizontal" ? `${children * width}px` : "100%";
  $: h = direction === "vertical" ? `${children * height}px` : "100%";

  $: x = direction === "horizontal" ? `${active * width * -1}px` : 0;
  $: y = direction === "vertical" ? `${active * height * -1}px` : 0;

  $: sW = `width: ${w};`;
  $: sH = `height: ${h};`;
  $: sT = `transform: translate(${x}, ${y});`;
  $: sTD = `transition-duration: ${duration};`;
  $: sTTF = `transition-timing-function: ${timing};`;
  $: customStyle = `${sW} ${sH} ${sT} ${sTD} ${sTTF}`;

  // context
  $: $_direction = direction;
  $: $_width = `${width}px`;
  $: $_height = `${height}px`;
  $: context = { direction: _direction, width: _width, height: _height };
  $: setContext("Slider", context);

  onMount(() => {
    children = translateEl.children.length;
  });
</script>

<div
  class="slider {direction}"
  bind:clientWidth="{width}"
  bind:clientHeight="{height}">
  <div class="translate" bind:this="{translateEl}" style="{customStyle}">
    <slot />
  </div>
</div>

<style>
  .slider {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    z-index: 1;
    overflow: hidden;
  }

  .translate {
    display: flex;
    position: relative;
    width: 100%;
    height: 100%;
    transition-property: transform;
    z-index: 1;
  }

  .horizontal .translate {
    flex-direction: row;
  }

  .vertical .translate {
    flex-direction: column;
  }
</style>
