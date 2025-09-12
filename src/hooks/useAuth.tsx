import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { checkVersionAndCleanup } from '@/utils/version';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Check for version changes and perform cleanup if needed
    const wasCleanupPerformed = checkVersionAndCleanup();
    if (wasCleanupPerformed) {
      console.log('🔄 Code update detected - forcing logout and clearing auth state');
      // Force immediate logout after cleanup
      supabase.auth.signOut().catch(() => {
        // Ignore errors during forced logout
        console.log('Forced logout during version cleanup');
      });
    }
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Log auth state changes in development
        if (process.env.NODE_ENV === 'development') {
          console.log('🔐 Auth state change:', {
            event,
            hasUser: !!session?.user,
            userEmail: session?.user?.email || 'No session',
            isLoading
          });
        }
        
        if (!isMounted) return;
        
        setSession(session);
        
        if (session?.user) {
          try {
            // Add timeout for profile fetch
            const profilePromise = supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', session.user.id)
              .single();

            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
            );

            const { data: profile } = await Promise.race([profilePromise, timeoutPromise]) as any;

            if (isMounted) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profile?.display_name || session.user.email || ''
              });
            }
          } catch (error) {
            // Fallback if profile doesn't exist or timeout
            if (isMounted) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email || ''
              });
            }
          }
        } else {
          if (isMounted) {
            setUser(null);
          }
        }
        
        // Always set loading to false after processing
        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    // Initialize authentication
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Initial session check:', session?.user?.email || 'No session');
        }
        
        if (!isMounted) return;
        
        if (error) {
          console.error('Session check error:', error);
          setIsLoading(false);
          return;
        }

        // The auth state change handler will process the session
        if (!session && isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Set timeout fallback for initialization
    const initializationTimeout = setTimeout(() => {
      if (isMounted) {
        console.warn('Auth initialization timeout, setting loading to false');
        setIsLoading(false);
      }
    }, 5000);

    initializeAuth();

    return () => {
      isMounted = false;
      clearTimeout(initializationTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Don't set global loading state here as it interferes with auth flow
      
      // Input sanitization and validation
      const sanitizedEmail = email.toLowerCase().trim();
      const sanitizedName = name.trim();
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      // Name validation
      if (sanitizedName.length < 2 || sanitizedName.length > 50) {
        return { success: false, error: 'Name must be between 2 and 50 characters' };
      }
      
      const redirectUrl = `${window.location.origin}/`;
      
      // Add timeout to prevent stuck states
      const registrationPromise = supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: sanitizedName,
            name: sanitizedName
          }
        }
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Registration timeout')), 30000)
      );

      const { data, error } = await Promise.race([registrationPromise, timeoutPromise]) as any;

      if (error) {
        return { success: false, error: error.message };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        return { 
          success: true, 
          error: 'Please check your email and click the confirmation link to activate your account.' 
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Don't set global loading state here as it interferes with auth flow
      
      // Input sanitization
      const sanitizedEmail = email.toLowerCase().trim();
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      // Add timeout to prevent stuck states
      const loginPromise = supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout')), 30000)
      );

      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (error) {
        // Provide more specific error messages
        if (error.message.includes('email_not_confirmed')) {
          return { 
            success: false, 
            error: 'Please check your email and click the confirmation link to activate your account before signing in.' 
          };
        }
        if (error.message.includes('Invalid login credentials')) {
          return { 
            success: false, 
            error: 'Invalid email or password. Please check your credentials and try again.' 
          };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      // Clear local auth state immediately for responsive UI
      setUser(null);
      setSession(null);
      
      // Clear any cached transfer data
      const keysToRemove = ['transferData', 'ctosData', 'editTransferData'];
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn(`Could not remove ${key} from localStorage:`, e);
        }
      });
      
      // Attempt to sign out from Supabase
      const result = await Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Logout timeout')), 5000)
        )
      ]) as any;
      
      if (result?.error) {
        console.error('Logout error:', result.error);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // State is already cleared above, so just log the error
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};