<script>
  import { onMount } from "svelte";
  import { LayerCake, Svg } from "layercake";
  import Scatter from "./Scatter.svelte";
  import Icon from "../helpers/Icon.svelte";
  import sampleData from "../../data/demo/sample.csv";
  import copyData from "../../data/demo/copy.json";

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
  <div>
    <h1>{copyData.headline}</h1>
  </div>

  <div>
    <p>
      Hello svelter! Here is an inline svg icon:
      <!-- icon from tabler (see styling in global.css -->
      <!-- {@html moodSmile} -->
      <Icon name="feather" />
    </p>
  </div>

  <div>
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
  </div>

  <div>
    <p>An image from "public/assets"</p>
    <!-- image from public/assets -->
    <img alt="sad toast" src="assets/toast.png" />
  </div>

  <div>
    <p>A chart using Layercake</p>
    <!-- chart using Layercake -->
    <figure>
      <LayerCake data="{points}" x="x" y="y" padding="{padding}">
        <Svg>
          <Scatter r="{r}" />
        </Svg>
      </LayerCake>
    </figure>
    <div>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <p>
        This is a paragraph with a
        <strong>strong</strong>
        tag and an
        <em>em</em>
        tag. And here is a
        <mark>mark</mark>
        tag. Oh and a
        <a href="#demo">link</a>
        tag.
      </p>
    </div>

    <div>
      <p>Some Elements:</p>
      <p><button>Button</button></p>
      <p>
        <select>
          <option>Select</option>
          <option>Thing 1</option>
          <option>Thing 2</option>
        </select>
      </p>
      <p><input placeholder="input" /></p>
      <p><input type="range" /></p>
    </div>
  </div>
</section>

<style>
  section {
    padding: 1rem;
  }

  div {
    margin-bottom: 2rem;
  }

  img {
    width: 20rem;
  }

  figure {
    position: relative;
    width: 20rem;
    height: 20rem;
  }

  td:nth-child(2),
  th:nth-child(2) {
    text-align: right;
    padding: 0.5em;
  }
</style>
