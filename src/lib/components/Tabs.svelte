<script lang="ts">
  import { tabs_data, tabHelpers, activeTabId } from "$lib/tabs_store.svelte";

  let editingTabId = $state<string | null>(null);
  let tempTitle = $state("");

  const handleAddTab = () => {
    tabHelpers.addNewTab();
  };

  const handleRemoveTab = (tabId: string) => {
    tabHelpers.removeTab(tabId);
  };

  const handleTabClick = (tabId: string) => {
    tabHelpers.setActiveTab(tabId);
  };

  const startEditingTitle = (tabId: string, currentTitle: string) => {
    editingTabId = tabId;
    tempTitle = currentTitle;
  };

  const saveTitle = () => {
    if (editingTabId && tempTitle.trim()) {
      tabHelpers.updateTabTitle(editingTabId, tempTitle.trim());
    }
    editingTabId = null;
    tempTitle = "";
  };

  const cancelEditing = () => {
    editingTabId = null;
    tempTitle = "";
  };

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      saveTitle();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };
</script>

<div class="tabs-container">
  <div class="tabs-header">
    {#each tabs_data.current as tab (tab.id)}
      <div class="tab" class:active={tab.id === activeTabId.current}>
        {#if editingTabId === tab.id}
          <input
            bind:value={tempTitle}
            onkeydown={handleKeydown}
            onblur={saveTitle}
            class="tab-title-input"
          />
        {:else}
          <button
            class="tab-title"
            onclick={() => handleTabClick(tab.id)}
            ondblclick={() => startEditingTitle(tab.id, tab.title)}
          >
            {tab.title}
          </button>
        {/if}

        {#if tabs_data.current.length > 1}
          <button
            class="tab-close"
            onclick={() => handleRemoveTab(tab.id)}
            title="Close tab"
          >
            ×
          </button>
        {/if}
      </div>
    {/each}

    <button class="add-tab-btn" onclick={handleAddTab} title="Add new tab">
      +
    </button>
  </div>
</div>

<style>
  .tabs-header {
    display: flex;
    align-items: center;
    background: #f5f5f5;
    padding: 0;
    overflow-x: auto;
    scroll-behavior: smooth;
    transition: background-color 0.3s ease-in-out;
  }

  .tab {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    min-width: 60px;
    max-width: 120px;
    padding: 4px 2px;
    border-right: 1px solid #ddd;
    background: #e0e0e0;
    cursor: pointer;
    user-select: none;
    position: relative;
    transition:
      background-color 0.2s ease-in-out,
      color 0.2s ease-in-out;
  }

  .tab.active {
    background: var(--brand-color);
    color: white;
  }

  .tab.active .tab-title {
    color: white;
  }

  .tab:hover:not(.active) {
    background: #d0d0d0;
  }

  .tab-title {
    flex: 1;
    padding: 2px 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: center;
    color: inherit;
  }

  .tab-title-input {
    flex: 1;
    padding: 2px 4px;
    border: 1px solid var(--brand-color);
    border-radius: 2px;
    font-size: 12px;
    outline: none;
    text-align: center;
  }

  .tab-close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    color: #666;
    padding: 1px 3px;
    margin-left: 2px;
    border-radius: 2px;
    line-height: 1;
  }

  .tab-close:hover {
    background: #5f5f5f;
    color: white;
  }

  .tab.active .tab-close {
    color: white;
  }

  .add-tab-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    color: var(--brand-color);
    padding: 4px 8px;
    margin: 0 2px;
    border-radius: 2px;
    min-width: auto;
  }

  .add-tab-btn:hover {
    background: #e0e0e0;
  }

  /* Mobile responsive */
  @media screen and (max-width: 600px) {
    .tabs-header {
      padding: 0;
    }

    .tab {
      min-width: 50px;
      max-width: 100px;
    }

    .tab-title {
      font-size: 11px;
    }
  }
</style>
