<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg } from "layercake";
  import Scatter from "./Scatter.svelte";
  import sampleData from "../../data/demo/sample.csv";
  import copyData from "../../data/demo/copy.json";
  import moodSmile from "@tabler/icons/icons/mood-smile.svg";

  const points = [
    { x: 0, y: 1 },
    { x: 10, y: 5 },
    { x: 15, y: 10 },
  ];
  const r = 6;
  const padding = { top: r * 2, right: r * 2, bottom: r * 2, left: r * 2 };
</script>

<section id="demo">
  <!-- copy from google doc -->
  <h1>{copyData.headline}</h1>
  <p>
    Hello svelter! Here is an inline svg icon:
    <!-- icon from tabler (see styling in global.css -->
    {@html moodSmile}
  </p>

  <p>A table from CSV data</p>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Value</th>
      </tr>
    </thead>
    <tbody>
      <!-- data from csv -->
      {#each sampleData as { name, value }}
        <tr>
          <td>{name}</td>
          <td>{value}</td>
        </tr>
      {/each}
    </tbody>
  </table>

  <p>An image from "public/assets"</p>
  <!-- image from public/assets -->
  <img alt="sad toast" src="assets/toast.png" />

  <p>A chart using Layercake</p>
  <!-- chart using Layercake -->
  <div class="chart">
    <LayerCake data="{points}" x="x" y="y" padding="{padding}">
      <Svg>
        <Scatter r="{r}" />
      </Svg>
    </LayerCake>
  </div>
</section>

<style>
  section {
    font-family: sans-serif;
    padding: 1rem;
  }

  /* vars defined in public/assets/global.css */
  h1 {
    color: var(--primary);
    font-size: 2em;
    margin-bottom: 0.5em;
  }

  p {
    font-size: 1.5em;
    margin: 1em auto;
  }

  img {
    width: 20rem;
    display: block;
  }
  .chart {
    position: relative;
    width: 20rem;
    height: 20rem;
  }

  tbody tr {
    border-top: 1px solid #ccc;
  }
  th {
    font-weight: bold;
  }
  td:nth-child(2),
  th:nth-child(2) {
    text-align: right;
    padding: 0.5em;
  }
</style>
