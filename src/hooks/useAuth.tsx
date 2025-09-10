import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking the auth state update
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('display_name')
                .eq('user_id', session.user.id)
                .single();

              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: profile?.display_name || session.user.email || ''
              });
            } catch (error) {
              // Fallback if profile doesn't exist
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.email || ''
              });
            }
          }, 0);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // The auth state change listener will handle this
    });

    return () => subscription.unsubscribe();
  }, []);

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Input sanitization and validation
      const sanitizedEmail = email.toLowerCase().trim();
      const sanitizedName = name.trim();
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        setIsLoading(false);
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      // Name validation
      if (sanitizedName.length < 2 || sanitizedName.length > 50) {
        setIsLoading(false);
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
        setIsLoading(false);
        return { success: false, error: error.message };
      }

      // Check if email confirmation is required
      if (data.user && !data.session) {
        setIsLoading(false);
        return { 
          success: true, 
          error: 'Please check your email and click the confirmation link to activate your account.' 
        };
      }

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Registration failed' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Input sanitization
      const sanitizedEmail = email.toLowerCase().trim();
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedEmail)) {
        setIsLoading(false);
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
        setIsLoading(false);
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

      // Don't manually set loading to false here - let the auth state change handle it
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      console.error('Login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      const result = await Promise.race([
        supabase.auth.signOut(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Logout timeout')), 5000)
        )
      ]) as any;
      
      if (result?.error) {
        console.error('Logout error:', result.error);
        // Force clear local state even if Supabase call fails
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Force clear local state on any error including timeout
      setUser(null);
      setSession(null);
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