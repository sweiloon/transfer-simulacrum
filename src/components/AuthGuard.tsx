import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  redirectTo 
}) => {
  const location = useLocation();
  
  try {
    const { user, isLoading } = useAuth();

    // Show loading spinner while auth is being determined
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-sm text-muted-foreground">Authenticating...</p>
          </div>
        </div>
      );
    }

    // Handle authentication requirements
    if (requireAuth && !user) {
      // Save the current location for redirect after login
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    if (!requireAuth && user) {
      // User is logged in but shouldn't be on this page (like auth page)
      return <Navigate to={redirectTo || "/"} replace />;
    }

    return <>{children}</>;
  } catch (error) {
    console.error('AuthGuard error:', error);
    // On error, show a recovery screen
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4 max-w-md">
          <h2 className="text-xl font-semibold text-foreground">Authentication Error</h2>
          <p className="text-sm text-muted-foreground">
            There was an error with authentication. Please try refreshing the page.
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => window.location.href = '/auth'}
              className="px-4 py-2 border border-border rounded-md hover:bg-accent text-sm"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }
};