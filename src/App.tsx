import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Transfer from "./pages/Transfer";
import CTOSForm from "./pages/CTOSForm";
import TransferHistory from "./pages/TransferHistory";
import TransferLoading from "./pages/TransferLoading";
import CTOSReport from "./pages/CTOSReport";
import MaybankTransfer from "./pages/MaybankTransfer";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/transfer" element={
              <ProtectedRoute>
                <Transfer />
              </ProtectedRoute>
            } />
            <Route path="/ctos" element={
              <ProtectedRoute>
                <CTOSForm />
              </ProtectedRoute>
            } />
            <Route path="/transfer-history" element={
              <ProtectedRoute>
                <TransferHistory />
              </ProtectedRoute>
            } />
            <Route path="/transfer-loading" element={
              <ProtectedRoute>
                <TransferLoading />
              </ProtectedRoute>
            } />
            <Route path="/maybank-transfer" element={
              <ProtectedRoute>
                <MaybankTransfer />
              </ProtectedRoute>
            } />
            <Route path="/ctos-report" element={
              <ProtectedRoute>
                <CTOSReport />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;