<script>
  import createIndexedDBStore from "$lib/indexeddb_store.svelte";

  // Usage Examples - ANY DATA TYPE (No unnecessary IDs):

  // 1. Objects with natural ID
  let friend = createIndexedDBStore(
    "test-database",
    "friends",
    {
      id: 3,
      name: "sharath",
      age: 12,
      hobbies: ["coding", "reading"],
      metadata: { created: new Date(), tags: ["friend", "close"] },
    },
    "id"
  ); // Specify which field is the primary key
  let message = createIndexedDBStore("app", "currentMessage", "Hello World!");
  let counter = createIndexedDBStore("app", "clickCount", 0);
  let todoList = createIndexedDBStore("app", "todos", [
    "Buy milk",
    "Walk dog",
    "Code app",
  ]);
  $inspect(message);
  $inspect(counter);
  $inspect(todoList);
  // 2. Strings (no ID needed!)
  /*
  let message = createIndexedDBStore("app", "currentMessage", "Hello World!");
  // Usage: message.current = "New message"; (auto-saves)
  */

  // 3. Numbers (no ID needed!)
  /*
  let counter = createIndexedDBStore("app", "clickCount", 0);
  // Usage: counter.current++; (auto-saves)
  */

  // 4. Arrays (no ID needed!)
  /*
  let todoList = createIndexedDBStore("app", "todos", ["Buy milk", "Walk dog", "Code app"]);
  // Usage: todoList.current.push("New todo"); (auto-saves)
  */

  // 5. Booleans (no ID needed!)
  /*
  let isLoggedIn = createIndexedDBStore("app", "loginStatus", false);
  // Usage: isLoggedIn.current = true;
  */

  // 6. Objects with custom primary key
  /*
  let user = createIndexedDBStore("app", "users", {
    email: "test@example.com", // This becomes the primary key
    name: "John",
    preferences: { theme: "dark", language: "en" }
  }, "email");
  */ // Helper functions for the form
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
