<script>
  import ButtonSet from "$components/helpers/ButtonSet.svelte";
  import Range from "$components/helpers/Range.svelte";
  import Select from "$components/helpers/Select.svelte";
  import Toggle from "$components/helpers/Toggle.svelte";
  import Scrolly from "$components/helpers/Scrolly.svelte";
  import SortTable from "$components/helpers/SortTable.svelte";

  const buttonSetOptions = [{ value: "one" }, { value: "two" }, { value: "three" }];
  const selectOptions = [
    { value: "penny" },
    { value: "nickel" },
    { value: "dime" },
    { value: "quarter" }
  ];

  const tableColumns = [
    { label: "Coin", prop: "name", sort: true, type: "text" },
    { label: "Cents", prop: "value", sort: true, type: "number" }
  ];

  const tableRows = [
    { name: "penny", value: 1 },
    { name: "nickel", value: 5 },
    { name: "dime", value: 10, style: "background: var(--color-highlight);" },
    { name: "quarter", value: 25 }
  ];

  let buttonSetValue;
  let selectValue;
  let rangeValue;
  let toggleValueInner;
  let toggleValueSlider;
  let scrollValue;
</script>

<div>
  <section id="buttonset">
    <h2>Button Set <span>{buttonSetValue}</span></h2>
    <ButtonSet legend={"Choose"} options={buttonSetOptions} bind:value={buttonSetValue} />
  </section>

  <section id="range">
    <h2>Range <span>{rangeValue}</span></h2>
    <Range min={0} max={10} step={1} showTicks={true} bind:value={rangeValue} />
  </section>

  <section id="select">
    <h2>Select <span>{selectValue}</span></h2>
    <Select label={"Select something"} options={selectOptions} bind:value={selectValue} />
  </section>

  <section id="toggle">
    <h2>Toggle (inner) <span>{toggleValueInner}</span></h2>
    <Toggle label="Enable" style="inner" bind:value={toggleValueInner} />
  </section>
  <section>
    <h2>Toggle (slider) <span>{toggleValueSlider}</span></h2>
    <Toggle label="Enable" style="slider" bind:value={toggleValueSlider} />
  </section>

  <section id="table">
    <h2>Sortable Table</h2>
    <SortTable rows={tableRows} columns={tableColumns} />
  </section>

  <section id="scrolly">
    <h2 style="position: sticky; top: 4em;">Scrolly <span>{scrollValue}</span></h2>
    <div class="spacer" />
    <Scrolly bind:value={scrollValue}>
      {#each [0, 1, 2, 3, 4] as text, i}
        <div class="step" class:active={scrollValue === i}>
          <p>{text}</p>
        </div>
      {/each}
    </Scrolly>
    <div class="spacer" />
  </section>
</div>

<style>
  div {
    max-width: 40em;
    margin: 0 auto;
  }

  section {
    margin: 2em auto;
    padding-top: 4em;
  }

  h2 {
    font-weight: bold;
  }

  span {
    background: var(--color-highlight);
    padding: 0 0.5em;
  }

  .spacer {
    height: 75vh;
  }

  .step {
    height: 80vh;
    background: var(--color-gray-100);
  }
</style>
