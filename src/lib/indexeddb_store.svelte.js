import Dexie from "dexie";

// Create a reactive IndexedDB store for ANY data type
function createIndexedDBStore(
  dbName,
  storeName,
  initialValue,
  primaryKey = null
) {
  // Determine storage strategy
  const isObjectWithKey =
    typeof initialValue === "object" &&
    initialValue !== null &&
    !Array.isArray(initialValue) &&
    primaryKey &&
    initialValue[primaryKey] !== undefined;

  // Initialize the database
  const db = new Dexie(dbName);
  if (isObjectWithKey) {
    // Use specified primary key for objects that have it
    db.version(1).stores({
      [storeName]: primaryKey,
    });
  } else {
    // Use auto-increment ID for single-value storage
    db.version(1).stores({
      [storeName]: "++id",
    });
  }

  // Create reactive state
  let value = $state(initialValue);
  let isInitialized = $state(false);

  // Initialize and load from DB immediately
  async function initialize() {
    try {
      await db.open();

      // Try to load existing data
      let existing;
      if (isObjectWithKey) {
        // Get by actual primary key value
        const pkValue = initialValue[primaryKey];
        existing = await db[storeName].get(pkValue);
      } else {
        // For single-value storage, get the first (and should be only) record
        const allRecords = await db[storeName].toArray();
        existing = allRecords.length > 0 ? allRecords[0] : null;
      }

      if (existing) {
        if (isObjectWithKey) {
          value = existing; // Direct object
        } else {
          value = existing.value; // Extract value from wrapper
        }
      } else {
        // Save initial value to DB if not exists
        let dataToStore;
        if (isObjectWithKey) {
          dataToStore = $state.snapshot(initialValue);
        } else {
          dataToStore = { value: $state.snapshot(initialValue) };
        }
        await db[storeName].put(dataToStore);
      }

      isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize IndexedDB:", error);
      isInitialized = true; // Still mark as initialized to prevent hanging
    }
  }

  // Start initialization immediately
  initialize();
  $effect.root(() => {
    // Save to IndexedDB whenever value changes
    $effect(() => {
      if (isInitialized && value !== undefined) {
        // Debounce writes to avoid too frequent DB operations
        const timeoutId = setTimeout(async () => {
          try {
            // Use snapshot to get plain object without proxy
            const snapshot = $state.snapshot(value);

            // Prepare data for storage based on type
            let dataToStore;
            if (isObjectWithKey) {
              // Direct object storage
              dataToStore = snapshot;
            } else {
              // For primitives/arrays, we need to update the existing record
              // Get the current record to preserve the auto-generated ID
              const allRecords = await db[storeName].toArray();
              if (allRecords.length > 0) {
                dataToStore = { ...allRecords[0], value: snapshot };
              } else {
                dataToStore = { value: snapshot };
              }
            }

            await db[storeName].put(dataToStore);
            console.log("Synced to IndexedDB:", dataToStore);
          } catch (error) {
            console.error("Failed to sync to IndexedDB:", error);
          }
        }, 100);

        return () => clearTimeout(timeoutId);
      }
    });
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
    initialize, // Keep for manual refresh if needed
    db,
    // Utility methods
    async reload() {
      let fresh;
      if (isObjectWithKey) {
        const pkValue = value[primaryKey];
        fresh = await db[storeName].get(pkValue);
        if (fresh) value = fresh;
      } else {
        fresh = await db[storeName].get("data");
        if (fresh) value = fresh.value;
      }
    },
    async delete() {
      if (isObjectWithKey) {
        const pkValue = value[primaryKey];
        await db[storeName].delete(pkValue);
      } else {
        await db[storeName].delete("data");
      }
    },
  };
}

export default createIndexedDBStore;
