<script>
	export let value = 0;
	export let label;
</script>

<p>This is a custom component:</p>
<label for="#progress">{label}</label>
<progress id="progress" {value} max="100"></progress>

<style>
	label {
		font-family: var(--sans);
		font-weight: bold;
	}
	progress {
		display: block;
	}
</style>
