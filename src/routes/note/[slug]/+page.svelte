<script>
  import LZString from "$lib/lz";
  export let data;
  let { slug } = data;
  const note = LZString.decompressFromEncodedURIComponent(slug);
</script>

<div class="preview">
  {#if !note}
    <h1>Not a valid input.</h1>
  {:else}
    {@html note}
  {/if}
  <div class="home">
    <a href="/"> Back </a>
  </div>
</div>

<style>
  .preview {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    margin: 2rem auto;
  }
  .home {
    margin-top: auto;
  }
</style>
