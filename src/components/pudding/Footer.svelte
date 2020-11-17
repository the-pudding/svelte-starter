<script>
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

  const fetchData = (async () => {
    const response = await fetch(url);
    return await response.json();
  })();
</script>

<footer>
  <section class="stories">
    <h3>More stories from The Pudding</h3>
    {#await fetchData then data}
      {#each data.slice(0, 5) as { hed, url, image }}
        <div class="story">
          <p>
            <a href="{url}">
              <img
                src="https://pudding.cool/common/assets/thumbnails/640/{image}.jpg"
                alt="{hed}" />
              <span>{hed}</span>
            </a>
          </p>
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
    padding: 2rem 1rem;
    text-align: center;
  }

  ul {
    list-style-type: none;
  }

  h3 {
  }
</style>
