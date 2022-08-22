<script>
  import { decode } from "js-base64";
  export let data;
  let { slug } = data;
  const note = decode(slug);
</script>

<div class="container">
  {@html note}

  <div>
    <a href="/"> Back to app </a>
  </div>
</div>

<style>
  .container {
    max-width: 80%;
    margin: 2rem auto;
  }
</style>
