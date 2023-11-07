<script>
  import { SITE_DESCRIPTION, SITE_SHORT_TITLE } from "$lib/constants";
</script>

<div class="preview">
  <h1>What is this link?</h1>
  <p>something is wrong! Please check the URL again.</p>
  <div class="home">
    <a href="/"> Back </a>
  </div>
</div>

<svelte:head>
  <title>{SITE_SHORT_TITLE} | Error</title>
  <meta name="description" content={SITE_DESCRIPTION} />
</svelte:head>
