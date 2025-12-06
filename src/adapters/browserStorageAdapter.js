/**
 * Browser Storage Adapter class for handling all browser storage operations
 * Provides a consistent interface for localStorage with error handling
 * and easy extensibility for other storage mechanisms
 */

class BrowserStorageAdapter {
  constructor(storageType = 'localStorage') {
    this.storage = storageType === 'sessionStorage' ? sessionStorage : localStorage;
    console.log('💾 Browser Storage Adapter initialized with:', storageType);
  }

  /**
   * Get an item from storage
   * @param {string} key - The storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} The parsed value or defaultValue
   */
  get(key, defaultValue = null) {
    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(`❌ Error reading from storage (key: ${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Set an item in storage
   * @param {string} key - The storage key
   * @param {*} value - The value to store (will be JSON stringified)
   * @returns {boolean} Success status
   */
  set(key, value) {
    try {
      this.storage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`❌ Error writing to storage (key: ${key}):`, error);
      // Handle quota exceeded errors
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded. Consider clearing old data.');
      }
      return false;
    }
  }

  /**
   * Remove an item from storage
   * @param {string} key - The storage key
   * @returns {boolean} Success status
   */
  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`❌ Error removing from storage (key: ${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all items from storage
   * @returns {boolean} Success status
   */
  clear() {
    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Check if a key exists in storage
   * @param {string} key - The storage key
   * @returns {boolean} Whether the key exists
   */
  has(key) {
    try {
      return this.storage.getItem(key) !== null;
    } catch (error) {
      console.error(`❌ Error checking storage (key: ${key}):`, error);
      return false;
    }
  }

  /**
   * Get all keys from storage
   * @returns {string[]} Array of all storage keys
   */
  keys() {
    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error('❌ Error getting storage keys:', error);
      return [];
    }
  }

  /**
   * Get the number of items in storage
   * @returns {number} Number of items
   */
  size() {
    try {
      return this.storage.length;
    } catch (error) {
      console.error('❌ Error getting storage size:', error);
      return 0;
    }
  }
}

// Export singleton instance
export default new BrowserStorageAdapter('localStorage');

