<script>
	import playSvg from "$svg/play.svg";
	let { id, href, slug, short, tease, month, bgColor, resource, footer } =
		$props();

	// custom to starter
	const base = "https://pudding.cool";

	const youtube = href.includes("youtube") || href.includes("youtu.be");
	const dir = resource ? "resources" : "screenshots";
	const imagePath = `${base}/common/assets/thumbnails/${dir}`;
	const style = bgColor ? `--story-bg: ${bgColor};` : "";
</script>

<div class="story" {style} class:youtube class:resource class:footer>
	{#if !resource && !footer}
		<div class="info">
			<p class="id">#{id}</p>
			<p class="month">{month}</p>
		</div>
	{/if}
	<a href="{base}/{href}" rel="external" target="_blank" class="inner">
		<div class="screenshot">
			<img
				src="{imagePath}/{slug}.jpg"
				loading="lazy"
				alt="thumbnail for story"
			/>
			{#if youtube}
				<span class="icon--play">{@html playSvg}</span>
			{/if}
		</div>
		<div class="text">
			<h3 class="short">
				<strong>{@html short}</strong>
			</h3>
			<p class="tease">
				{@html tease}
			</p>
		</div>
	</a>
</div>

<style>
  .info {
    display: flex;
    justify-content: space-between;
    font-family: var(--mono);
    margin-bottom: 8px;
    align-items: center;
    user-select: none;
    transition: transform calc(var(--1s) * 0.25);
  }

  .id {
    border: 1px solid var(--color-fg);
    width: 4em;
    text-align: center;
    padding: 4px;
    border-radius: 2em;
  }

  .info p {
    font-size: var(--14px, 14px);
    text-transform: uppercase;
  }

  p {
    margin: 0;
  }

  a {
    display: block;
    text-decoration: none;
  }

  a:focus-visible {
    outline: 2px solid var(--color-focus);
  }

  .story:hover .info {
    transform: translateY(-4px);
  }

  .story:not(.youtube):hover .screenshot img,
  .story:not(.resource):hover .screenshot img {
    transform: translate(-50%, 0) scale(1.05);
  }

  .story.youtube:hover .screenshot img,
  .story.resource:hover .screenshot img {
    transform: translate(-50%, 50%) scale(1.05);
  }

  .screenshot {
    background: var(--story-bg, var(--color-default-story-bg, "#ddd"));
    aspect-ratio: 1;
    position: relative;
    overflow: hidden;
  }

  span.icon--play {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4em;
    aspect-ratio: 1;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: var(--z-top);
  }

  img {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0) scale(1);
    width: calc(100% - (var(--padding, 16px) * 2));
    transform-origin: center center;
    transition: transform calc(var(--1s) * 0.25);
  }

  .youtube img,
  .resource img {
    bottom: 50%;
    transform: translate(-50%, 50%);
    transform-origin: center center;
  }

  .text {
    font-family: var(--sans);
    margin-top: 12px;
  }

  h3.short {
    color: var(--color-fg);
    font-size: clamp(var(--24px, 24px), 6vw, var(--28px, 28px));
    line-height: 1;
    margin: 0;
    margin-bottom: 8px;
  }

  .resource h3.short {
    font-size: clamp(var(--20px, 20px), 6vw, var(--24px, 24px));
  }

  .footer h3.short {
    display: none;
  }

  p.tease {
    color: var(--color-secondary-gray, var(--color-fg));
    font-size: var(--16px);
  }

  .footer p.tease {
    color: var(--color-secondary-gray, var(--color-fg));
    font-size: clamp(var(--16px), 4vw, var(--20px, 20px));
    font-weight: bold;
    line-height: 1.2;
  }

  @media (min-width: 960px) {
    h3.short {
      font-size: clamp(var(--24px, 24px), 2.75vw, var(--32px, 32px));
    }
  }
</style>
