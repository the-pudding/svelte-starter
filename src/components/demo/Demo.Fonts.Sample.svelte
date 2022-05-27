<script>
  import { onMount } from "svelte";
  import { copy } from "svelte-copy";
  export let id = "";
  export let family = "";
  export let size = 16;

  let source = "";
  let copied = "";

  const onCopy = () => {
    copied = "Copied!";
    setTimeout(() => {
      copied = "";
    }, 1000);
  };

  $: fontSize = `${size}px`;

  onMount(async () => {
    await import(`./demo-fonts/${id}.css`);
    source = (await import(`./demo-fonts/${id}.css?raw`)).default;
  });
</script>

<div style:font-family={family}>
  <h3>{family}</h3>
  <p style:font-size={fontSize}>The quick brown fox jumps over the lazy dog.</p>
  <details>
    <summary>CSS Snippet</summary>
    <code>
      {@html source}
    </code>
  </details>
  <p>
    <button use:copy={source} on:svelte-copy={onCopy}>
      Copy CSS to Clipboard</button
    ><span>{copied}</span>
  </p>
</div>

<style>
  h2 {
    margin-top: 0;
  }

  div {
    width: calc(25em - 4px);
    padding: 16px;
    background: var(--color-input-bg);
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
