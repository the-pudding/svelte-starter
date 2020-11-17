<script>
  import { onMount } from "svelte";
  import wordmark from "../../pudding-svg/wordmark.svg";
  import facebook from "@tabler/icons/icons/brand-facebook.svg";
  import twitter from "@tabler/icons/icons/brand-twitter.svg";
  import instagram from "@tabler/icons/icons/brand-instagram.svg";
  import patreon from "@tabler/icons/icons/brand-patreon.svg";
  import info from "@tabler/icons/icons/info-circle.svg";
  import mail from "@tabler/icons/icons/mail.svg";
  import lock from "@tabler/icons/icons/lock.svg";
  import rss from "@tabler/icons/icons/rss.svg";

  const v = Date.now();
  const url = `https://pudding.cool/assets/data/stories.json?v=${v}`;

  let localURL;

  onMount(() => {
    localURL = window.location.href;
  });

  const fetchData = (async () => {
    const response = await fetch(url);
    return await response.json();
  })();
</script>

<footer>
  <section class="stories">
    {#await fetchData then data}
      {#each data
        .filter((d) => d.url !== localURL)
        .slice(0, 4) as { hed, url, image }}
        <div class="story">
          <a href="{url}">
            <img
              src="https://pudding.cool/common/assets/thumbnails/640/{image}.jpg"
              alt="{hed}" />
            <span>{hed}</span>
          </a>
        </div>
      {/each}
    {/await}
  </section>

  <section class="company">
    <div class="cta">
      <ul>
        <li>
          <a href="https://facebook.com/pudding.viz/">
            {@html facebook}
            <span>FACEBOOK</span>
          </a>
        </li>
        <li>
          <a href="https://twitter.com/puddingviz/">
            {@html twitter}
            <span>TWITTER</span>
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/the.pudding">
            {@html instagram}
            <span>INSTAGRAM</span>
          </a>
        </li>
        <li>
          <a href="https://patreon.com/thepudding/">
            {@html patreon}
            <span>PATREON</span>
          </a>
        </li>
        <li>
          <a href="https://pudding.cool/about">
            {@html info}
            <span>ABOUT</span>
          </a>
        </li>
        <li>
          <a href="https://pudding.cool/privacy/">
            {@html lock}
            <span>PRIVACY</span>
          </a>
        </li>
        <li>
          <a href="http://eepurl.com/czym6f">
            {@html mail}
            <span>NEWSLETTER</span>
          </a>
        </li>
        <li>
          <a href="https://pudding.cool/feed/index.xml">
            {@html rss}
            <span>RSS</span>
          </a>
        </li>
      </ul>
    </div>
  </section>

  <section class="about">
    {@html wordmark}
    <p>
      <a href="https://pudding.cool">The Pudding</a>
      is a digital publication that explains ideas debated in culture with
      visual essays.
    </p>
  </section>
</footer>

<style>
  footer {
    background-color: var(--fg);
    color: var(--bg);
    font-family: var(--sans);
    padding: 3em 1em;
    margin-top: 3em;
  }

  a {
    display: block;
    font-weight: 700;
    text-decoration: none;
  }

  a,
  a:visited,
  a:hover {
    color: var(--bg);
  }

  span {
    display: block;
    margin-top: 1em;
    line-height: 1.2;
  }
  .stories {
    max-width: 70em;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .story {
    display: block;
    width: 100%;
    border: none;
    margin-bottom: 2rem;
  }

  /* footer.pudding-footer .footer-company {
  margin: 0 auto;
  margin-top: 3rem;
  max-width: 65rem;
  display: flex;
  flex-direction: column;
  font-family: $sans-display;
mq('bp-5')
}
footer.pudding-footer .footer-company__cta {
  order: 1;
  margin: 2rem 0 0 0;
  width: 100%;
mq('bp-5')
}
footer.pudding-footer .footer-company__cta-list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  height: 12rem;
mq('bp-5')
}
footer.pudding-footer .footer-company__cta-list li {
  display: flex;
  width: 50%;
  margin-bottom: 1rem;
  align-items: center;
mq('bp-5')
}
footer.pudding-footer .footer-company__cta-list li a {
  display: flex;
  border: none;
}
footer.pudding-footer .footer-company__cta-list li p {
  font-family: $sans-display;
  margin: 0;
  padding-left: 0.5rem;
  padding-top: 0.1rem;
  line-height: 1;
  color: $gray;
mq('bp-4')
}
footer.pudding-footer .footer-company__cta-list li svg {
  fill: $gray;
  stroke: none;
  vertical-align: middle;
}
footer.pudding-footer .footer-company__cta-list li svg circle,
footer.pudding-footer .footer-company__cta-list li svg polyline,
footer.pudding-footer .footer-company__cta-list li svg line {
  fill: none;
  stroke: $gray;
}
footer.pudding-footer .footer-company__cta-list li .feather-mail path,
footer.pudding-footer .footer-company__cta-list li .feather-lock path,
footer.pudding-footer .footer-company__cta-list li .feather-rss path {
  stroke: $gray;
  fill: none;
}
footer.pudding-footer .footer-company__about {
  order: 0;
  width: 100%;
  color: $gray;
  display: flex;
  flex-direction: column;
mq('bp-5')
}
footer.pudding-footer .footer-company__about p {
  margin: 0;
  line-height: 1.4;
}
footer.pudding-footer .footer-company__about svg {
  width: 12rem;
  margin-bottom: 0.5rem;
} */
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
