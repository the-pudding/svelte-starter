<script>
	export let activeSlide;
	export let sections;
	export let allSlides;
</script>

<div class="chapters">
	{#each sections as { title, slides }, i}
		{@const chapterActive = allSlides[activeSlide].section === i}
		<div class="chapter" class:active={chapterActive}>
			<span class="text">
				{i + 1}<span class="title"> — {title}</span>
			</span>
			{#if chapterActive}
				{#each slides as slide}
					{@const active = slide.i === activeSlide}
					<div class="block" class:active />
				{/each}
			{:else}
				<div class="block" />
			{/if}
		</div>
	{/each}
</div>

<style>
	.chapters {
		position: absolute;
		top: 5rem;
		display: flex;
		width: 100%;
		justify-content: space-between;
		padding: 0 1rem;
	}
	.chapter {
		display: flex;
		align-items: end;
		flex: 1;
		margin: 0 3px;
	}
	.chapter:first-of-type {
		margin-left: 0;
	}
	.chapter:last-of-type {
		margin-right: 0;
	}
	.chapter.active {
		flex: 5;
	}
	.text {
		position: absolute;
		top: -1.2rem;
		font-size: 12px;
		white-space: nowrap;
		opacity: 0.3;
	}
	.chapter.active .text {
		opacity: 1;
	}
	.title {
		visibility: hidden;
	}
	.chapter.active .title {
		visibility: visible;
	}
	.block {
		position: relative;
		flex: 1;
		height: 2px;
		border-radius: 1px;
		margin: 0 1px;
		background: black;
		opacity: 0.3;
		transition: opacity calc(var(--1s) * 0.4);
	}
	.block:first-of-type {
		margin-left: 0;
	}
	.block:last-of-type {
		margin-right: 0;
	}
	.block.active {
		opacity: 1;
	}

	@media (max-width: 600px) {
		.text {
			font-size: 10px;
		}
	}
</style>
