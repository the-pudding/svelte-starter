<script>
	let {
		name,
		age = 30, // fallback value
		renamed: renameMe, // rename prop (pass in as renameMe)
		value = $bindable(), // two way binding to share value with parent
		children, // children (previously slots)
		random, // dispatch event
		...props // rest of the props
	} = $props();

	const people = [{name: "John", age: 30}, {name: "Jill", age: 45}];

	let count = $state(0);

	// v1
	let result1 = $derived(count * 2);


	// v2
	let result2 = $derived.by(() => {
		return count * 2;
	});
	// can also call fn: $derived.by(fn)
	
	// v3 (less ideal since its more of a side effect)
	let result3 = $state(0);
	
	$effect(() => {
		result3 = count * 2;
	});
	// can also call fn: $effect(fn)

	
	// $inspect(name);
	
</script>

<h2>Svelte5</h2>

<h3>Reactive variables 3 ways:</h3>
<!-- previously on:click -->
<button onclick={() => count++}>count++</button>
<p>{count} doubled is {result1} (derived)</p>
<p>{count} doubled is {result2} (derived by)</p>
<p>{count} doubled is {result3} ($effect)</p>


<h3>Children (previously slots):</h3>
<div class="children">
	{@render children?.()}
</div>

<h3>Dispatch Event</h3>
<button onclick={() => random(Math.floor(Math.random() * 10))}>Random</button>

<!-- reusable snippet can be defined anywhere -->
{#snippet person(p)}
	<div class="person">
		<p>{p.name}</p>
		<p>{p.age}</p>
	</div>
{/snippet}

<h3>Snippets</h3>

<div class="people">
{#each people as p}
	{@render person(p)}
{/each}
</div>

<style>
	.people {
		display: flex;
	}

	.person {
		margin: 8px;
	}

	p {
		margin: 0;
	}

	button {
		margin-bottom: 8px;
	}
</style>