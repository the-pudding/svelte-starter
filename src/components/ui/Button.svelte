<script>
	import { Button } from "bits-ui";
	let {
		children,
		class: className, // "circle"
		variant = "default", // "default" | "primary" | "secondary" | "ghost" | "link" | "outline"
		size = "default", // "default" | "sm" | "lg" | "icon"
		href = undefined,
		disabled,
		...restProps
	} = $props();
</script>

<Button.Root
	{href}
	{disabled}
	class="bits-button {className}"
	{...restProps}
	data-size={size}
	data-variant={variant}
>
	{@render children?.()}
</Button.Root>
