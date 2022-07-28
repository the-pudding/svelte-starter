<script>
	import { tweened } from "svelte/motion";
	import { onMount, createEventDispatcher } from "svelte";

	export let start = 3;
	export let text = "";

	const dispatch = createEventDispatcher();
	const end = text ? -1 : 0;
	const duration = start * 1000;
	const countdown = tweened(start, { duration });

	$: display = $countdown < 0 ? text : Math.floor($countdown) + 1;

	countdown.set(end).then(() => dispatch("end"));
</script>

<span class="countdown">{display}</span>
