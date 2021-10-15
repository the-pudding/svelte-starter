<script>
  import ButtonSet from "$components/helpers/ButtonSet.svelte";
  import Range from "$components/helpers/Range.svelte";
  import Select from "$components/helpers/Select.svelte";
  import Toggle from "$components/helpers/Toggle.svelte";
  import Scrolly from "$components/helpers/Scrolly.svelte";

  const buttonSetOptions = [{ value: "one" }, { value: "two" }, { value: "three" }];
  const selectOptions = [
    { value: "penny" },
    { value: "nickel" },
    { value: "dime" },
    { value: "quarter" }
  ];

  let buttonSetValue;
  let selectValue;
  let rangeValue;
  let toggleValueInner;
  let toggleValueSlider;
  let scrollValue;
</script>

<div>
  <section>
    <h2>Button Set <span>{buttonSetValue}</span></h2>
    <ButtonSet legend={"Choose"} options={buttonSetOptions} bind:value={buttonSetValue} />
  </section>

  <section>
    <h2>Range <span>{rangeValue}</span></h2>
    <Range min={0} max={10} step={1} showTicks={true} bind:value={rangeValue} />
  </section>

  <section>
    <h2>Select <span>{selectValue}</span></h2>
    <Select label={"Select something"} options={selectOptions} bind:value={selectValue} />
  </section>

  <section>
    <h2>Toggle (inner) <span>{toggleValueInner}</span></h2>
    <Toggle label="Enable" style="inner" bind:value={toggleValueInner} />
  </section>
  <section>
    <h2>Toggle (slider) <span>{toggleValueSlider}</span></h2>
    <Toggle label="Enable" style="slider" bind:value={toggleValueSlider} />
  </section>

  <section>
    <h2 style="position: sticky; top: 1em;">Scrolly <span>{scrollValue}</span></h2>
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
    margin: 4em auto;
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
    background: var(--color-off-white);
  }
</style>
