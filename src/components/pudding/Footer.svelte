<script>
  import { onMount } from "svelte";
  import wordmark from "../../svg/pudding/wordmark.svg";

  const v = Date.now();
  const url = `https://pudding.cool/assets/data/stories.json?v=${v}`;

  let localURL;

  const links = [
    { name: "about", url: "https://pudding.cool/about" },
    { name: "facebook", url: "https://facebook.com/pudding.viz/" },
    { name: "twitter", url: "https://twitter.com/puddingviz/" },
    {
      name: "instagram",
      url: "https://www.instagram.com/the.pudding",
    },
    { name: "patreon", url: "https://patreon.com/thepudding/" },
    { name: "privacy", url: "https://pudding.cool/privacy/" },
    { name: "newsletter", url: "http://eepurl.com/czym6f" },
    { name: "rss", url: "https://pudding.cool/feed/index.xml" },
  ];

  onMount(() => {
    localURL = window.location.href;
  });

  const fetchData = (async () => {
    const response = await fetch(url);
    const data = await response.json();
    const stories = data.filter((d) => d.url !== localURL).slice(0, 4);
    return stories;
  })();
</script>

<footer>
  <section class="stories">
    {#await fetchData then data}
      {#each data as { hed, url, image }}
        <div class="story">
          <a href="https://pudding.cool/{url}">
            <img
              src="https://pudding.cool/common/assets/thumbnails/640/{image}.jpg"
              alt="{hed}" />
            <span>{hed}</span>
          </a>
        </div>
      {/each}
    {/await}
  </section>

  <section class="about">
    <div class="wordmark">
      {@html wordmark}
    </div>
    <p>
      <a href="https://pudding.cool">The Pudding</a>
      is a digital publication that explains ideas debated in culture with
      visual essays.
    </p>
  </section>

  <section class="links">
    <ul>
      {#each links as link}
        <li>
          <a href="{link.url}">
            <!-- TODO icon -->
            <span>{link.name.toUpperCase()}</span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
</footer>

<style>
  footer {
    background-color: var(--text-main);
    color: var(--background-body);
    font-family: var(--sans);
    padding: 3em 1em;
    margin-top: 3em;
  }

  a,
  a:visited,
  a:hover {
    color: var(--background-body);
  }

  .stories {
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 70em;
  }

  .story {
    display: block;
    width: 100%;
    border: none;
    margin-bottom: 3rem;
  }

  .story a {
    display: block;
    font-weight: 700;
    text-decoration: none;
  }

  .story span {
    display: block;
    margin-top: 1em;
    line-height: 1.2;
  }

  .wordmark {
    max-width: 10em;
    margin: 1em auto;
  }

  .about {
    margin: 3rem auto;
    margin-top: 0;
    text-align: center;
  }

  .links ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .links li {
    display: flex;
    padding: 0.5em 1em;
  }

  .links a {
    display: flex;
    border: none;
    align-items: center;
    text-decoration: none;
  }

  .links span {
    margin-left: 0.5em;
  }

  @media only screen and (min-width: 30em) {
    .story {
      width: 50%;
      padding: 0 1em;
    }
  }

  @media only screen and (min-width: 50em) {
    .story {
      width: 25%;
      padding: 0 1em;
    }
  }
</style>
