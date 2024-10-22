<script>
	import Toggle from "$components/helpers/Toggle.svelte";
	let valueInner;
	let valueSlider;
</script>

<section id="demo-toggle">
	<h2>Toggle (inner) <span>{valueInner}</span></h2>
	<Toggle label="Enable" style="inner" bind:value={valueInner} />

	<h2>Toggle (slider) <span>{valueSlider}</span></h2>
	<Toggle label="Enable" style="slider" bind:value={valueSlider} />
</section>
