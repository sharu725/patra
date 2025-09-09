<script lang="ts">
  import { page } from "$app/state";
  import SvelteMarkdown from "svelte-markdown";
  import SplitPane from "$lib/components/SplitPanes.svelte";
  import Tabs from "$lib/components/Tabs.svelte";
  import { dev } from "$app/environment";
  import { GITHUB_REPO, SITE_DESCRIPTION, SITE_TITLE } from "$lib/constants";
  import { onMount } from "svelte";
  import Analytics from "$lib/Analytics.svelte";
  import { tabHelpers, tabs_data } from "$lib/tabs_store.svelte";

  let source = $state("");
  let finalLink = $derived(`${page.url.origin}/note#${source}`);
  let isPageLoaded = $state(false);
  let inputCharacterCount = $state(0);
  let outputCharacterCount = $derived(finalLink?.length);
  let isZenMode = $state(false);

  // Get the active tab content
  let activeTab = $derived(tabHelpers.getActiveTab());
  let activeContent = $derived(activeTab?.content || "");

  const toggleZenMode = () => {
    isZenMode = !isZenMode;
  };

  const handleInput = async (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    const content = target.value;

    // Update the active tab's content
    if (activeTab) {
      tabHelpers.updateTabContent(activeTab.id, content);
    }

    source = await compressToUrlSafe(content);
    inputCharacterCount = content?.length;
  };

  onMount(async () => {
    isPageLoaded = true;
    inputCharacterCount = activeContent?.length;
    source = await compressToUrlSafe(activeContent);
  });

  // Watch for active tab changes and update source
  $effect(() => {
    if (activeContent !== undefined) {
      compressToUrlSafe(activeContent).then((compressed) => {
        source = compressed;
      });
      inputCharacterCount = activeContent?.length;
    }
  });

  const copyText = () => {
    navigator.clipboard.writeText(finalLink);
  };

  const downloadAllTabs = () => {
    const tabs = tabs_data.current;
    let markdownContent = "";

    tabs.forEach((tab, index) => {
      // Add tab title with equals underline
      markdownContent += `${tab.title}\n`;
      markdownContent += "=".repeat(tab.title.length) + "\n";
      markdownContent += tab.content;

      // Add spacing between tabs (except for the last one)
      if (index < tabs.length - 1) {
        markdownContent += "\n\n\n";
      }
    });

    // Create and download the file
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "patra_data_all_tabs.md";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  async function compressToUrlSafe(text: string) {
    const encoder = new TextEncoder();
    const inputStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text));
        controller.close();
      },
    });

    const compressionStream = new CompressionStream("gzip"); // or 'deflate'
    const compressedReadableStream = inputStream.pipeThrough(compressionStream);

    const reader = compressedReadableStream.getReader();
    const chunks = [];
    let done, value;
    while (!done) {
      ({ done, value } = await reader.read());
      if (value) chunks.push(value);
    }
    const compressedData = new Uint8Array(await new Blob(chunks).arrayBuffer());

    const base64 = btoa(String.fromCharCode(...compressedData));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }
</script>

<main class="container" class:zen-mode={isZenMode}>
  {#if !isZenMode}
    <header class="header">
      <a href="/">
        <h1 class="header-title">{SITE_TITLE}</h1>
      </a>
      {#if isPageLoaded}
        <div class="preview-link">
          <a class="btn" href={finalLink}> Preview </a>
          <button
            class="btn download-btn"
            onclick={downloadAllTabs}
            title="Download all tabs as markdown"
            aria-label="Download all tabs as markdown"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
          <button class="btn zen-btn" onclick={toggleZenMode}>
            {isZenMode ? "Exit Zen" : "Zen Mode"}
          </button>
        </div>
      {/if}
    </header>
  {:else}
    <!-- Zen mode header with minimal controls -->
    <div class="zen-header">
      <button class="btn zen-btn" onclick={toggleZenMode}>
        Exit Zen Mode
      </button>
    </div>
  {/if}

  <!-- Tabs Component - Always visible -->
  <Tabs />

  <div class="markdown-editor" class:zen-editor={isZenMode}>
    <SplitPane leftInitialSize={isZenMode ? "100%" : "50%"}>
      <svelte:fragment slot="left">
        <div class="left-panel">
          <div class="editor">
            <textarea
              value={activeContent}
              oninput={handleInput}
              class="source"
              placeholder="Start writing your markdown here..."
            ></textarea>
          </div>
          <div class="count">{inputCharacterCount} characters</div>
        </div>
      </svelte:fragment>
      <svelte:fragment slot="right">
        {#if !isZenMode}
          <div class="right-panel">
            <div class="output">
              <div class="output-content">
                <SvelteMarkdown source={activeContent} />
              </div>
            </div>
          </div>
        {/if}
      </svelte:fragment>
    </SplitPane>
  </div>

  {#if !isZenMode}
    <div class="link">
      <div>
        <h2>Your {SITE_TITLE} link</h2>
        <button class="btn copy-btn" onclick={copyText}>Copy</button>
      </div>
      <pre class="output"><code>{`${finalLink}`}</code> <div
          class="count">{outputCharacterCount} characters</div></pre>
      <div>
        <p>
          <a href={GITHUB_REPO}>Contribute</a>
        </p>
      </div>
    </div>
  {/if}
</main>
<Analytics />
<svelte:head>
  <title>{SITE_TITLE}</title>
  <meta name="description" content={SITE_DESCRIPTION} />
  {#if !dev}
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-Q1KNZ1DXGT");
    </script>
  {/if}
</svelte:head>

<style>
  .header {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    font-weight: semibold;
  }
  .header a {
    text-decoration: none;
    color: inherit;
  }
  .preview-link {
    margin-left: auto;
    display: flex;
    gap: 0.5rem;
    color: white;
  }
  .copy-btn {
    color: white;
  }
  .zen-btn {
    background-color: #272727;
    border-color: #272727;
    color: white;
  }

  .zen-btn:hover {
    background-color: #181818;
    border-color: #181818;
  }

  .download-btn {
    background-color: var(--brand-color);
    border-color: var(--brand-color);
    color: white;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .download-btn:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }

  .header-title {
    font-size: 1.5em;
    text-transform: capitalize;
    margin: 0;
  }

  .markdown-editor {
    width: 100%;
    transition: height 0.3s ease-in-out;
  }
  .left-panel,
  .right-panel {
    border: solid 1px rgb(84, 84, 84);
    height: 80vh; /* Reduced height to account for tabs */
    background: #ffffff;
    overflow: hidden;
    transition:
      height 0.3s ease-in-out,
      border 0.3s ease-in-out;
  }
  .left-panel {
    position: relative;
  }
  .editor {
    background: #001845;
    height: 100%;
  }

  textarea {
    font-size: 18px;
    padding: 1rem;
    height: 100%;
    overflow-y: auto;
    transition:
      padding 0.3s ease-in-out,
      font-size 0.3s ease-in-out;
  }

  .right-panel {
    font-size: 18px;
    overflow: auto;
  }

  .source {
    border: none;
    width: 100%;
    height: 100%;
    background: #001845;
    color: #61cb04;
  }
  .source:focus {
    outline: none;
  }
  .output {
    width: 100%;
  }
  .output-content {
    padding: 1rem;
  }

  .link {
    margin: 1rem;
    transition:
      opacity 0.3s ease-in-out,
      transform 0.3s ease-in-out;
  }
  .link h2 {
    margin-bottom: 0;
  }
  .link div {
    display: flex;
    place-items: center;
  }
  .link div button {
    height: fit-content;
    margin-left: auto;
  }
  .output {
    position: relative;
  }
  .count {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 0 0.25rem;
    font-size: small;
    color: rgba(255, 255, 255, 0.6);
    background-color: rgba(0, 0, 0, 0.5);
  }

  /* Zen Mode Styles */
  .container {
    transition: height 0.3s ease-in-out;
  }

  .zen-mode {
    height: 100vh;
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    font-weight: semibold;
  }

  .zen-header {
    position: absolute;
    top: 0rem;
    right: 0rem;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-10px);
    transition:
      opacity 0.3s ease-in-out,
      transform 0.3s ease-in-out;
  }

  .zen-mode .zen-header {
    opacity: 1;
    transform: translateY(0);
  }

  .zen-editor {
    height: calc(100vh - 60px); /* Account for tabs height */
    margin-top: 0;
    transition: height 0.3s ease-in-out;
  }

  .zen-editor .left-panel {
    height: 100vh;
    border: none;
    transition:
      height 0.3s ease-in-out,
      border 0.3s ease-in-out;
  }

  .zen-editor .editor {
    background: #001845;
    height: 100%;
    transition: background-color 0.3s ease-in-out;
  }

  .zen-editor textarea {
    padding: 2rem;
    font-size: 18px;
    line-height: 1.6;
    transition:
      padding 0.3s ease-in-out,
      font-size 0.3s ease-in-out;
  }

  @media screen and (max-width: 600px) {
    .header {
      display: block;
      margin-bottom: 1rem;
    }
    .markdown-editor {
      grid-template-columns: 1fr;
    }

    .right-panel {
      display: none;
    }

    .zen-header {
      top: unset;
      bottom: 0;
    }

    .zen-editor textarea {
      padding: 1rem;
      font-size: 16px;
    }
  }
</style>
