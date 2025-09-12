import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AuthGuard } from "./components/AuthGuard";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TransferHistory from "./pages/TransferHistory";
import TransferLoading from "./pages/TransferLoading";
import CTOSReport from "./pages/CTOSReport";
import MaybankTransfer from "./pages/MaybankTransfer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary fallback={
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">Authentication Error</h2>
              <p className="text-muted-foreground">
                There was an error loading the application. Please refresh the page.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Refresh Page
              </button>
            </div>
          </div>
        }>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ErrorBoundary fallback={
                <div className="min-h-screen flex items-center justify-center p-4">
                  <div className="text-center space-y-4">
                    <h2 className="text-xl font-semibold">Navigation Error</h2>
                    <p className="text-muted-foreground">
                      There was an error with page navigation.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/auth'}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Go to Login
                    </button>
                  </div>
                </div>
              }>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={
                      <AuthGuard requireAuth={true}>
                        <Index />
                      </AuthGuard>
                    } />
                    <Route path="/auth" element={
                      <AuthGuard requireAuth={false} redirectTo="/">
                        <Auth />
                      </AuthGuard>
                    } />
                    <Route path="/transfer-history" element={
                      <AuthGuard requireAuth={true}>
                        <TransferHistory />
                      </AuthGuard>
                    } />
                    <Route path="/transfer-loading" element={
                      <AuthGuard requireAuth={true}>
                        <TransferLoading />
                      </AuthGuard>
                    } />
                    <Route path="/maybank-transfer" element={
                      <AuthGuard requireAuth={true}>
                        <MaybankTransfer />
                      </AuthGuard>
                    } />
                    <Route path="/ctos-report" element={
                      <AuthGuard requireAuth={true}>
                        <CTOSReport />
                      </AuthGuard>
                    } />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </ErrorBoundary>
            </TooltipProvider>
          </AuthProvider>
        </ErrorBoundary>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;