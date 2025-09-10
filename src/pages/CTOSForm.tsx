import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface CTOSData {
  name: string;
  newId: string;
  oldId: string;
  dateOfBirth: string;
  address1: string;
  address2: string;
  score: string;
}

const CTOSForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [ctosData, setCTOSData] = useState<CTOSData>({
    name: '',
    newId: '',
    oldId: '',
    dateOfBirth: '',
    address1: '',
    address2: '',
    score: ''
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  const handleGenerate = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Store CTOS data in localStorage to access on report page
      localStorage.setItem('ctosData', JSON.stringify(ctosData));
      navigate('/ctos-report');
    } catch (error) {
      console.error('Error generating:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const isFormValid = () => {
    return ctosData.name && 
           ctosData.newId && 
           ctosData.oldId && 
           ctosData.dateOfBirth && 
           ctosData.address1 && 
           ctosData.score &&
           parseInt(ctosData.score) >= 300 && 
           parseInt(ctosData.score) <= 850;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-semibold text-foreground">CTOS Report Generator</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>Generate CTOS Report</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={ctosData.name}
                onChange={(e) => setCTOSData({...ctosData, name: e.target.value})}
                placeholder="Enter your full name"
                className="h-12"
              />
            </div>

            {/* New ID */}
            <div className="space-y-2">
              <Label htmlFor="newId" className="text-sm font-medium text-foreground">
                New IC Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="newId"
                value={ctosData.newId}
                onChange={(e) => setCTOSData({...ctosData, newId: e.target.value})}
                placeholder="890123-12-3456"
                className="h-12"
              />
            </div>

            {/* Old ID */}
            <div className="space-y-2">
              <Label htmlFor="oldId" className="text-sm font-medium text-foreground">
                Old IC Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="oldId"
                value={ctosData.oldId}
                onChange={(e) => setCTOSData({...ctosData, oldId: e.target.value})}
                placeholder="A1234567"
                className="h-12"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={ctosData.dateOfBirth}
                onChange={(e) => setCTOSData({...ctosData, dateOfBirth: e.target.value})}
                className="h-12"
              />
            </div>

            {/* Address 1 */}
            <div className="space-y-2">
              <Label htmlFor="address1" className="text-sm font-medium text-foreground">
                Address Line 1 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address1"
                value={ctosData.address1}
                onChange={(e) => setCTOSData({...ctosData, address1: e.target.value})}
                placeholder="Street address"
                className="h-12"
              />
            </div>

            {/* Address 2 */}
            <div className="space-y-2">
              <Label htmlFor="address2" className="text-sm font-medium text-foreground">
                Address Line 2
              </Label>
              <Input
                id="address2"
                value={ctosData.address2}
                onChange={(e) => setCTOSData({...ctosData, address2: e.target.value})}
                placeholder="City, State, Postal Code"
                className="h-12"
              />
            </div>

            {/* Credit Score */}
            <div className="space-y-2">
              <Label htmlFor="score" className="text-sm font-medium text-foreground">
                Credit Score (300-850) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="score"
                type="number"
                min="300"
                max="850"
                value={ctosData.score}
                onChange={(e) => setCTOSData({...ctosData, score: e.target.value})}
                placeholder="750"
                className="h-12"
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!isFormValid() || isGenerating}
              className="w-full h-12"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate CTOS Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CTOSForm;