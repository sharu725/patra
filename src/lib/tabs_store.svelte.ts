import { LocalStorage } from "./local_store.svelte";
import { defaultValue } from "./stores.svelte.js";
import createIndexedDBStore from "$lib/indexeddb_store.svelte";

export const defaultTabContent = `## New Tab
Start writing your markdown here...

- Add your content
- Preview will update automatically
- Share the generated link when ready!
`;

// Structure for a single tab
export interface Tab {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  hasUnsavedChanges?: boolean;
  originalContent?: string;
}

// Create initial tab
const createInitialTab = (): Tab => ({
  id: "tab-1",
  title: "Tab 1",
  content: defaultValue,
  createdAt: Date.now(),
  hasUnsavedChanges: false,
  originalContent: defaultValue,
});

const defaultTabs: Tab[] = [createInitialTab()];

// Store only tabs array in IndexedDB - activeTab will not persist
export const tabs_data = createIndexedDBStore(
  "patra_db",
  "patra_tabs",
  defaultTabs
);

// Separate reactive state for activeTab that doesn't persist
// Always defaults to tab-1 on reload
let _activeTabId = $state("tab-1");

export const activeTabId = {
  get current() {
    return _activeTabId;
  },
  set current(value: string) {
    _activeTabId = value;
  },
};

// Helper functions to manage tabs
export const tabHelpers = {
  addNewTab: () => {
    const currentTabs = tabs_data.current;
    const newTabId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newTabId,
      title: `Tab ${currentTabs.length + 1}`,
      content: defaultTabContent,
      createdAt: Date.now(),
      hasUnsavedChanges: false,
      originalContent: defaultTabContent,
    };

    tabs_data.current = [...currentTabs, newTab];
    activeTabId.current = newTabId;
  },

  removeTab: (tabId: string) => {
    const currentTabs = tabs_data.current;
    if (currentTabs.length <= 1) return; // Don't remove the last tab

    // Check if tab has unsaved changes
    const tabToRemove = currentTabs.find((tab: Tab) => tab.id === tabId);
    if (tabToRemove?.hasUnsavedChanges) {
      const confirmClose = confirm(
        `Tab "${tabToRemove.title}" has unsaved changes. Are you sure you want to close it?`
      );
      if (!confirmClose) return;
    }

    const remainingTabs = currentTabs.filter((tab: Tab) => tab.id !== tabId);

    // If we're removing the active tab, switch to the first tab
    if (tabId === activeTabId.current) {
      activeTabId.current = remainingTabs[0].id;
    }

    tabs_data.current = remainingTabs;
  },

  setActiveTab: (tabId: string) => {
    activeTabId.current = tabId;
  },

  updateTabContent: (tabId: string, content: string) => {
    const currentTabs = tabs_data.current;
    const updatedTabs = currentTabs.map((tab: Tab) => {
      if (tab.id === tabId) {
        const hasUnsavedChanges =
          content !== (tab.originalContent || tab.content);
        return {
          ...tab,
          content,
          hasUnsavedChanges,
        };
      }
      return tab;
    });

    tabs_data.current = updatedTabs;
  },

  updateTabTitle: (tabId: string, title: string) => {
    const currentTabs = tabs_data.current;
    const updatedTabs = currentTabs.map((tab: Tab) =>
      tab.id === tabId ? { ...tab, title } : tab
    );

    tabs_data.current = updatedTabs;
  },

  getActiveTab: () => {
    const currentTabs = tabs_data.current;
    return (
      currentTabs.find((tab: Tab) => tab.id === activeTabId.current) ||
      currentTabs.find((tab: Tab) => tab.id === "tab-1") ||
      currentTabs[0]
    );
  },

  markTabAsSaved: (tabId: string) => {
    const currentTabs = tabs_data.current;
    const updatedTabs = currentTabs.map((tab: Tab) => {
      if (tab.id === tabId) {
        return {
          ...tab,
          hasUnsavedChanges: false,
          originalContent: tab.content,
        };
      }
      return tab;
    });

    tabs_data.current = updatedTabs;
  },
};
