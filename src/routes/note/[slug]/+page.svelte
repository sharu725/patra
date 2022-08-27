<script>
  import LZString from "$lib/lz";
  import SvelteMarkdown from "svelte-markdown";
  export let data;
  let { slug } = data;
  const source = LZString.decompressFromEncodedURIComponent(slug);
</script>

<div class="preview">
  {#if !source}
    <h1>Not a valid input.</h1>
  {:else}
    <SvelteMarkdown {source} />
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
  @media screen and (max-width: 600px) {
    .preview {
      margin: 1rem auto;
      padding: 0 1em;
    }
  }
</style>
