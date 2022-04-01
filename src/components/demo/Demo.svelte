<script>
  import DemoImg from "$components/demo/Demo.Img.svelte";
  import DemoButtonSet from "$components/demo/Demo.ButtonSet.svelte";
  import DemoRange from "$components/demo/Demo.Range.svelte";
  import DemoSelect from "$components/demo/Demo.Select.svelte";
  import DemoToggle from "$components/demo/Demo.Toggle.svelte";
  import DemoSortTable from "$components/demo/Demo.SortTable.svelte";
  import DemoLayerCake from "$components/demo/Demo.LayerCake.svelte";
  import DemoScrolly from "$components/demo/Demo.Scrolly.svelte";
</script>

<div id="demo">
  <DemoImg />
  <DemoButtonSet />
  <DemoRange />
  <DemoSelect />
  <DemoToggle />
  <DemoSortTable />
  <DemoLayerCake />
  <DemoScrolly />
</div>

<style>
  #demo {
    max-width: 40em;
    padding: 1rem;
    margin: 0 auto;
  }

  :global(#demo section) {
    margin: 2em auto;
    padding-top: 4em;
  }

  :global(#demo h2) {
    font-weight: bold;
  }

  :global(#demo h2 span) {
    background: var(--color-highlight);
    padding: 0 0.5em;
  }
</style>
