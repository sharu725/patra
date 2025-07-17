<script>
  import { SITE_DESCRIPTION, SITE_SHORT_TITLE } from "$lib/constants.js";
  import LZString from "$lib/lz";
  import SvelteMarkdown from "svelte-markdown";
  import { onMount } from "svelte";
  import { page } from "$app/state";

  let slug = $state("");
  let metaTitle = $state("Share Notes");

  onMount(() => {
    slug = window.location.hash.slice(1);
  });

  let source = $derived(LZString.decompressFromEncodedURIComponent(slug));

  const handleParsed = (/** @type {{ detail: { tokens: any; }; }} */ event) => {
    const tokens = event.detail.tokens;
    let index = 0;
    tokens.map(({ text }) => {
      if (text && !index) {
        index++;
        metaTitle = text;
      }
    });
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
  <title>{metaTitle ?? SITE_SHORT_TITLE}</title>
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
