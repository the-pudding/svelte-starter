<script>
	import { Select, useId } from "bits-ui";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
	import Check from "@lucide/svelte/icons/check";

	let {
		id = useId(),
		value = $bindable(),
		items = [], // Array of { value, label, group }
		placeholder = "Select an option",
		multiple = false,
		disabled = false,
		class: className,
		...restProps
	} = $props();

	const groups = $derived.by(() => {
		const g = {};
		items.forEach((item) => {
			const groupName = item.group || "default";
			if (!g[groupName]) g[groupName] = [];
			g[groupName].push(item);
		});
		return g;
	});

	const groupNames = $derived(Object.keys(groups));

	const selectedLabel = $derived.by(() => {
		if (multiple) {
			if (!Array.isArray(value) || value.length === 0) return placeholder;
			return value
				.map((v) => items.find((i) => i.value === v)?.label)
				.filter(Boolean)
				.join(", ");
		}
		const selected = items.find((i) => i.value === value);
		return selected ? selected.label : placeholder;
	});
</script>

<Select.Root
	{id}
	bind:value
	{multiple}
	{disabled}
	type={multiple ? "multiple" : "single"}
	class="bits-select {className}"
	{...restProps}
>
	<Select.Trigger {id}>
		<span data-select-value>{selectedLabel}</span>
		<ChevronDown data-select-icon />
	</Select.Trigger>
	<Select.Content sideOffset={4}>
		{#each groupNames as groupName}
			{#if groupName !== "default"}
				<Select.Group>
					<Select.GroupHeading>{groupName}</Select.GroupHeading>
					{#each groups[groupName] as item}
						<Select.Item value={item.value} label={item.label}>
							{item.label}
							<span data-select-item-indicator><Check /></span>
						</Select.Item>
					{/each}
				</Select.Group>
			{:else}
				{#each groups[groupName] as item}
					<Select.Item value={item.value} label={item.label}>
						{item.label}
						<span data-select-item-indicator><Check /></span>
					</Select.Item>
				{/each}
			{/if}
		{/each}
	</Select.Content>
</Select.Root>
