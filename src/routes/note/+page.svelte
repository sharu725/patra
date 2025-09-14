<script>
  import { SITE_DESCRIPTION, SITE_SHORT_TITLE } from "$lib/constants.js";
  import SvelteMarkdown from "svelte-markdown";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import MarkdownRender from "$lib/components/MarkdownRender.svelte";

  let slug = $derived(page.url?.hash?.slice(1));
  let metaTitle = $state("Share Notes");
  let plainText = $state("");
  let source = $derived("");
  let contentRef = $state();

  onMount(async () => {
    source = await decompressFromUrlSafe(slug);
    // Extract title and plain text after content is rendered
    setTimeout(() => {
      extractTitleAndText();
    }, 100);
  });

  const extractTitleAndText = () => {
    if (contentRef) {
      // Extract title from first line of source and truncate if needed
      const firstLine = source
        .split("\n")[0]
        .replace(/^#+\s*/, "") // Remove markdown heading syntax
        .trim();

      if (firstLine) {
        // Truncate to 60 characters and add ellipsis if longer
        metaTitle =
          firstLine.length > 60
            ? firstLine.substring(0, 60) + "..."
            : firstLine;
      }

      // Extract plain text content
      plainText = contentRef.textContent.trim().replace(/\n\s*\n/g, "\n\n");
    }
  };

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

  async function decompressFromUrlSafe(compressedStr) {
    const base64 =
      compressedStr.replace(/-/g, "+").replace(/_/g, "/") +
      "=".repeat((4 - (compressedStr.length % 4)) % 4);
    const binaryStr = atob(base64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const decompressionStream = new DecompressionStream("gzip"); // Match the format used in compression
    const decompressedReadableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    }).pipeThrough(decompressionStream);

    const reader = decompressedReadableStream.getReader();
    const chunks = [];
    let done, value;
    while (!done) {
      ({ done, value } = await reader.read());
      if (value) chunks.push(value);
    }
    const decompressedData = new Uint8Array(
      await new Blob(chunks).arrayBuffer()
    );
    return new TextDecoder().decode(decompressedData);
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
    <div class="home no-print">
      <a href="/"> Back </a>
    </div>
    <div class="md" bind:this={contentRef}>
      <!-- <SvelteMarkdown {source} on:parsed={handleParsed} /> -->
      <MarkdownRender md={source} />
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
  .md {
    min-height: 90vh;
  }
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
