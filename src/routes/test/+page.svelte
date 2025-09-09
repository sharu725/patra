<script>
  import Dexie from "dexie";
  import { onMount } from "svelte";

  // Create a reactive IndexedDB store
  function createIndexedDBStore(dbName, storeName, initialValue) {
    // Initialize the database
    const db = new Dexie(dbName);
    db.version(1).stores({
      [storeName]: "++id, name, age",
    });

    // Create reactive state
    let value = $state(initialValue);
    let isInitialized = $state(false);

    // Initialize and load from DB
    async function initialize() {
      try {
        await db.open();

        // Try to load existing data
        const existing = await db[storeName].get(initialValue.id);
        if (existing) {
          value = existing;
        } else {
          // Save initial value to DB if not exists - use snapshot for plain object
          await db[storeName].put($state.snapshot(initialValue));
        }

        isInitialized = true;
      } catch (error) {
        console.error("Failed to initialize IndexedDB:", error);
        isInitialized = true; // Still mark as initialized to prevent hanging
      }
    }

    // Save to IndexedDB whenever value changes
    $effect(() => {
      if (isInitialized && value) {
        // Debounce writes to avoid too frequent DB operations
        const timeoutId = setTimeout(async () => {
          try {
            // Use snapshot to get plain object without proxy
            const snapshot = $state.snapshot(value);
            await db[storeName].put(snapshot);
            console.log("Synced to IndexedDB:", snapshot);
          } catch (error) {
            console.error("Failed to sync to IndexedDB:", error);
          }
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    });

    return {
      get current() {
        return value;
      },
      set current(newValue) {
        value = newValue;
      },
      get isInitialized() {
        return isInitialized;
      },
      initialize,
      db,
      // Utility methods
      async reload() {
        const fresh = await db[storeName].get(value.id);
        if (fresh) value = fresh;
      },
      async delete() {
        await db[storeName].delete(value.id);
      },
    };
  }

  // Usage
  let friend = createIndexedDBStore("test-database", "friends", {
    id: 3,
    name: "sharath",
    age: 12,
  });

  // Initialize on mount
  onMount(() => {
    friend.initialize();
  });

  // Helper functions for the form
  let newName = $state("");
  let newAge = $state(21);
  let status = $state("");

  function updateFriend() {
    friend.current = {
      ...friend.current,
      name: newName || friend.current.name,
      age: newAge || friend.current.age,
    };
    status = `Friend updated to: ${friend.current.name}, age ${friend.current.age}`;
  }

  async function deleteFriend() {
    await friend.delete();
    status = "Friend deleted from database";
  }

  async function reloadFriend() {
    await friend.reload();
    status = "Friend data reloaded from database";
  }

  $inspect(friend.current);
</script>

{#if !friend.isInitialized}
  <p>Loading...</p>
{:else}
  <div>
    <h2>Current Friend Data:</h2>
    <p><strong>ID:</strong> {friend.current.id}</p>
    <p><strong>Name:</strong> {friend.current.name}</p>
    <p><strong>Age:</strong> {friend.current.age}</p>

    <p><em>Status: {status}</em></p>

    <fieldset>
      <legend>Update Friend</legend>
      <label>
        Name:
        <input
          type="text"
          bind:value={newName}
          placeholder={friend.current.name}
        />
      </label>
      <br />
      <label>
        Age:
        <input
          type="number"
          bind:value={newAge}
          placeholder={friend.current.age}
        />
      </label>
      <br />
      <button onclick={updateFriend}>Update Friend</button>
      <button onclick={reloadFriend}>Reload from DB</button>
      <button onclick={deleteFriend}>Delete Friend</button>
    </fieldset>

    <div>
      <h3>Live Updates</h3>
      <p>Change values directly:</p>
      <label>
        Name:
        <input type="text" bind:value={friend.current.name} />
      </label>
      <label>
        Age:
        <input type="number" bind:value={friend.current.age} />
      </label>
      <p><small>Changes are automatically saved to IndexedDB!</small></p>
    </div>
  </div>
{/if}
