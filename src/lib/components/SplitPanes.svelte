<script>
  export let leftInitialSize = "50%";

  let left;
  let isDragging = false;

  function dragstart() {
    isDragging = true;
  }

  function drag(e) {
    if (!isDragging) return;

    const elementLeft = left.getBoundingClientRect().left;
    left.style.flexBasis = e.clientX - elementLeft + "px";
  }

  function dragend() {
    if (!isDragging) return;

    isDragging = false;
  }
</script>

<div class="split-pane" on:mousemove={drag} on:mouseup={dragend}>
  <div bind:this={left} class="left" style="flex-basis: {leftInitialSize}">
    <slot name="left" />
  </div>
  <div class="splitter" on:mousedown={dragstart} role="separator" />
  <div class="right">
    <slot name="right" />
  </div>
</div>

<style>
  .splitter {
    flex-grow: 0;
    flex-shrink: 0;
    width: 0px;
    cursor: col-resize;
    border-right: 4px dashed #001845;
  }

  .split-pane {
    display: flex;
    align-items: stretch;
    width: 100%;
    max-width: 100%;
  }

  .split-pane > div {
    display: block;
  }

  .left {
    flex-grow: 0;
    flex-shrink: 0;
  }

  .right {
    flex-grow: 1;
    flex-shrink: 1;
    overflow-x: auto;
  }
  @media screen and (max-width: 600px) {
    .split-pane {
      display: block;
    }
  }
</style>
