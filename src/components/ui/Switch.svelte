<script>
	import { Label, Switch, useId } from "bits-ui";
	let {
		id = useId(),
		checked = $bindable(false),
		size = "default", // "default" | "sm"
		labelText,
		labelPosition = "right", // "right" | "left" | "top" | "bottom"
		class: className,
		...restProps
	} = $props();
</script>

<div class="bits-switch" data-label-position={labelPosition} data-size={size}>
	<Switch.Root {id} class={className} {...restProps} bind:checked>
		<Switch.Thumb />
	</Switch.Root>
	{#if labelText}
		<Label.Root for={id} class="">{labelText}</Label.Root>
	{/if}
</div>

<style>
	div {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
