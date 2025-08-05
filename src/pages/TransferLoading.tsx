
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TransferData {
  bank: string;
  name: string;
  date: Date;
  time: string;
  type: string;
  account: string;
  amount: string;
  currency: string;
  transactionStatus: string;
  startingPercentage: string;
}

const bankStyles = {
  'Malayan Banking Berhad (Maybank)': {
    primary: 'from-yellow-500 to-yellow-600',
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    accent: 'border-yellow-200',
    logo: '🏦'
  },
  'CIMB Bank Berhad': {
    primary: 'from-red-600 to-red-700',
    bg: 'bg-red-50',
    text: 'text-red-800',
    accent: 'border-red-200',
    logo: '🏛️'
  },
  'Public Bank Berhad': {
    primary: 'from-green-600 to-green-700',
    bg: 'bg-green-50',
    text: 'text-green-800',
    accent: 'border-green-200',
    logo: '🏢'
  },
  'RHB Bank Berhad': {
    primary: 'from-blue-700 to-blue-800',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    accent: 'border-blue-200',
    logo: '🏪'
  },
  'Hong Leong Bank Berhad': {
    primary: 'from-purple-600 to-purple-700',
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    accent: 'border-purple-200',
    logo: '🏬'
  },
  'AmBank (M) Berhad': {
    primary: 'from-orange-600 to-orange-700',
    bg: 'bg-orange-50',
    text: 'text-orange-800',
    accent: 'border-orange-200',
    logo: '🏭'
  },
  'Bank Islam Malaysia Berhad': {
    primary: 'from-emerald-600 to-emerald-700',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    accent: 'border-emerald-200',
    logo: '🕌'
  },
  'Bank Kerjasama Rakyat Malaysia Berhad (Bank Rakyat)': {
    primary: 'from-teal-600 to-teal-700',
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    accent: 'border-teal-200',
    logo: '🌾'
  },
  'United Overseas Bank (Malaysia) Bhd (UOB Malaysia)': {
    primary: 'from-indigo-600 to-indigo-700',
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    accent: 'border-indigo-200',
    logo: '🌏'
  },
  'OCBC Bank (Malaysia) Berhad': {
    primary: 'from-pink-600 to-pink-700',
    bg: 'bg-pink-50',
    text: 'text-pink-800',
    accent: 'border-pink-200',
    logo: '🏯'
  }
};

const TransferLoading = () => {
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [progress, setProgress] = useState(64);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    // Get transfer data from localStorage
    const data = localStorage.getItem('transferData');
    if (!data) {
      navigate('/');
      return;
    }
    
    const parsedData = JSON.parse(data);
    parsedData.date = new Date(parsedData.date);
    setTransferData(parsedData);

    // Set initial progress based on status and startingPercentage
    if (parsedData.transactionStatus === 'Processing') {
      const initialProgress = parseInt(parsedData.startingPercentage) || 64;
      setProgress(initialProgress);

      // Start progress increment every 30 seconds for Processing status
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30000);

      return () => clearInterval(interval);
    } else {
      // For Cancelled and Successful, set progress to 100
      setProgress(100);
    }
  }, [navigate]);

  useEffect(() => {
    // Handle Escape key press
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowExitDialog(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleExitConfirm = () => {
    navigate('/');
  };

  const formatDateTime = (date: Date, time: string) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T${time}:00`;
  };

  const getStatusIcon = (status: string, style: any) => {
    switch (status) {
      case 'Cancelled':
        return <XCircle className={`w-24 h-24 ${style.text}`} />;
      case 'Successful':
        return <CheckCircle className={`w-24 h-24 ${style.text}`} />;
      case 'Processing':
      default:
        return (
          <div className="relative inline-block">
            <Loader2 className={`w-24 h-24 ${style.text} animate-spin`} />
            <div className={`absolute inset-0 flex items-center justify-center text-2xl font-bold ${style.text}`}>
              {progress}%
            </div>
          </div>
        );
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Cancelled':
        return 'Transfer Cancelled';
      case 'Successful':
        return 'Transfer Completed Successfully';
      case 'Processing':
      default:
        return 'Loading Transfer Status...';
    }
  };

  const getProgressSteps = (status: string, progress: number) => {
    switch (status) {
      case 'Cancelled':
        return (
          <div className={`text-sm ${transferData && bankStyles[transferData.bank as keyof typeof bankStyles]?.text} space-y-1`}>
            <div className="flex justify-between">
              <span>✗ Transaction cancelled</span>
              <span>Cancelled</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>⏳ Processing payment</span>
              <span>Stopped</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>⏳ Confirming transaction</span>
              <span>Stopped</span>
            </div>
          </div>
        );
      case 'Successful':
        return (
          <div className={`text-sm ${transferData && bankStyles[transferData.bank as keyof typeof bankStyles]?.text} space-y-1`}>
            <div className="flex justify-between">
              <span>✓ Validating account details</span>
              <span>Complete</span>
            </div>
            <div className="flex justify-between">
              <span>✓ Processing payment</span>
              <span>Complete</span>
            </div>
            <div className="flex justify-between">
              <span>✓ Confirming transaction</span>
              <span>Complete</span>
            </div>
          </div>
        );
      case 'Processing':
      default:
        return (
          <div className={`text-sm ${transferData && bankStyles[transferData.bank as keyof typeof bankStyles]?.text} space-y-1`}>
            <div className="flex justify-between">
              <span>✓ Validating account details</span>
              <span>Complete</span>
            </div>
            <div className="flex justify-between">
              <span>✓ Processing payment</span>
              <span>Complete</span>
            </div>
            <div className="flex justify-between">
              <span className={progress > 80 ? '' : 'text-gray-500'}>
                {progress > 80 ? '✓' : '⏳'} Confirming transaction
              </span>
              <span className={progress > 80 ? '' : 'text-gray-500'}>
                {progress > 80 ? 'Complete' : 'In Progress'}
              </span>
            </div>
          </div>
        );
    }
  };

  if (!transferData) return null;

  const style = bankStyles[transferData.bank as keyof typeof bankStyles] || bankStyles['Malayan Banking Berhad (Maybank)'];

  return (
    <>
      <div className={`min-h-screen ${style.bg} p-4`}>
        <div className="max-w-6xl mx-auto pt-8">
          {/* Header */}
          <div className={`bg-gradient-to-r ${style.primary} text-white p-6 rounded-t-xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{style.logo}</span>
                <div>
                  <h1 className="text-3xl font-bold">Fund Transferring</h1>
                  <p className="text-white/90">Secure Transaction in Progress</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/80">Transaction ID</div>
                <div className="font-mono text-lg">#TXN-{Date.now().toString().slice(-8)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 -mt-2">
            {/* Loading Section */}
            <Card className={`${style.accent} border-2 bg-white/80 backdrop-blur-sm shadow-xl`}>
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  {getStatusIcon(transferData.transactionStatus, style)}
                </div>
                
                <div className="space-y-4">
                  <h2 className={`text-xl font-semibold ${style.text}`}>
                    {getStatusText(transferData.transactionStatus)}
                  </h2>
                  
                  {transferData.transactionStatus === 'Processing' && (
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className={`bg-gradient-to-r ${style.primary} h-4 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {getProgressSteps(transferData.transactionStatus, progress)}
                </div>
              </CardContent>
            </Card>

            {/* Transfer Details */}
            <Card className={`${style.accent} border-2 bg-white/80 backdrop-blur-sm shadow-xl`}>
              <CardContent className="p-8">
                <h3 className={`text-xl font-semibold ${style.text} mb-6 flex items-center gap-2`}>
                  📋 Transfer Details
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Bank</label>
                      <p className={`font-semibold ${style.text} text-sm`}>{transferData.bank}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Transfer Type</label>
                      <p className={`font-semibold ${style.text}`}>{transferData.type}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Transferer Name</label>
                    <p className={`font-semibold ${style.text} text-lg`}>{transferData.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Date & Time</label>
                    <p className={`font-semibold ${style.text} font-mono`}>
                      {formatDateTime(transferData.date, transferData.time)}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Number</label>
                    <p className={`font-mono font-semibold ${style.text} text-lg`}>
                      {transferData.account.replace(/(\d{4})(?=\d)/g, '$1-')}
                    </p>
                  </div>

                  <div className={`bg-gradient-to-r ${style.primary} p-4 rounded-lg text-white`}>
                    <label className="text-sm font-medium text-white/80">Transfer Amount</label>
                    <p className="font-bold text-3xl">
                      {transferData.currency} {parseFloat(transferData.amount).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </p>
                  </div>

                  <div className={`border-2 ${style.accent} p-4 rounded-lg ${style.bg}`}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Transaction Status:</span>
                      <span className={`font-bold ${style.text} uppercase tracking-wide`}>
                        {transferData.transactionStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              🔒 This transaction is secured with bank-grade encryption. Press ESC to go back to fill-up page.
            </p>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Navigation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this page and return to the fill-up form? Your current transfer data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExitConfirm}>
              Yes, Go Back
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransferLoading;
