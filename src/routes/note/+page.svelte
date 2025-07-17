<script>
  import { SITE_DESCRIPTION, SITE_SHORT_TITLE } from "$lib/constants.js";
  import LZString from "$lib/lz";
  import SvelteMarkdown from "svelte-markdown";
  import { page } from "$app/state";

  let slug = $derived(page.url?.hash?.slice(1));
  let metaTitle = $state("Share Notes");
  let plainText = $state("");
  let source = $derived(LZString.decompressFromEncodedURIComponent(slug));
  let contentRef = $state();

  const handleParsed = (/** @type {{ detail: { tokens: any; }; }} */ event) => {
    const tokens = event.detail.tokens;
    let index = 0;
    tokens.map(({ text }) => {
      if (text && !index) {
        index++;
        metaTitle = text;
      }
    });

    setTimeout(() => {
      if (contentRef) {
        plainText = contentRef.textContent.trim().replace(/\n\s*\n/g, "\n\n");
      }
    }, 0);
  };

  function downloadMarkdown() {
    if (!source) return;
    const blob = new Blob([source], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${metaTitle.replace(/\s+/g, "_") || "note"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadText() {
    if (!plainText) return;
    try {
      const blob = new Blob([plainText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${metaTitle.replace(/\s+/g, "_") || "note"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  }

  function printToPDF() {
    window.print();
  }
</script>

<div class="preview">
  {#if !slug}
    <h2>Content is empty.</h2>
    <div>
      <a href="/"> Back to app </a>
    </div>
  {:else if slug != "Q" && !source}
    <h1>Not a valid URL.</h1>
    <div class="home">
      <a href="/"> Back </a>
    </div>
  {:else}
    <div bind:this={contentRef}>
      <SvelteMarkdown {source} on:parsed={handleParsed} />
    </div>
    <div class="home no-print">
      <div class="export-options">
        <button class="btn" onclick={downloadMarkdown}
          >Download as Markdown</button
        >
        <button class="btn" onclick={downloadText}>Download as Text</button>
        <button class="btn" onclick={printToPDF}>Print to PDF</button>
      </div>
      <br />
      <a href="/"> Back </a>
    </div>
  {/if}
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
  h2 {
    color: red;
  }
</style>
