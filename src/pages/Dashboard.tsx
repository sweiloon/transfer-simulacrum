import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { CreditCard, FileText, History, LogOut, User } from 'lucide-react';
import { useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/auth');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            
            {/* User Info and Logout */}
            {user && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {user.name}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2"
                >
                  {isLoggingOut ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Payment Transfer Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/transfer')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Transfer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate bank transfer details and receipts
              </p>
            </CardContent>
          </Card>

          {/* CTOS Report Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/ctos')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                CTOS Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate credit score reports
              </p>
            </CardContent>
          </Card>

          {/* Transfer History Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/transfer-history')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Transfer History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View and manage your transfer history
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;