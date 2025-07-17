<script>
  import { navigating } from "$app/stores";
  import { SITE_PREVIEW } from "$lib/constants";
  import { fly } from "svelte/transition";
  import "$lib/css/style.css";
</script>

{#key $navigating}
  <div in:fly={{ delay: 100, duration: 500, x: -30 }}>
    {#if !$navigating}
      <slot />
    {/if}
  </div>
{/key}

<svelte:head>
  <meta property="og:image" content={SITE_PREVIEW} />
</svelte:head>
