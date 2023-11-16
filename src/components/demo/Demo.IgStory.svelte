<script>
	/**
	 * This is a demonstration of how you might use Tap and Slider/Slide to make an IG story format.
	 * - I'd recommend making `activeSlide` and `dir` into global stores in stores/misc.js.
	 * - `sections` should be brought in from your copy doc.
	 */
	import Chapters from "$components/demo/Demo.IgStory.Chapters.svelte";
	import Figure from "$components/demo/Demo.IgStory.Figure.svelte";
	import Tap from "$components/helpers/Tap.svelte";
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";

	let sliderEl;

	let activeSlide = 0;
	let dir;

	const sections = [
		{
			title: "Intro",
			slides: [
				{
					i: 0,
					text: [
						{ type: "h1", text: "title" },
						{ type: "p", text: "welcome" }
					]
				}
			]
		},
		{
			title: "Middle",
			slides: [
				{
					i: 1,
					text: [
						{ type: "p", text: "the quick brown" },
						{ type: "p", text: "the quick brown" },
						{ type: "p", text: "the quick brown" }
					]
				},
				{
					i: 2,
					text: [
						{ type: "p", text: "fox jumps over" },
						{ type: "p", text: "fox jumps over" }
					]
				},
				{
					i: 3,
					text: [{ type: "p", text: "the lazy dog" }]
				}
			]
		},
		{
			title: "Outro",
			slides: [
				{
					i: 4,
					text: [{ type: "h2", text: "the end." }]
				}
			]
		}
	];
	const allSlides = sections
		.map((d, i) => d.slides.map((s) => ({ ...s, section: i })))
		.flat();

	const onTap = ({ detail }) => {
		if (detail === "right") sliderEl.next();
		else sliderEl.prev();
		window.scrollTo(0, 0);
		dir = detail;
	};
</script>

<Chapters {activeSlide} {sections} {allSlides} />

<article>
	<Slider bind:this={sliderEl} bind:current={activeSlide} duration="0">
		{#each allSlides as slide, i}
			<Slide index={i}>
				{#each slide.text as { type, text }}
					<svelte:element this={type} class="slide-content">
						{@html text}
					</svelte:element>
				{/each}
			</Slide>
		{/each}
	</Slider>
</article>

<Figure {activeSlide} />

<Tap
	debug={false}
	full={true}
	directions={activeSlide === 0 ? ["right"] : ["left", "right"]}
	size={activeSlide === 0 ? "100%" : ["33%", "67%"]}
	enableKeyboard={true}
	marginTop={0}
	on:tap={onTap}
/>

<style>
	article {
		position: absolute;
		top: 5rem;
		left: 50%;
		transform: translate(-50%, 0);
		width: 100%;
		max-width: 45rem;
		padding: 1rem;
		z-index: 3;
		pointer-events: none;
	}
	:global(.slide a) {
		pointer-events: auto;
		white-space: nowrap;
	}
</style>
