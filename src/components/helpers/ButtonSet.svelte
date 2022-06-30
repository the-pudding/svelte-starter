<script>
	export let options = [];
	export let legend = "";
	export let legendPosition = "top";
	export let labelClass = "";
	export let disabled = false;
	export let value = options.length ? options[0].value : "";

	const id = `legend-${Math.floor(Math.random() * 1000000)}`;
	const makeSlug = (str = "") => `${str}`.toLowerCase().replace(/\W/g, "");

	$: optionsWithSlug = options.map((d) => ({
		...d,
		val: d.value,
		slug: makeSlug(d.value)
	}));
	$: isTop = legendPosition === "top";
</script>

<div class="button-set">
	<div
		id={`group-${id}`}
		class="group"
		class:is-top={isTop}
		role="radiogroup"
		aria-labelledby={`label-${id}`}
	>
		{#if legend}<div class="legend" id="legend-{id}">{legend}</div>{/if}
		<div class="options">
			{#each optionsWithSlug as option}
				<div class="option">
					<input
						type="radio"
						id={`${id}-${option.slug}`}
						name="name-{id}"
						class="sr-only"
						value={option.value}
						{disabled}
						bind:group={value}
					/>
					<label class="option {labelClass}" for={`${id}-${option.slug}`}>
						{option.label || option.value}
					</label>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.button-set {
		display: inline-block;
		margin-bottom: 4px;
	}

	.group {
		display: flex;
		align-items: center;
	}

	.group.is-top {
		flex-direction: column;
	}

	.is-top .legend {
		padding-bottom: 0.5em;
		padding-right: 0;
	}

	.legend {
		padding-right: 0.5em;
		font-size: 1em;
	}

	.options {
		display: flex;
	}

	label {
		appearance: none;
		user-select: none;
		line-height: 1;
		margin: 0;
		padding: 0.5em;
		border-radius: 0;
		border: 2px solid var(--color-gray-900);
		outline: none;
		cursor: pointer;
		font-family: inherit;
		font-size: 1em;
		display: inline-block;
	}

	.option + .option label {
		border-left-width: 0;
	}

	.option:first-of-type label {
		border-radius: 4px 0 0 4px;
	}

	.option:last-of-type label {
		border-radius: 0 4px 4px 0;
	}

	.option + .option > label {
		border-left-width: 0;
	}

	input[type="radio"] + label {
		background: var(--color-white);
		color: var(--color-gray-900);
	}

	input[type="radio"]:checked + label,
	input[type="radio"]:checked:hover + label {
		background: var(--color-gray-900);
		color: var(--color-white);
	}

	input[type="radio"]:hover + label {
		background: var(--color-gray-100);
	}

	input[type="radio"]:focus + label {
		box-shadow: 0 0 4px 0 var(--color-focus);
	}

	input[type="radio"]:disabled + label {
		color: var(--color-gray-700);
		background: var(--color-gray-500);
		cursor: not-allowed;
	}
</style>
