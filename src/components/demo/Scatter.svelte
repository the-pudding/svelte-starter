<script>
  import { LayerCake, ScaledSvg, Html } from "layercake";
  import Dots from "./Scatter.Dots.svelte";
  import Labels from "./Scatter.Labels.svelte";

  const points = [
    { x: 0, y: 1, text: "A" },
    { x: 10, y: 5, text: "B" },
    { x: 15, y: 10, text: "C" },
  ];

  const fixedAspectRatio = 1;
</script>

<div class="chart-container">
  <figure style="padding-bottom: {100 / fixedAspectRatio}%">
    <LayerCake
      data="{points}"
      x="x"
      y="y"
      position="absolute"
      ssr="{true}"
      percentRange="{true}"
      fixedAspectRatio="{fixedAspectRatio}"
    >
      <ScaledSvg>
        <Dots r="{4}" scaled="{false}" />
      </ScaledSvg>
      <Html>
        <Labels />
      </Html>
    </LayerCake>
  </figure>
</div>

<style>
  .chart-container {
    width: 50%;
    max-width: 480px;
  }

  figure {
    position: relative;
    width: 100%;
  }
</style>
