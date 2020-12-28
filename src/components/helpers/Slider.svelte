<!--
	Add the css snippet below to your global css file to do a
	full-screen + mobile friendly slider
	
	html, body, main {
	height: 100%;
	overflow: hidden;
}
-->
<script>
  import { setContext, onMount } from "svelte";
  import { writable } from "svelte/store";
  import Slide from "./Slider.Slide.svelte";

  export let direction = "horizontal";
  export let duration = "500ms";
  export let timing = "ease";

  export let count = 0;
  export let active = 0;

  export const next = () => move(1);
  export const prev = () => move(-1);
  export const jump = (val) => move(val, true);

  let children = 0;
  let index = 0;
  let width;
  let height;
  let isInView = false;
  let sliderEl;
  let translateEl;
  let root;
  let observer;

  let _direction = writable();
  let _width = writable();
  let _height = writable();

  const move = (val, jump) => {
    if (!isInView) return false;
    const target = jump ? val : index + val;
    index = Math.max(0, Math.min(children - 1, target));
    active = index;
  };

  const onIntersect = (e) => {
    isInView = e[0].isIntersecting;
  };

  $: w = direction === "horizontal" ? `${children * width}px` : "100%";
  $: h = direction === "vertical" ? `${children * height}px` : "100%";

  $: x = direction === "horizontal" ? `${index * width * -1}px` : 0;
  $: y = direction === "vertical" ? `${index * height * -1}px` : 0;

  $: sW = `width: ${w};`;
  $: sH = `height: ${h};`;
  $: sT = `transform: translate3d(${x}, ${y}, 0);`;
  $: sTD = `transition-duration: ${duration};`;
  $: sTTF = `transition-timing-function: ${timing};`;
  $: customStyle = `${sW} ${sH} ${sT} ${sTD} ${sTTF}`;

  // context
  $: _direction.set(direction);
  $: _width.set(width);
  $: _height.set(height);
  $: context = { direction: _direction, width: _width, height: _height };
  $: setContext("Slider", context);

  onMount(() => {
    children = translateEl.children.length;
    count = children;
    observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: "-1px",
    });
    observer.observe(sliderEl);
    height = height;
    width = width;
  });
</script>

<div
  class="slider {direction}"
  bind:this="{sliderEl}"
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
    flex-wrap: wrap;
    position: relative;
    width: 100%;
    height: 100%;
    transition-property: transform;
    z-index: 1;
  }

  .horizontal > .translate {
    flex-direction: row;
  }

  .vertical > .translate {
    flex-direction: column;
  }
</style>
