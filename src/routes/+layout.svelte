<script>
  import { navigating } from "$app/stores";
  import { fly } from "svelte/transition";

  $: urlChanged = $navigating?.from.pathname === $navigating?.to.pathname;
</script>

{#key urlChanged}
  <div in:fly={{ delay: 100, duration: 500, x: -30 }}>
    <slot />
  </div>
{/key}
