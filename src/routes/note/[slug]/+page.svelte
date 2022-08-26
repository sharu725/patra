<script>
  import { decode } from "js-base64";
  export let data;
  let { slug } = data;
  const note = decode(slug);
</script>

<div class="preview">
  {@html note}

  <div class="home">
    <a href="/"> Back to app </a>
  </div>
</div>

<style>
  .preview {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 2rem auto;
    min-height: 99vh;
  }
  .home {
    margin-top: auto;
  }
</style>
