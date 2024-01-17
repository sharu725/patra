<script>
  import LZString from "$lib/lz";
  import { page } from "$app/stores";
  import SvelteMarkdown from "svelte-markdown";
  import SplitPane from "$lib/components/SplitPanes.svelte";
  import { patraData, siteTitle } from "$lib/store";
  import { dev } from "$app/environment";
  import { GITHUB_REPO, SITE_DESCRIPTION, SITE_TITLE } from "$lib/constants";

  $: source = LZString.compressToEncodedURIComponent($patraData);
  $: finalLink = `${$page.url.origin}/note/${source}`;
  const copyText = () => navigator.clipboard.writeText(finalLink);
</script>

<main class="container">
  <header class="header">
    <a href="/">
      <h1 class="header-title">{siteTitle}</h1>
    </a>
    {#if source}
      <div class="preview-link">
        <a data-sveltekit-preload-data href={finalLink}>
          <button>Preview</button>
        </a>
      </div>
    {/if}
  </header>
  <div class="markdown-editor">
    <SplitPane>
      <svelte:fragment slot="left">
        <div class="left-panel">
          <div class="editor">
            <textarea bind:value={$patraData} class="source" />
          </div>
        </div>
      </svelte:fragment>
      <svelte:fragment slot="right">
        <div class="right-panel">
          <div class="output">
            <div class="output-content">
              {#key $patraData}
                <SvelteMarkdown source={$patraData} />
              {/key}
            </div>
          </div>
        </div>
      </svelte:fragment>
    </SplitPane>
  </div>
  <div class="link">
    <div>
      <h2>Your {siteTitle} link</h2>
      <button on:click={copyText}>Copy</button>
    </div>
    <pre><code>{`${finalLink}`}</code></pre>

    <div>
      <p>
        <a href={GITHUB_REPO}>Contribute</a>
      </p>
    </div>
  </div>
</main>
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
  }
  .header-title {
    text-transform: capitalize;
    margin: 0;
  }
  .markdown-editor {
    width: 100%;
  }
  .left-panel,
  .right-panel {
    border: solid 1px rgb(84, 84, 84);
    height: 85vh;
    background: #ffffff;
    overflow: hidden;
  }
  .editor {
    background: #001845;
    height: 100%;
    padding: 0 0 0 1rem;
  }

  textarea {
    padding: 1rem 0;
    height: 100%;
    overflow-y: auto;
  }

  .right-panel {
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

  button {
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    background-color: #83ba52;
    border: 1px solid #83ba52;
    border-radius: 2px;
  }

  button:hover {
    color: #111;
    background-color: var(--brand-color);
  }

  .link {
    margin: 1rem;
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

  @media screen and (max-width: 600px) {
    .markdown-editor {
      grid-template-columns: 1fr;
    }
    .left-panel,
    .right-panel {
      height: 45vh;
    }
  }
</style>
