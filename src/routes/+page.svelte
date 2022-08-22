<script>
  import { encode } from "js-base64";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { patraData } from "$lib/store";
  let MarkedComponent;

  let pageLoaded = false;

  onMount(async () => {
    MarkedComponent = await import("marked");
    pageLoaded = true;
  });

  let markdown = "";
  $: if (pageLoaded) markdown = MarkedComponent.marked($patraData);
  $: data = encode(markdown);

  $: finalLink = `${$page.url.origin}/note/${data}`;
</script>

<main class="container">
  <header class="header">
    <h1 class="header-title">Patra</h1>
    <div class="preview">
      <a href={finalLink} target="_blank">
        <button>Preview</button>
      </a>
    </div>
  </header>

  <div class="markdown-editor">
    <div class="left-panel">
      <div class="editor">
        <textarea bind:value={$patraData} class="source" />
      </div>
    </div>

    <div class="right-panel">
      <div class="output">
        <div class="output-content">
          {@html markdown}
        </div>
      </div>
    </div>
  </div>
</main>
<div class="link">
  <h4>Your patra link</h4>
  <pre><code>{`${finalLink}`}</code></pre>
</div>

<style>
  .header {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    font-weight: semibold;
  }
  .preview {
    margin-left: auto;
  }
  .header-title {
    margin: 0;
  }
  .markdown-editor {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: flex-start;
    justify-content: space-evenly;
  }
  .left-panel,
  .right-panel {
    /* width: 50%; */
    border: solid 1px black;
    height: 85vh;
    background: #ffffff;
    overflow: hidden;
  }
  .editor {
    background: #001628;
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
    background: #001628;
    color: #83ba52;
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
  pre {
    padding: 1rem;
    white-space: pre-wrap;
    word-break: break-all;
    background-color: rgb(200, 249, 168);
    border-radius: 0.25rem;
    border: 1px dashed green;
  }
  button {
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    background-color: #83ba52;
    border: 1px dashed #67993b;
  }
  button:hover {
    background-color: #67993b;
  }
  .link {
    margin-top: 2rem;
  }
  .link h4 {
    margin-bottom: 0;
  }

  @media screen and (max-width: 600px) {
    .markdown-editor {
      grid-template-columns: 1fr;
    }
    .left-panel,
    .right-panel {
      height: 35vh;
    }
  }
</style>
