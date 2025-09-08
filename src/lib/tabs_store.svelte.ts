import { LocalStorage } from "./local_store.svelte";

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
  content: `## Patra | Share your notes!
You can share short notes with just a link. No database. No storage!

- write short articles in **markdown** and share the link!
- write around **100,000 characters** which is roughly **15k words**.
- content stored locally. Page **refresh will not lose progress**!
- works **offline** too!
- create **tables** as well!


|Header 1 |Header 2  | Header 3|
|-------- | -------- | --------|
| data 1  | data 2   |  data 3 |
| data 11 | data 12  |  data 13|

- embed maps


<iframe style="border:0; display:block; width:100%" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2664.642326877131!2d76.59443713513481!3d12.366147804839871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1712681027838!5m2!1sen!2sin" height="450"  allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

- check the link generated at the bottom.

### Features
- markdown support
- light-weight
- SSR by default

### Use this as a Todo list app

- ~do a thing~
- do another thing

\`\`\`html
<p>Highlight code blocks</p>
\`\`\`

The note will remain until overwritten.`,
  createdAt: Date.now(),
  hasUnsavedChanges: false,
  originalContent: `## Patra | Share your notes!
You can share short notes with just a link. No database. No storage!

- write short articles in **markdown** and share the link!
- write around **100,000 characters** which is roughly **15k words**.
- content stored locally. Page **refresh will not lose progress**!
- works **offline** too!
- create **tables** as well!


|Header 1 |Header 2  | Header 3|
|-------- | -------- | --------|
| data 1  | data 2   |  data 3 |
| data 11 | data 12  |  data 13|

- embed maps


<iframe style="border:0; display:block; width:100%" src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2664.642326877131!2d76.59443713513481!3d12.366147804839871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1712681027838!5m2!1sen!2sin" height="450"  allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

- check the link generated at the bottom.

### Features
- markdown support
- light-weight
- SSR by default

### Use this as a Todo list app

- ~do a thing~
- do another thing

\`\`\`html
<p>Highlight code blocks</p>
\`\`\`

The note will remain until overwritten.`,
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
      const confirmClose = confirm(`Tab "${tabToRemove.title}" has unsaved changes. Are you sure you want to close it?`);
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
        const hasUnsavedChanges = content !== (tab.originalContent || tab.content);
        return { 
          ...tab, 
          content,
          hasUnsavedChanges
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
};
