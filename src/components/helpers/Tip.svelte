<script>
	import Icon from "$components/helpers/Icon.svelte";
	export let text = "Tip";
	export let href;
</script>

<a class="tip-button" {href} target="_blank" rel="noreferrer" role="button"
	>{text} <span><Icon stroke="white" name="dollar-sign" /></span>
</a>

<style>
	a.tip-button {
		background: var(--color-fg);
		color: var(--color-bg);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		box-shadow: 0px 3px 3px 0px var(--color-gray-500);
		letter-spacing: 0.05em;
		padding: 12px 16px;
	}

	span {
		display: inline-block;
		border: 1px solid currentColor;
		width: 1.5em;
		height: 1.5em;
		border-radius: 50%;
		text-align: center;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		margin-left: 8px;
	}

	:global(.tip-button svg) {
		display: inline-block;
	}

	:global(.tip-button svg line) {
		stroke: currentColor;
		stroke-dasharray: 0 0;
	}
</style>
