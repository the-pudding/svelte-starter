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
  .chart {
    position: relative;
    width: 20rem;
    height: 20rem;
    background: pink;
  }
</style>

<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg } from "layercake";
  import Child from "./Child.svelte";
  import Scatter from "./Scatter.svelte";
  import petData from "../data/pets.csv";
  import user from "tabler-icons/icons/user.svg";

  let name = "Loading";

  const points = [{ x: 0, y: 1 }, { x: 10, y: 5 }, { x: 15, y: 10 }];
  const r = 6;
  const padding = { top: r * 2, right: r * 2, bottom: r * 2, left: r * 2 };

  onMount(() => (name = "User"));
</script>

<div>
  {@html user}
</div>

<h1>Hello {name}!</h1>

{#each petData as { name, pet }}
  <p>
    {name} has
    <strong>{pet}.</strong>
  </p>
{/each}

<img alt="smokey" src="assets/smokey.jpg" />
<Child />

<div class="chart">
  <LayerCake data="{points}" x="x" y="y" {padding}>
    <Svg>
      <Scatter {r} />
    </Svg>
  </LayerCake>
</div>
