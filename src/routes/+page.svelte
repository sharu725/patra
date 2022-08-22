<script>
  import { encode } from "js-base64";
  // import marked from "marked";
  import { onMount } from "svelte";

  let MarkedComponent;
  let pageLoaded = false;
  onMount(async () => {
    MarkedComponent = await import("marked");
    pageLoaded = true;
  });

  let source = `
# H1 heading

## H2 heading

### H3 heading

--------

**bold text**

*italicized text*

--------

1. First item
2. Second item
3. Third item

- First item
- Second item
- Third item
`;

  let markdown = source;
  $: if (pageLoaded) markdown = MarkedComponent.marked(source);
  $: data = encode(markdown);
</script>

<main class="container">
  <header class="header">
    <h1 class="header-title">Markdown editor</h1>
  </header>

  <div class="markdown-editor">
    <div class="left-panel">
      <div class="editor">
        <textarea bind:value={source} class="source" />
      </div>
    </div>

    <div class="right-panel">
      <div class="output">{@html markdown}</div>
    </div>
  </div>
</main>

<h1>Your content link</h1>
<pre><code>{`/note/${data}`}</code></pre>
<a href="/note/{data}">Go here</a>

<style>
  .container {
    background: #ff3e00d6;
  }
  .header {
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .header-title {
    margin: 0;
    color: #fff;
  }
  .markdown-editor {
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: space-evenly;
  }
  .left-panel,
  .right-panel {
    width: 50%;
    border: solid 1px black;
    height: 85vh;
    background: #ffffff;
  }
  .editor {
    padding: 0 1rem;
    height: 100%;
    background: #001628;
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
    padding: 0 2em;
  }
  pre {
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
