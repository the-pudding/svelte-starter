<script>
	import { tick } from "svelte";
	import { ToggleGroup } from "bits-ui";

	let {
		items = [], // Array of { value, label, icon? }
		type = "single", // "single" | "multiple"
		variant = "default", // "default" | "spaced",
		required = false,
		class: className,
		value = $bindable(),
		...restProps
	} = $props();

	let internalValue = $state(
		required
			? value || (type === "single" ? items[0]?.value : [items[0]?.value])
			: undefined
	);

	// somewhat hacky way to reset the value if required is true and the user tries to deselect the current value
	async function onValueChange(newValue) {
		if (required && !newValue) {
			const previousValue = internalValue;
			internalValue = null;
			await tick();
			internalValue = previousValue;
		} else {
			value = newValue;
			internalValue = newValue;
		}
	}
</script>

<ToggleGroup.Root
	value={internalValue}
	{type}
	class="bits-togglegroup {className}"
	{onValueChange}
	{...restProps}
>
	{#each items as item}
		{@const Icon = item.icon}
		<ToggleGroup.Item value={item.value}>
			{#if Icon}
				<span data-toggle-group-item-icon><Icon /></span>
			{:else}
				{item.label}
			{/if}
		</ToggleGroup.Item>
	{/each}
</ToggleGroup.Root>
