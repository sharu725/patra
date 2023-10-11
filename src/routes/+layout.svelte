<script>
  import { navigating } from "$app/stores";
  import { fly } from "svelte/transition";
</script>

{#key $navigating}
  <div in:fly={{ delay: 100, duration: 500, x: -30 }}>
    {#if !$navigating}
      <slot />
    {/if}
  </div>
{/key}
