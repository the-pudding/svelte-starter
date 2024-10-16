<script>
	let { label = "A", value = 0 } = $props();
</script>

<p>{label}</p>
<progress {value} max="100"></progress>
