/**
 * Version management utilities to handle code updates and force logout
 */

// Version identifier that changes with each deployment
// In production, this will be set at build time by Vite
export const APP_VERSION = process.env.NODE_ENV === 'production' 
  ? import.meta.env.VITE_BUILD_TIME || Date.now().toString()
  : 'dev-' + Date.now().toString();

const VERSION_KEY = 'app_version';

/**
 * Check if the current app version matches the stored version
 * If not, it means the code was updated and we should clear stale data
 */
export const checkVersionAndCleanup = (): boolean => {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const currentVersion = APP_VERSION;
    
    console.log('Version check:', { storedVersion, currentVersion });
    
    // If no stored version or version mismatch, cleanup is needed
    if (!storedVersion || storedVersion !== currentVersion) {
      console.log('Version mismatch detected, performing cleanup...');
      
      // Clear all localStorage data that might be stale
      const keysToKeep = ['theme-preference']; // Keep user preferences
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      // Set the new version
      localStorage.setItem(VERSION_KEY, currentVersion);
      
      // Force clear any potential auth state
      if (typeof window !== 'undefined' && window.indexedDB) {
        // Clear any potential Supabase cached data
        try {
          // Clear Supabase storage keys
          const supabaseKeys = allKeys.filter(key => 
            key.includes('supabase') || 
            key.includes('auth') ||
            key.includes('sb-')
          );
          supabaseKeys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
          console.warn('Could not clear Supabase storage:', error);
        }
      }
      
      return true; // Cleanup was performed
    }
    
    return false; // No cleanup needed
  } catch (error) {
    console.error('Version check failed:', error);
    // On error, assume cleanup is needed for safety
    try {
      localStorage.clear();
      localStorage.setItem(VERSION_KEY, APP_VERSION);
    } catch (clearError) {
      console.error('Failed to clear storage:', clearError);
    }
    return true;
  }
};

/**
 * Get the current app version
 */
export const getAppVersion = (): string => {
  return APP_VERSION;
};

/**
 * Force a version update (for testing or manual triggers)
 */
export const forceVersionUpdate = (): void => {
  localStorage.setItem(VERSION_KEY, Date.now().toString());
  window.location.reload();
};