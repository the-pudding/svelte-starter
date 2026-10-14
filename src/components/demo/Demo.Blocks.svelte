<h2>Content Blocks</h2>
<section id="demo-blocks" class="blocks-container">
	<div class="block-narrow">
		<p>Narrow Content goes here</p>
	</div>
	<div class="block-content">
		<p>Default Content goes here</p>
	</div>
	<div class="no-bg">
		<p>Example of default content without background</p>
	</div>
	<div class="block-wide">
		<p>Wide content goes here</p>
	</div>
	<div class="block-wider">
		<p>Wider content goes here</p>
	</div>
	<div class="block-widest">
		<p>Widest goes here</p>
	</div>
	<div class="block-full">
		<p>Full bleed content goes here</p>
	</div>
	<div class="block-full blocks-container">
		<p>
			Full bleed parent container with child content. You can recursively apply
			`.blocks-container` to keep consistent alignment.
		</p>
	</div>
</section>

<style>
	/* For best results, add this section to `app.css` so you can use it globally throughout your project. CSS variable definitions are in `properties/layout.json` */
	/* Grid container */
	.blocks-container {
		--column-gap: var(--container-padding);
		--row-gap: 0;
		--narrow: min(
			var(--block-narrow),
			100% - var(--column-gap) * 2
		); /* Allow for padding on small screens */
		--content: minmax(0, var(--block-content));
		--wide: minmax(0, var(--block-wide));
		--wider: minmax(0, var(--block-wider));
		--widest: minmax(0, var(--block-widest));
		--full: minmax(var(--column-gap), 1fr);

		display: grid;
		grid-template-columns:
			[full-start] var(--full)
			[widest-start] var(--widest)
			[wider-start] var(--wider)
			[wide-start] var(--wide)
			[content-start] var(--content)
			[narrow-start] var(--narrow) [narrow-end]
			var(--content) [content-end]
			var(--wide) [wide-end]
			var(--wider) [wider-end]
			var(--widest) [widest-end]
			var(--full) [full-end];
		row-gap: var(--row-gap);
	}

	.blocks-container > *,
	.block-content {
		grid-column: content;
	}

	.block-narrow {
		grid-column: narrow;
	}

	.block-wide {
		grid-column: wide;
	}

	.block-wider {
		grid-column: wider;
	}

	.block-widest {
		grid-column: widest;
	}

	.block-full {
		grid-column: full;
	}

	/* For demo purposes only */
	:global(html) {
		container-type: inline-size;
	}

	#demo-blocks {
		--row-gap: var(--32px);
		/* Breaks the demo section out of the demo container max-widths */
		width: 100cqi;
		margin-left: calc(50% - 50cqi);
	}
	div {
		background: var(--color-gray-100);
	}

	p {
		padding: var(--16px);
	}

	.no-bg {
		background: none;
	}
</style>
