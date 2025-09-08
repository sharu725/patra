import { LocalStorage } from "./local_store.svelte";
import { defaultValue } from "./stores.svelte.js";

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

// Structure for tabs data
export interface TabsData {
  tabs: Tab[];
  activeTabId: string;
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

const defaultTabsData: TabsData = {
  tabs: [createInitialTab()],
  activeTabId: "tab-1",
};

export const tabs_data = new LocalStorage("patra_tabs_data", defaultTabsData);

// Helper functions to manage tabs
export const tabHelpers = {
  addNewTab: () => {
    const currentData = tabs_data.current;
    const newTabId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newTabId,
      title: `Tab ${currentData.tabs.length + 1}`,
      content: defaultTabContent,
      createdAt: Date.now(),
      hasUnsavedChanges: false,
      originalContent: defaultTabContent,
    };

    tabs_data.current = {
      ...currentData,
      tabs: [...currentData.tabs, newTab],
      activeTabId: newTabId,
    };
  },

  removeTab: (tabId: string) => {
    const currentData = tabs_data.current;
    if (currentData.tabs.length <= 1) return; // Don't remove the last tab

    // Check if tab has unsaved changes
    const tabToRemove = currentData.tabs.find((tab: Tab) => tab.id === tabId);
    if (tabToRemove?.hasUnsavedChanges) {
      const confirmClose = confirm(
        `Tab "${tabToRemove.title}" has unsaved changes. Are you sure you want to close it?`
      );
      if (!confirmClose) return;
    }

    const remainingTabs = currentData.tabs.filter(
      (tab: Tab) => tab.id !== tabId
    );
    let newActiveTabId = currentData.activeTabId;

    // If we're removing the active tab, switch to another tab
    if (tabId === currentData.activeTabId) {
      newActiveTabId = remainingTabs[0].id;
    }

    tabs_data.current = {
      tabs: remainingTabs,
      activeTabId: newActiveTabId,
    };
  },

  setActiveTab: (tabId: string) => {
    const currentData = tabs_data.current;
    tabs_data.current = {
      ...currentData,
      activeTabId: tabId,
    };
  },

  updateTabContent: (tabId: string, content: string) => {
    const currentData = tabs_data.current;
    const updatedTabs = currentData.tabs.map((tab: Tab) => {
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

    tabs_data.current = {
      ...currentData,
      tabs: updatedTabs,
    };
  },

  updateTabTitle: (tabId: string, title: string) => {
    const currentData = tabs_data.current;
    const updatedTabs = currentData.tabs.map((tab: Tab) =>
      tab.id === tabId ? { ...tab, title } : tab
    );

    tabs_data.current = {
      ...currentData,
      tabs: updatedTabs,
    };
  },

  getActiveTab: () => {
    const currentData = tabs_data.current;
    return (
      currentData.tabs.find((tab: Tab) => tab.id === currentData.activeTabId) ||
      currentData.tabs[0]
    );
  },

  markTabAsSaved: (tabId: string) => {
    const currentData = tabs_data.current;
    const updatedTabs = currentData.tabs.map((tab: Tab) => {
      if (tab.id === tabId) {
        return {
          ...tab,
          hasUnsavedChanges: false,
          originalContent: tab.content,
        };
      }
      return tab;
    });

    tabs_data.current = {
      ...currentData,
      tabs: updatedTabs,
    };
  },
};
