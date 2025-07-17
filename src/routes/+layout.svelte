<script>
  import { navigating } from "$app/state";
  import { SITE_PREVIEW } from "$lib/constants";
  import { fly } from "svelte/transition";
  import "$lib/css/style.css";

  let { children } = $props();
</script>

{#key navigating.to}
  <div in:fly={{ delay: 100, duration: 500, x: 30 }}>
    {#if !navigating.to}
      {@render children?.()}
    {/if}
  </div>
{/key}

<svelte:head>
  <meta property="og:image" content={SITE_PREVIEW} />
</svelte:head>
