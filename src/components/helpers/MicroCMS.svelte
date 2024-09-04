<script>
	// an object of components that map to section names (e.g., { "Hero": Hero }) where Hero is a Svelte component
	export let components = {};
	// an array of objects that contain a section name and content (either an array of object)
	export let body = [];
</script>

{#each body as { section, content }}
	{@const id = section.toLowerCase().replace(/[^a-z0-9]/g, "")}
	{@const component = components[section]}
	<section {id}>
		{#if component}
			<svelte:component this={component} {...content}></svelte:component>
		{:else}
			{#each content as { type, value }}
				{@const component = components[type]}
				{@const isString = typeof value === "string"}
				{#if component}
					<svelte:component this={component} {...value}></svelte:component>
				{:else if type === "text"}
					<p>{@html value}</p>
				{:else if isString}
					<svelte:element this={type}>
						{@html value}
					</svelte:element>
				{:else}
					<svelte:element this={type} {...value}></svelte:element>
				{/if}
			{/each}
		{/if}
	</section>
{/each}
