<script>
  import { range, format } from "d3";
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let showTicks = false;
  export let value = min;

  const getDecimalCount = (value) => {
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
  };

  $: decimals = getDecimalCount(step);
  $: ticks = showTicks ? range(min, max + step, step) : [];
</script>

<div class="range">
  <div class="ticks">
    {#each ticks as tick}
      <span class="tick">{format(`.${decimals}f`)(tick)}</span>
    {/each}
  </div>
  <input type="range" {min} {max} {step} bind:value />
</div>

<style>
  .range {
    --thumb-width: 20px;
    --tick-height: 8px;
    --tick-font-size: 12px;
    position: relative;
    margin-bottom: calc(var(--tick-height) + var(--tick-font-size));
  }

  input[type="range"] {
    display: block;
    width: 100%;
    appearance: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    background: transparent;
    position: relative;
  }

  input[type="range"]:focus {
    box-shadow: 0 0 4px 0 var(--color-focus, #999);
  }

  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: calc(var(--thumb-width) / 2);
    background: var(--base-gray-light);
    border-radius: 4px;
  }

  input[type="range"]::-webkit-slider-thumb {
    height: var(--thumb-width);
    width: var(--thumb-width);
    border-radius: 50%;
    background: var(--base-off-black);
    -webkit-appearance: none;
    margin-top: -5px;
  }

  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: var(--base-gray-light);
  }

  input[type="range"]::-moz-range-track {
    width: 100%;
    height: calc(var(--thumb-width) / 2);
    background: var(--base-gray-light);
    border-radius: 4px;
  }

  input[type="range"]::-moz-range-thumb {
    box-shadow: 1px 1px 1px #000, 0 0 1px #0d0d0d;
    height: var(--thumb-width);
    width: var(--thumb-width);
    border-radius: 50%;
    background: var(--base-off-black);
  }

  input[type="range"]::-ms-track {
    width: 100%;
    height: calc(var(--thumb-width) / 2);
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }

  input[type="range"]::-ms-fill-lower,
  input[type="range"]::-ms-fill-upper {
    background: var(--base-gray-light);
    border: 0.2px solid #010101;
    border-radius: 4px;
    box-shadow: 1px 1px 1px #000, 0 0 1px #0d0d0d;
  }

  input[type="range"]::-ms-thumb {
    height: var(--thumb-width);
    width: var(--thumb-width);
    border-radius: 50%;
    background: var(--base-off-black);
  }

  input[type="range"]:focus::-ms-fill-lower,
  input[type="range"]:focus::-ms-fill-upper {
    background: var(--base-gray-light);
  }

  .ticks {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 calc(var(--thumb-width) / 2);
    margin: 0;
    user-select: none;
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translate(0, 100%);
  }

  .tick {
    display: flex;
    justify-content: center;
    font-size: var(--tick-font-size);
    line-height: 1;
    text-align: center;
    width: 1px;
    background: transparent;
    color: var(--base-gray);
    padding-top: 0.75em;
    position: relative;
  }

  .tick:before {
    display: block;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0.5em;
    background: var(--base-gray-light);
  }

  .tick:first-of-type {
    transform: translate(-1px, 0);
  }

  .tick:last-of-type {
    transform: translate(1px, 0);
  }
</style>
