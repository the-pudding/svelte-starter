<script>
	import { Label, Switch, useId } from "bits-ui";
	let {
		id = useId(),
		checked = $bindable(false),
		labelText,
		labelPosition = "right",
		class: className,
		...restProps
	} = $props();
</script>

<div class="bits-switch" data-label-position={labelPosition}>
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
