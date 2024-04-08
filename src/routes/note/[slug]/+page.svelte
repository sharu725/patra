<script>
  import { SITE_DESCRIPTION, SITE_SHORT_TITLE } from "$lib/constants.js";
  import LZString from "$lib/lz";
  import SvelteMarkdown from "svelte-markdown";

  let { data } = $props();
  const { slug } = data;
  const source = LZString.decompressFromEncodedURIComponent(slug);
  let metaTitle = $state("Share Notes");

  const handleParsed = (/** @type {{ detail: { tokens: any; }; }} */ event) => {
    const tokens = event.detail.tokens;
    metaTitle = tokens[0]?.text;
  };
</script>

<div class="preview">
  {#if slug != "Q" && !source}
    <h1>Not a valid URL.</h1>
  {:else}
    <SvelteMarkdown {source} on:parsed={handleParsed} />
  {/if}
  <div class="home">
    <a href="/"> Back </a>
  </div>
</div>

<svelte:head>
  <title>{SITE_SHORT_TITLE} | {metaTitle}</title>
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
