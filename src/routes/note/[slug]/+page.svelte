<script>
  import { SITE_DESCRIPTION, SITE_SHORT_TITLE } from "$lib/constants.js";
  import LZString from "$lib/lz";
  import SvelteMarkdown from "svelte-markdown";

  export let data;
  let { slug } = data;
  const source = LZString.decompressFromEncodedURIComponent(slug);
</script>

<div class="preview">
  {#if !source}
    <h1>Not a valid URL.</h1>
  {:else}
    <SvelteMarkdown {source} />
  {/if}
  <div class="home">
    <a href="/"> Back </a>
  </div>
</div>

<svelte:head>
  <title>{SITE_SHORT_TITLE} | {source?.slice(0, 20)}</title>
  <meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>

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
