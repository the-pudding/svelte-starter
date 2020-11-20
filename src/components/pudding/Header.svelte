<script>
  import wordmark from "../../svg/pudding/wordmark.svg";
</script>

<header>
  <div class="wordmark">
    <a href="https://pudding.cool">{@html wordmark}</a>
  </div>
</header>

<style>
  .wordmark {
    max-width: 10em;
    margin: 1em auto;
  }

  .wordmark a {
    border: none;
    color: var(--fg);
  }

  .wordmark a:hover {
    background-color: transparent;
  }
</style>
