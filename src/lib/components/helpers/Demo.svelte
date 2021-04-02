<script>
  import ButtonSet from "$lib/components/helpers/ButtonSet.svelte";
  import Range from "$lib/components/helpers/Range.svelte";
  import Select from "$lib/components/helpers/Select.svelte";
  import Toggle from "$lib/components/helpers/Toggle.svelte";

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
</script>

<div>
  <section>
    <h2>Button Set = {buttonSetValue}</h2>
    <ButtonSet legend={"Choose"} options={buttonSetOptions} bind:value={buttonSetValue} />
  </section>

  <section>
    <h2>Range = {rangeValue}</h2>
    <Range min={0} max={10} step={1} showTicks={true} bind:value={rangeValue} />
  </section>

  <section>
    <h2>Select = {selectValue}</h2>
    <Select label={"Select something"} options={selectOptions} bind:value={selectValue} />
  </section>

  <section>
    <h2>Toggle (inner) = {toggleValueInner}</h2>
    <Toggle bind:value={toggleValueInner} label="Enable" style="inner" />
  </section>
  <section>
    <h2>Toggle (slider) = {toggleValueSlider}</h2>
    <Toggle bind:value={toggleValueSlider} label="Enable" style="slider" />
  </section>
</div>

<style>
  div {
    max-width: 40em;
    margin: 0 auto;
  }

  section {
    margin: 2em auto;
  }

  h2 {
    font-weight: bold;
  }
</style>
