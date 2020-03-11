<style lang="scss">
  $c: green;
  p {
    color: $c;
  }
</style>

<script>
  let s = 0;
  setInterval(() => (s += 1), 1000);
</script>

<p>I have been here for {s} seconds.</p>
