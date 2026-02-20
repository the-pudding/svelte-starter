<script>
	import DollarSign from "@lucide/svelte/icons/dollar-sign";
	import TextCenter from "@lucide/svelte/icons/text-align-center";
	import TextEnd from "@lucide/svelte/icons/text-align-end";
	import TextStart from "@lucide/svelte/icons/text-align-start";
	import Button from "$components/ui/Button.svelte";
	import Switch from "$components/ui/Switch.svelte";
	import Select from "$components/ui/Select.svelte";
	import ToggleGroup from "$components/ui/ToggleGroup.svelte";
	const variants = ["default", "secondary", "outline", "ghost", "link"];
	const sizes = ["sm", "default", "lg", "icon"];
	const selectItems = [
		{ value: "apple", label: "Apple", group: "Fruits" },
		{ value: "banana", label: "Banana", group: "Fruits" },
		{ value: "carrot", label: "Carrot", group: "Vegetables" },
		{ value: "broccoli", label: "Broccoli", group: "Vegetables" },
		{ value: "grape", label: "Grape", group: "Fruits" }
	];

	const selectItemsFlat = selectItems.map(({ value, label }) => ({
		value,
		label
	}));

	const toggleItems = [
		{ value: "left", label: "Left" },
		{ value: "center", label: "Center" },
		{ value: "right", label: "Right" }
	];

	const toggleItemsIcons = [
		{ value: "left", label: "Left", icon: TextStart },
		{ value: "center", label: "Center", icon: TextCenter },
		{ value: "right", label: "Right", icon: TextEnd }
	];
</script>

<div id="ui">
	<h1>UI Components</h1>
	<p>
		Pre-styled components available using Bits UI. See the Readme for usage.
	</p>
	<section class="button">
		<h2>Buttons</h2>

		<div class="variants">
			{#each variants as variant}
				<div class="variant">
					<Button {variant}>{variant}</Button>
				</div>
			{/each}
		</div>

		<div class="sizes">
			{#each sizes as size}
				{@const icon = size === "icon"}
				<div class="size">
					<p><code>{size}</code></p>
					<Button {size}
						>{#if icon}<DollarSign />{:else}Test{/if}</Button
					>
				</div>
			{/each}
		</div>

		<div>
			<Button disabled={true}>Disabled</Button>
		</div>
	</section>

	<section class="switch">
		<h2>Switch</h2>

		<div class="switches">
			<div>
				<Switch labelText="Toggle me" />
			</div>

			<div>
				<Switch labelText="Label above" labelPosition="top" />
			</div>

			<div>
				<Switch labelText="Small toggle" size="sm" />
			</div>
		</div>
	</section>

	<section class="select">
		<h2>Select</h2>
		<div>
			<Select items={selectItemsFlat} />
			<Select items={selectItems} placeholder="Select from group" />
			<Select
				items={selectItemsFlat}
				multiple={true}
				placeholder="Select multiple"
			/>
		</div>
	</section>

	<section>
		<h2>Toggle Group</h2>
		<div class="togglegroups">
			<ToggleGroup items={toggleItems} required={true} />
			<ToggleGroup items={toggleItemsIcons} />
		</div>
	</section>
</div>

<style>
	#ui {
		max-width: 40rem;
		margin: 0 auto;
		padding: 1rem;
	}

	section {
		margin: 2rem auto;
	}

	p {
		margin: 0.5rem 0;
	}

	section > div {
		margin: 2rem 0;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		/* text-align: center; */
	}

	code {
		background: var(--color-gray-200);
		padding: 0.25rem 0.5rem;
		font-size: var(--14px);
	}

	.switches,
	.togglegroups {
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
		align-items: flex-end;
	}
</style>
