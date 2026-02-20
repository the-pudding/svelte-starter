<script>
	import { Slider } from "bits-ui";
	let { value = $bindable(), class: className, ...restProps } = $props();
</script>

<Slider.Root
	bind:value
	type="single"
	class="bits-slider {className}"
	{...restProps}
>
	<span data-slider-range-bg>
		<Slider.Range />
	</span>
	<Slider.Thumb index={0} />
</Slider.Root>
