<script>
	import Slider from "$components/helpers/Slider.svelte";
	import Slide from "$components/helpers/Slider.Slide.svelte";
	import Tap from "$components/helpers/Tap.svelte";

	let sliderEl;

	const onTap = ({ detail }) => {
		detail === "right" ? sliderEl.next() : sliderEl.prev();
	};
</script>

<article>
	<Slider bind:this={sliderEl}>
		<Slide index={0}>
			<h2>Slide 1</h2>
			<button>try me</button>
		</Slide>
		<Slide index={1}>
			<h2>Slide 2</h2>
			<button>try me 2</button>
		</Slide>
	</Slider>
</article>

<Tap on:tap={onTap} debug={true} />

<style>
	article {
		height: 100vh;
	}
</style>
