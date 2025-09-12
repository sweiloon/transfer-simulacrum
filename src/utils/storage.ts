/**
 * Safe localStorage utilities with error handling
 */

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof Storage === 'undefined') {
        console.warn('localStorage is not available');
        return null;
      }
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (typeof Storage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      if (typeof Storage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
      return false;
    }
  },

  getJSON: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = safeLocalStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error parsing JSON from localStorage (${key}):`, error);
      return defaultValue;
    }
  },

  setJSON: (key: string, value: any): boolean => {
    try {
      const serialized = JSON.stringify(value);
      return safeLocalStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error serializing JSON to localStorage (${key}):`, error);
      return false;
    }
  },

  clear: (): boolean => {
    try {
      if (typeof Storage === 'undefined') {
        console.warn('localStorage is not available');
        return false;
      }
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};