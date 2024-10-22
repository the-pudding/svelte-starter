<!-- TODO: wait for svelte5 support -->
<!-- <script>
	import { copy } from "svelte-copy";

	export let buttonText = "Share";
	export let notifyText = "Link copied!";
	export let title;
	export let url;

	let notified = false;

	function notify() {
		notified = true;
		setTimeout(() => (notified = false), 1500);
	}

	function onCopy() {
		if (notified) return;

		if (navigator.share) {
			navigator
				.share({ title, url })
				.then(() => {})
				.catch((err) => {
					console.log(err);
				});
		} else notify();
	}
</script>

<button use:copy={url} on:svelte-copy={onCopy} class:notified>
	{notified ? notifyText : buttonText}
</button> -->
