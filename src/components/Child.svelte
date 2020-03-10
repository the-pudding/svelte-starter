<script>
  let s = 0;
  setInterval(() => (s += 1), 1000);
</script>

<style lang="scss">
  $c: green;
  p {
    color: $c;
  }
</style>

<p>I have been here for {s} seconds.</p>
