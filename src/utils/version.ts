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
  // Skip version check in development to avoid constant clearing
  if (process.env.NODE_ENV === 'development') {
    return false;
  }

  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const currentVersion = APP_VERSION;
    
    console.log('Version check:', { storedVersion, currentVersion });
    
    // If no stored version, just set it without cleanup (first visit)
    if (!storedVersion) {
      localStorage.setItem(VERSION_KEY, currentVersion);
      return false;
    }
    
    // Only perform cleanup if versions don't match
    if (storedVersion !== currentVersion) {
      console.log('Version mismatch detected, performing cleanup...');
      
      // Selective cleanup - only remove potentially problematic keys
      const keysToRemove = [
        'transferData',
        'ctosData', 
        'editTransferData',
        // Supabase auth keys that might be stale
        'supabase.auth.token',
        'sb-localhost-auth-token',
        'sb-auth-token'
      ];
      
      const allKeys = Object.keys(localStorage);
      const supabaseKeys = allKeys.filter(key => 
        key.startsWith('sb-') && key.includes('auth')
      );
      
      // Remove specific keys instead of clearing everything
      [...keysToRemove, ...supabaseKeys].forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Could not remove ${key}:`, e);
        }
      });
      
      // Set the new version
      localStorage.setItem(VERSION_KEY, currentVersion);
      
      return true; // Cleanup was performed
    }
    
    return false; // No cleanup needed
  } catch (error) {
    console.error('Version check failed:', error);
    // On error, don't perform aggressive cleanup
    // Just set current version and continue
    try {
      localStorage.setItem(VERSION_KEY, APP_VERSION);
    } catch (clearError) {
      console.error('Failed to set version:', clearError);
    }
    return false;
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