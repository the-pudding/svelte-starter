<style>
  /* vars defined in public/assets/global.css */
  h1 {
    color: var(--c1);
  }

  strong {
    color: var(--c2);
  }

  img {
    width: 20rem;
    display: block;
  }
  .chart-container {
    width: 300px;
    height: 300px;
    background: pink;
  }
</style>

<script>
  import { LayerCake, Svg } from "layercake";
  import Child from "./Child.svelte";
  import Scatter from "./Scatter.svelte";
  import wordmarkSvg from "../svg/wordmark.svg";
  import petData from "../data/pets.csv";

  const points = [{ x: 0, y: 1 }, { x: 10, y: 5 }, { x: 15, y: 10 }];
  const r = 6;
  const padding = { top: r * 2, right: r * 2, bottom: r * 2, left: r * 2 };
</script>

<!-- <style src="../css/app.scss">

</style> -->

<a class="wordmark" href="https://pudding.cool">
  {@html wordmarkSvg}
</a>

<h1>Hello!</h1>

{#each petData as { name, pet }}
  <p>
    {name} has
    <strong>{pet}.</strong>
  </p>
{/each}

<img alt="smokey" src="assets/smokey.jpg" />
<Child />

<div class="chart-container">
  <LayerCake data="{points}" x="x" y="y" {padding}>
    <Svg>
      <Scatter {r} />
    </Svg>
  </LayerCake>
</div>
