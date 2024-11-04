<!-- usage
<Footer --footer-bg="#fff" topics={true} recent={true}> 
-->
<script>
	import { onMount } from "svelte";
	import { shuffle } from "d3";
	import wordmark from "$svg/wordmark-line.svg";
	import arrow from "$svg/arrow-footer.svg";

	let localURL;
	let storiesRecent = $state([]);
	let storiesTopics = $state([]);
	let storyCount = $state(0);

	let { topics = true, recent = true } = $props();

	const v = Date.now();
	const url = `https://pudding.cool/assets/data/stories.json?v=${v}`;

	const about = [
		{ name: "Our Team", url: "https://pudding.cool/about" },
		{ name: "Our Resources", url: "https://pudding.cool/resources/" },
		{ name: "Brand Partnerships", url: "https://polygraph.cool" },
		{ name: "Pitch a Story", url: "https://pudding.cool/pitch/" }
	];

	const links = [
		{ name: "Facebook", url: "https://facebook.com/pudding.viz/" },
		{ name: "Twitter", url: "https://twitter.com/puddingviz/" },
		{ name: "YouTube", url: "https://www.youtube.com/@thepudding" },
		{ name: "TikTok", url: "https://www.tiktok.com/@the_pudding" },

		{
			name: "Instagram",
			url: "https://www.instagram.com/the.pudding"
		},
		{ name: "Patreon", url: "https://patreon.com/thepudding/" },
		{ name: "Newsletter", url: "https://pudding.cool/subscribe" },
		{ name: "RSS", url: "https://pudding.cool/feed/index.xml" }
	];

	onMount(async () => {
		localURL = window.location.href;

		if (topics || recent) {
			const response = await fetch(url);
			const data = await response.json();

			const filtered = data.filter((d) => !localURL.includes(d.url));

			storyCount = data.length;
			storiesRecent = recent ? filtered.slice(0, 4) : [];
			storiesTopics = topics
				? shuffle(filtered.filter((d) => d.short)).slice(0, 3)
				: [];
		}
	});
</script>

<footer>
	<div>
		{#if storiesTopics.length}
			<section class="topics">
				We’ve published <strong>{storyCount}</strong> awesome stories on topics
				such as
				{#each storiesTopics as { short, url }, i}
					<a href={url} target="_blank" rel="noreferrer">{short}</a>,&nbsp;
				{/each}and more.
			</section>
		{/if}

		{#if storiesRecent.length}
			<section class="recent">
				<div
					class="stories-wrapper"
					style="min-width: {storiesRecent.length * (300 + 20) + 30}px;"
				>
					{#each storiesRecent as { date, bgColor, fgColor, tease, url, image }}
						{@const href = url.startsWith("http")
							? url
							: `https://pudding.cool/${url}`}
						<div class="story">
							<a {href}>
								<div class="story-img-wrapper">
									<img
										src="https://pudding.cool/common/assets/thumbnails/960/{image}.jpg"
										alt="thumbnail"
									/>
								</div>

								<div
									class="story-desc"
									style="background-color:{bgColor}; color:{fgColor};"
								>
									<p class="story-hed">{tease}</p>
									<p class="story-date">
										{date.slice(0, 2)}/{date.slice(6, 10)}
									</p>
								</div>
							</a>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	</div>
	<div class="footer-wrapper">
		<div class="section section-stickers">
			<div class="row" style="margin-bottom:0;">
				<div class="sticker-col">
					<div class="sticker-outline">
						<div class="sticker">
							<a target="_self" href="https://patreon.com/thepudding"
								><img src="assets/branding/donate.jpg" alt="" /></a
							>
						</div>
					</div>
					<!-- <div class="link">
                        <a target="_self" href="https://patreon.com/thepudding">Support us as a Patron<span class="link-arrow">{@html arrow}</span></a>
                    </div> -->
				</div>
				<div class="sticker-col">
					<div class="sticker-outline sticker-outline-circle">
						<div class="sticker">
							<a target="_self" href="https://pudding.cool/subscribe"
								><img src="assets/branding/subscribe.png" alt="" /></a
							>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="sticker-col">
					<div class="link">
						<a target="_self" href="https://patreon.com/thepudding"
							>Support us as a <span class="arrow-no-wrap"
								>Patron<span class="link-arrow">{@html arrow}</span></span
							></a
						>
					</div>
				</div>

				<div class="sticker-col">
					<div class="link">
						<a target="_self" href="https://thepuddingmail.substack.com/"
							>Subscribe to the <span class="arrow-no-wrap"
								>newsletter<span class="link-arrow">{@html arrow}</span></span
							></a
						>
					</div>
				</div>
			</div>
		</div>

		<div class="section section-links">
			<div class="row">
				<div class="row-label">Follow Us</div>
				<div class="row-content links">
					{#each links as link}
						<div class="link">
							<a href={link.url} target="_self">
								{link.name}
							</a>
						</div>
					{/each}
				</div>
			</div>

			<div class="row">
				<div class="row-label">About Us</div>
				<div class="row-content links">
					{#each about as link, i}
						{@const last = i == about.length - 1 ? true : false}
						<div class="link" class:last>
							<a href={link.url} target="_self">
								{link.name}
							</a>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<div class="section section-last">
			<div class="wordmark">
				<a href="https://pudding.cool" target="_self">{@html wordmark}</a>
			</div>
			<p>Made with <span class="heart">{`<3`}</span>by journalist-engineers</p>
			<a class="privacy" href="https://pudding.cool/privacy/">Privacy Policy</a>
		</div>
	</div>
</footer>

<style>
	.footer-wrapper {
		width: 100%;
		margin: 0 auto;
	}

	.row {
		display: flex;
		margin-bottom: 30px;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	section.topics {
		font-size: 18px;
		text-align: center;
		max-width: 600px;
		margin: 0 auto;
		width: calc(100% - 50px);
		font-family: var(--mono);
		margin-bottom: 50px;
	}

	.row-label {
		width: 50%;
		font-family: var(--mono);
		text-transform: uppercase;
		font-size: 12px;
		padding-top: 5px;
	}

	.sticker-col {
		width: calc(50% - 10px);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.sticker-col .link {
		margin-top: 10px;
	}

	.sticker-outline {
		background: radial-gradient(
			circle,
			rgba(174, 174, 174, 0.6) 0%,
			rgba(250, 250, 250, 0.51) 100%
		);
		border-radius: 8px;
		box-shadow:
			0px 1px 2px rgba(117, 117, 117, 0.1),
			-2px 3px 3px rgba(117, 117, 117, 0.09),
			-3px 6px 4px rgba(117, 117, 117, 0.05),
			-6px 10px 5px rgba(117, 117, 117, 0.01),
			-10px 16px 5px rgba(117, 117, 117, 0);
		transform: rotate(1deg);
	}

	.sticker-outline-circle {
		transform: rotate(-2deg);
	}

	.sticker-outline.sticker-outline-circle {
		background: none;
		border-radius: 0px;
		box-shadow: none;
		position: relative;
		z-index: 100;
	}

	.sticker-outline-circle .sticker:before {
		content: "";
		height: calc(100% + 10px);
		border-radius: 50%;
		aspect-ratio: 1;
		background-color: red;
		position: absolute;
		top: 50%;
		left: 0;
		background: radial-gradient(
			circle,
			rgba(208, 208, 208, 0.5) 0%,
			rgba(250, 250, 250, 1) 100%
		);
		box-shadow:
			0px 1px 2px rgba(117, 117, 117, 0.1),
			-2px 3px 3px rgba(117, 117, 117, 0.09),
			-3px 6px 4px rgba(117, 117, 117, 0.05),
			-6px 10px 5px rgba(117, 117, 117, 0.01),
			-10px 16px 5px rgba(117, 117, 117, 0);
		transform: translate(0, -50%);
		right: 0;
		z-index: 0;
		margin: 0 auto;
	}

	.sticker-outline-circle .sticker {
		padding: 0;
	}

	.sticker-outline-circle .sticker img {
		display: block;
		z-index: 100;
		position: relative;
	}

	.arrow-no-wrap {
		white-space: nowrap;
	}

	.sticker {
		padding: 12px;
	}

	.row-content {
		width: 50%;
	}

	.heart {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAYCAYAAAALQIb7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARgSURBVHgBpVZbaJxVEJ7/uvfNbrq7oW2kSU2xutYaNrZUqGzBBxUfirLxQlWwVnxQEBQffDFF0Dd9UfDyJAWfhCJ5ULCooIK0Ty30QiGkLX1ompb0km5uu3v6zZz5k+0mbdN2YTLnP2f++ebMfDN/iFb4GSJHxTW1mida926xM2bJjsgzIyNihwO6609eZud9fXHT3Z01mUwBr5VUZ2XfgjumWvVNb2/C5HI5PBfVbg10GhJyAJ3+nQiEHCwrFZ/GxlI0O5ujZnMNDtI49iELOJ8mz5uiWOwKBUEDNnFaWMjT3Fwe50nx5ftz5LrXoC9TJnOVJibmHGMa4lsdEe3f71C57NPp01k4WU+t1iDAajipqqM65DCcH6BG4yRensU6i72dkNcgfWLXaJyDPkTz8wepXj9FhcKEGR6uA7ApgJp3Tk3eBMGT0D8YkqzfgPxuXPdb6N8gk7r/K/Y+hP5Pn09CDmDvJ+h/dO8i5A3IRtPTk1pMqeSfcx+Pb8R6rxg7ziHoPcb3dyCArVhvM573IvRBdTYj2nW/h81zWA9JoL7/DPY+wPMlAfS8500q1WOiDAqYLfJTkCNyA897yYTho1h3Q1J63g/ZCWc/I5j/oT+VIBKJ9Saf7xJiWMdDOPtcg+IsbYLEIzDXpNPMpl2aOo5+h+nqygvzbJpdYSLbxWKbEMjjkiJO/cBATCjPdrwm6kWwL+jt/oJsMcVi2raE7RGO6FmN5jukZFAMmKXtbcF0Z9B165KwY8f+LTa29iWkc5fWksEGIzCfvYCmLZqebsD+kjIrBLM8Yan4gKXDF6QG/jTb+sZEtF7cSiY9sDGG9QacjUmbqK0rxkEwD5nG3nFIBQHk0D9JGh31OqcGvxRJ50CQIJvNLAJ9DOsENo9Jm8RiEqCl5NTUPPrmKhryDzwVYPw0+qRE4+MJqtWWTYLOnwANDTHjMgArQe+WLPn+n5DrdP78wpIx14KLz9QlOqGMfBVkGNB8e7cFikYXE8q2yYi2xTcg0hYZe3opG3W12qJUqo5xdAHyFfE0aDY/gwzQ5GSJisVENBM7gfCuR0ePpmhmZi2ysw3b70POIEu/oDST1N8/g5danRHa6IieQFRfKDP/FRoz3QuFTDvg4tDmAW17cq+xU4az8iaGRL8MC7TFSolnwMBks9zIPLa+VsAzeHlYmnMJ0DWVSiDBhWG5A2gf9GZJ34pAbYUWJ/aTwoBfaqOfhZNXcMNHZFrYPitojd5tA3pHGp4nDup41++afgBD+TbZwfyxAvKsext6q6SVaDvkk7aztzSdOSlJR33vfMNyOQLk6N9bjN51P4Lj17H+EVKXNBO9LAFw6piZbVNldb+ohjyMmcJE+xSQJ/64fh14cO+GPBy1yKpvtAyPe4hryKkJw8240R4A/K3EGUVfVqE3aA3de7/RsgsqxTnyROIhqWMQbBciJJNrAbJiDz4YKBPHfkLSOhXScmum92r+m7ovUE5X9P26x7TdBDQqj2YBZPNhAAAAAElFTkSuQmCC);
		width: 40px;
		height: 40px;
		display: inline-block;
		background-repeat: no-repeat;
		width: 26px;
		height: 30px;
		display: inline-block;
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center;
		transform: translate(0, -2px);
		margin-right: 4px;
		color: rgba(255, 255, 255, 0);
	}

	footer {
		background-color: var(--footer-bg, #f7f7f7);
		padding-top: 50px;
		color: var(--color-black);
		font-family: var(--sans);
		z-index: var(--z-top);
		position: relative;
	}

	p {
		font-family: var(--sans);
		font-weight: 400;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
		font-size: var(--16px);
	}

	a,
	a:visited,
	a:hover {
		color: inherit;
	}

	.section {
		width: calc(100% - 50px);
		margin: 0 auto;
		margin-bottom: 50px;
	}

	.section-last {
		margin-top: 100px;
		margin-bottom: 0px;
		padding-bottom: 50px;
	}

	section.recent {
		margin: 0 auto;
		overflow-x: scroll;
		width: 100%;
		margin-bottom: 100px;
	}

	.stories-wrapper {
		display: flex;
		padding-left: 30px;
	}

	.story-date {
		font-family: var(--mono);
		font-size: var(--12px);
		-webkit-font-smoothing: antialiased;
	}

	.story {
		display: block;
		border: none;
		width: 300px;
		height: 400px;
		margin-right: 20px;
	}

	.story a {
		display: block;
		font-weight: 900;
		text-decoration: none;
		border: none;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.story-img-wrapper {
		height: 1px;
		flex-grow: 1;
	}
	.story-img-wrapper img {
		width: 100%;
		object-fit: cover;
		height: 100%;
	}

	.story-desc {
		position: relative;
		padding: 16px 11px 11px 15px;
		border-top: 1px solid #181818;
		background-color: #ccc;
	}

	.story-hed {
		margin: 0;
		font-family: var(--serif);
		font-size: var(--14px);
		-webkit-font-smoothing: auto;
		line-height: 1.3;
	}

	.story span {
		display: block;
		margin-top: 1em;
		line-height: 1.2;
	}

	.wordmark {
		max-width: 240px;
		transform: rotate(-4deg);
		margin: 0;
	}

	.wordmark a {
		border: none;
		text-decoration: none;
	}

	.about {
		margin: 3rem auto;
		margin-top: 0;
		text-align: center;
	}

	.link a {
		border: none;
		text-decoration: underline;
		color: black;
		font-weight: 700;
		font-size: 16px;
		letter-spacing: -0.36px;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
		line-height: 24px;
	}

	.link {
		display: block;
		color: black;
	}

	.link-arrow {
		margin-left: 5px;
	}

	.last {
		margin-top: 50px;
		position: relative;
	}

	.last a {
		z-index: 100;
		position: relative;
	}

	.last a:before {
		content: "";
		background: url(data:image/png;base64,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);
		position: absolute;
		top: 70%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 70%;
		aspect-ratio: 1;
		background-repeat: no-repeat;
		background-size: contain;
		z-index: var(--z-bottom);
		pointer-events: none;
	}

	a.privacy {
		margin-top: 120px;
		color: rgba(0, 0, 0, 0.59);
		font-size: var(--12px);
		text-transform: uppercase;
		font-family: var(--mono);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-rendering: optimizeLegibility;
	}

	@media only screen and (max-width: 350px) {
		.link a {
			font-size: var(--16px);
			line-height: 22px;
		}
	}

	@media only screen and (min-width: 550px) {
		.footer-wrapper {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}
		.row-label {
			width: 100%;
			margin-bottom: 20px;
		}
		.section-links {
			display: flex;
			margin: 0;
			max-width: 400px;
			width: 40%;
		}

		.section-stickers {
			max-width: 450px;
			width: 40%;
			margin: 0;
			margin-left: 25px;
		}

		.section-links .row {
			width: 50%;
			max-width: 200px;
			display: block;
		}

		.section-last {
			width: calc(100% - 50px);
		}

		.sticker-col {
			width: calc(50% - 30px);
		}

		.row-content {
			width: 100%;
		}
	}
</style>
