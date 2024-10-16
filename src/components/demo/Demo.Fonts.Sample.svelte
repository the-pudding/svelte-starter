<script>
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	// import { copy } from "svelte-copy"; TODO: wait for svelte5 support

	let { id = "", family = "", size = 16, text } = $props();

	let fontSize = $derived(`${size}px`);

	let source = $state("");
	let copied = $state("");

	const url = `${base}/assets/demo/fonts/${id}.css`;

	const onCopy = () => {
		copied = "Copied!";
		setTimeout(() => {
			copied = "";
		}, 1000);
	};

	onMount(async () => {
		const response = await fetch(url);
		source = await response.text();
	});
</script>

<svelte:head>
	<link rel="external stylesheet" href={url} />
</svelte:head>

<div style="font-family: '{family}';">
	<h3>{family}</h3>
	<p style:font-size={fontSize}>{text}</p>
	<details>
		<summary>CSS Snippet</summary>
		<code>
			{source}
		</code>
	</details>
	<!-- TODO -->
	<!-- <p>
    <button use:copy={source} on:svelte-copy={onCopy}>
      Copy CSS to Clipboard</button
    ><span>{copied}</span>
  </p> -->
</div>

<style>
	h3 {
		margin-top: 0;
	}

	div {
		width: calc(25em - 4px);
		padding: 16px;
		background: var(--color-input-bg);
		color: var(--color-input-fg);
		margin: 2px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	details {
		font-family: var(--mono);
	}

	summary {
		cursor: pointer;
	}

	code {
		display: block;
		background: var(--color-input-fg);
		color: var(--color-input-bg);
		padding: 16px;
		white-space: pre-wrap;
	}

	button {
		font-family: var(--mono);
	}

	span {
		margin-left: 16px;
	}
</style>
