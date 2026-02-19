<script>
	import { Button } from "bits-ui";
	let {
		children,
		class: className,
		variant = "default",
		size = "default",
		href = undefined,
		disabled,
		...restProps
	} = $props();
</script>

<Button.Root
	{href}
	{disabled}
	class={className}
	{...restProps}
	data-size={size}
	data-variant={variant}
>
	{@render children?.()}
</Button.Root>
