# Browser Storage Adapter Pattern

## Overview

The Browser Storage Adapter pattern provides a consistent, maintainable interface for all browser storage operations in the Blumelein App. This follows the same design pattern as the existing `serverApiAdapter.js`.

## Why Use an Adapter?

### Problems with Direct localStorage Usage

Before implementing the adapter pattern, the `BasketContext.jsx` directly called `localStorage`:

```javascript
// ❌ Old approach - scattered, hard to maintain
const savedItems = localStorage.getItem('basket');
const items = savedItems ? JSON.parse(savedItems) : [];

localStorage.setItem('basket', JSON.stringify(items));

localStorage.removeItem('basket');
```

**Issues:**
- ❌ Storage logic scattered across the codebase
- ❌ No error handling for storage quota limits
- ❌ No error handling for JSON parsing failures
- ❌ Hard to test (requires mocking `localStorage`)
- ❌ Hard to switch storage mechanisms (e.g., to IndexedDB)
- ❌ Repetitive JSON stringify/parse code

### Benefits of Storage Adapter

```javascript
// ✅ New approach - clean, maintainable
const items = browserStorageAdapter.get('basket', []);

browserStorageAdapter.set('basket', items);

browserStorageAdapter.remove('basket');
```

**Advantages:**
- ✅ Centralized storage logic in one place
- ✅ Built-in error handling
- ✅ Automatic JSON serialization/deserialization
- ✅ Easy to test (mock the adapter)
- ✅ Easy to switch implementations
- ✅ Consistent with API adapter pattern
- ✅ Type-safe with default values
- ✅ Handles edge cases (quota exceeded, invalid JSON)

## Implementation

### Browser Storage Adapter (`src/adapters/browserStorageAdapter.js`)

```javascript
class BrowserStorageAdapter {
  constructor(storageType = 'localStorage') {
    this.storage = storageType === 'sessionStorage' 
      ? sessionStorage 
      : localStorage;
  }

  // Get with default value
  get(key, defaultValue = null) {
    try {
      const item = this.storage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return defaultValue;
    }
  }

  // Set with automatic JSON stringification
  set(key, value) {
    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing ${key}:`, error);
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded');
      }
      return false;
    }
  }

  // Remove item
  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  }

  // Additional utility methods
  has(key) { ... }
  clear() { ... }
  keys() { ... }
  size() { ... }
}

// Export as singleton
export default new BrowserStorageAdapter('localStorage');
```

### Usage in BasketContext

**Before:**
```javascript
// ❌ Direct localStorage usage
const [items, setItems] = useState(() => {
  const savedItems = localStorage.getItem('basket');
  return savedItems ? JSON.parse(savedItems) : [];
});

useEffect(() => {
  localStorage.setItem('basket', JSON.stringify(items));
}, [items]);

const clearBasket = () => {
  setItems([]);
  localStorage.removeItem('basket');
};
```

**After:**
```javascript
// ✅ Clean adapter usage
import browserStorageAdapter from '../adapters/browserStorageAdapter';

const [items, setItems] = useState(() => {
  return browserStorageAdapter.get('basket', []);
});

useEffect(() => {
  browserStorageAdapter.set('basket', items);
}, [items]);

const clearBasket = () => {
  setItems([]);
  browserStorageAdapter.remove('basket');
};
```

## Available Methods

### `get(key, defaultValue)`
Retrieves and parses data from storage.

```javascript
const basket = browserStorageAdapter.get('basket', []);
const user = browserStorageAdapter.get('user', { name: 'Guest' });
```

### `set(key, value)`
Stores data with automatic JSON stringification.

```javascript
browserStorageAdapter.set('basket', items);
browserStorageAdapter.set('preferences', { theme: 'dark' });
```

### `remove(key)`
Removes an item from storage.

```javascript
browserStorageAdapter.remove('basket');
```

### `has(key)`
Checks if a key exists.

```javascript
if (browserStorageAdapter.has('basket')) {
  // Basket exists
}
```

### `clear()`
Clears all storage.

```javascript
browserStorageAdapter.clear(); // Remove everything
```

### `keys()`
Gets all storage keys.

```javascript
const allKeys = browserStorageAdapter.keys();
// ['basket', 'preferences', 'session']
```

### `size()`
Gets the number of items in storage.

```javascript
const count = browserStorageAdapter.size(); // 3
```

## Error Handling

The adapter handles several error scenarios:

### 1. JSON Parse Errors
```javascript
// If stored data is corrupted
const data = browserStorageAdapter.get('corrupt-data', []);
// Returns default value [] instead of throwing
```

### 2. Storage Quota Exceeded
```javascript
// If storage is full
const success = browserStorageAdapter.set('large-data', hugeObject);
if (!success) {
  // Handle quota exceeded
}
```

### 3. Storage Unavailable
```javascript
// If localStorage is disabled (e.g., private browsing)
const data = browserStorageAdapter.get('key', defaultValue);
// Safely returns defaultValue
```

## Testing

The adapter pattern makes testing much easier:

### Before (Hard to Test)
```javascript
// Need to mock localStorage globally
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
```

### After (Easy to Test)
```javascript
// Just mock the adapter
jest.mock('../adapters/browserStorageAdapter', () => ({
  get: jest.fn(() => []),
  set: jest.fn(() => true),
  remove: jest.fn(() => true),
}));
```

## Extending the Adapter

### Switch to sessionStorage
```javascript
// In browserStorageAdapter.js
export default new BrowserStorageAdapter('sessionStorage');
```

### Add IndexedDB Support
```javascript
class BrowserStorageAdapter {
  constructor(storageType = 'localStorage') {
    if (storageType === 'indexedDB') {
      this.storage = new IndexedDBWrapper();
    } else {
      this.storage = localStorage;
    }
  }
  // Methods remain the same
}
```

### Add Encryption
```javascript
set(key, value) {
  try {
    const encrypted = encrypt(JSON.stringify(value));
    this.storage.setItem(key, encrypted);
    return true;
  } catch (error) {
    console.error(`Error writing ${key}:`, error);
    return false;
  }
}

get(key, defaultValue = null) {
  try {
    const item = this.storage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(decrypt(item));
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return defaultValue;
  }
}
```

## Performance Considerations

### Automatic Serialization
- JSON.stringify/parse is handled internally
- No performance overhead vs manual approach
- Error handling prevents application crashes

### Singleton Pattern
- One instance shared across app
- No memory overhead from multiple instances
- Consistent state management

## Consistency with Architecture

The storage adapter follows the same pattern as the API adapter:

```
Application Layer
    │
    ├── Components/Pages
    │   └── Use context/hooks
    │
    ├── Context (BasketContext)
    │   └── Uses adapters
    │
    └── Adapters (Single source of truth)
        ├── serverApiAdapter.js (Backend API)
        └── browserStorageAdapter.js (Browser Storage)
```

## Migration Checklist

- [x] Created `src/adapters/browserStorageAdapter.js`
- [x] Implemented all storage methods
- [x] Added error handling
- [x] Updated `BasketContext.jsx` to use adapter
- [x] Removed all direct `localStorage` calls
- [x] Updated documentation (ARCHITECTURE.md)
- [x] Updated documentation (QUICK_REFERENCE.md)
- [x] Updated documentation (README.md)
- [x] Verified no linting errors
- [x] Maintained backward compatibility

## Backward Compatibility

The adapter is **100% backward compatible**:
- Still uses localStorage under the hood
- Existing stored data works without migration
- Same data format (JSON strings)
- No breaking changes to the API

## Future Enhancements

Potential improvements:

1. **Compression**: Compress large objects before storage
2. **Encryption**: Encrypt sensitive data
3. **Expiration**: Add TTL (time-to-live) for cached data
4. **Sync**: Sync across tabs/windows
5. **Versioning**: Handle data schema migrations
6. **Metrics**: Track storage usage and performance

## Summary

The Storage Adapter pattern provides a robust, maintainable solution for browser storage:

- ✅ Follows the existing adapter pattern in the codebase
- ✅ Centralizes all storage operations
- ✅ Provides comprehensive error handling
- ✅ Makes code easier to test and maintain
- ✅ Enables easy future enhancements
- ✅ Consistent with best practices

**The basket caching functionality remains exactly the same for users, but the code is now much more maintainable and professional.**

