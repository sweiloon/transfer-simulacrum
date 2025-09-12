
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { safeLocalStorage } from '@/utils/storage';
import { formatCurrency } from '@/utils/currency';
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
    primary: 'from-yellow-400 to-yellow-500',
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    accent: 'border-yellow-300',
    logo: '/lovable-uploads/323134fd-5e09-4850-a809-6dca1be6efb3.png'
  },
  'CIMB Bank Berhad': {
    primary: 'from-red-600 to-red-700',
    bg: 'bg-red-50',
    text: 'text-red-800',
    accent: 'border-red-300',
    logo: '/lovable-uploads/0818f65c-7b2b-46fe-8732-791fec36b4d7.png'
  },
  'Public Bank Berhad': {
    primary: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-800',
    accent: 'border-red-300',
    logo: '/lovable-uploads/ecbb9495-68b7-48b9-a9fa-d8ecdde97534.png'
  },
  'RHB Bank Berhad': {
    primary: 'from-blue-600 to-blue-700',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    accent: 'border-blue-300',
    logo: '/lovable-uploads/5df8f1ad-9209-4506-b668-41afc7d9eb84.png'
  },
  'Hong Leong Bank Berhad': {
    primary: 'from-blue-800 to-blue-900',
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    accent: 'border-blue-300',
    logo: '/lovable-uploads/0054d41f-519d-43ab-b31a-d772b0a6f9f4.png'
  },
  'AmBank (M) Berhad': {
    primary: 'from-red-500 to-yellow-400',
    bg: 'bg-orange-50',
    text: 'text-red-700',
    accent: 'border-orange-300',
    logo: '/lovable-uploads/3f32e493-ecda-4a9a-8bec-a69fc75806af.png'
  },
  'Bank Islam Malaysia Berhad': {
    primary: 'from-pink-600 to-pink-700',
    bg: 'bg-pink-50',
    text: 'text-pink-800',
    accent: 'border-pink-300',
    logo: '/lovable-uploads/b8280e5a-f849-4a72-9355-e2fadbe41075.png'
  },
  'Bank Kerjasama Rakyat Malaysia Berhad (Bank Rakyat)': {
    primary: 'from-blue-600 to-orange-500',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    accent: 'border-blue-300',
    logo: '/lovable-uploads/46561530-bef1-4f4f-8014-9f58b414430b.png'
  },
  'United Overseas Bank (Malaysia) Bhd (UOB Malaysia)': {
    primary: 'from-blue-800 to-blue-900',
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    accent: 'border-blue-300',
    logo: '/lovable-uploads/94bd47e5-b594-4d2f-962d-ed4f3896a330.png'
  },
  'OCBC Bank (Malaysia) Berhad': {
    primary: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    text: 'text-red-800',
    accent: 'border-red-300',
    logo: '/lovable-uploads/5621d47e-a40e-4bb3-9479-6c3c84d66151.png'
  }
};

const TransferLoading = () => {
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [progress, setProgress] = useState(64);
  const [showExitDialog, setShowExitDialog] = useState(false);

  useEffect(() => {
    // Get transfer data from localStorage
    const data = safeLocalStorage.getJSON<TransferData>('transferData');
    if (!data) {
      navigate('/');
      return;
    }
    
    const parsedData = { ...data };
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
      <div className={`min-h-screen ${style.bg} p-2 sm:p-4`}>
        <div className="max-w-7xl mx-auto pt-4 sm:pt-8">
          {/* Header */}
          <div className={`bg-gradient-to-r ${style.primary} text-white p-4 sm:p-6 lg:p-8 rounded-t-xl shadow-lg`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <img 
                    src={style.logo} 
                    alt={`${transferData.bank} Logo`}
                    className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 object-contain"
                    onError={(e) => {
                      // Fallback to generic bank icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = '🏦';
                      target.parentElement!.className += ' text-2xl sm:text-3xl lg:text-5xl';
                    }}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold">Fund Transferring</h1>
                  <p className="text-white/90 text-sm sm:text-base lg:text-lg">Secure Transaction in Progress</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xs sm:text-sm text-white/80">Transaction ID</div>
                <div className="font-mono text-sm sm:text-base lg:text-lg">#TXN-{Date.now().toString().slice(-8)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 -mt-2">
            {/* Loading Section */}
            <Card className={`${style.accent} border-2 bg-white/80 backdrop-blur-sm shadow-xl order-2 xl:order-1`}>
              <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                <div className="mb-6 sm:mb-8">
                  {getStatusIcon(transferData.transactionStatus, style)}
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`text-lg sm:text-xl lg:text-2xl font-semibold ${style.text}`}>
                    {getStatusText(transferData.transactionStatus)}
                  </h2>
                  
                  {transferData.transactionStatus === 'Processing' && (
                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                      <div 
                        className={`bg-gradient-to-r ${style.primary} h-3 sm:h-4 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  <div className="text-left">
                    {getProgressSteps(transferData.transactionStatus, progress)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transfer Details */}
            <Card className={`${style.accent} border-2 bg-white/80 backdrop-blur-sm shadow-xl order-1 xl:order-2`}>
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <h3 className={`text-lg sm:text-xl lg:text-2xl font-semibold ${style.text} mb-4 sm:mb-6 flex items-center gap-2`}>
                  <span className="text-lg sm:text-xl">📋</span> Transfer Details
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Bank</label>
                      <div className="flex items-center gap-2 sm:gap-3 mt-1">
                        <img 
                          src={style.logo} 
                          alt={`${transferData.bank} Logo`}
                          className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 object-contain flex-shrink-0"
                          onError={(e) => {
                            // Fallback to generic bank icon if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <p className={`font-semibold ${style.text} text-xs sm:text-sm lg:text-base leading-tight`}>
                          {transferData.bank}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Transfer Type</label>
                      <p className={`font-semibold ${style.text} text-sm sm:text-base lg:text-lg mt-1`}>
                        {transferData.type}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">Transferer Name</label>
                    <p className={`font-semibold ${style.text} text-base sm:text-lg lg:text-xl mt-1`}>
                      {transferData.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">Date & Time</label>
                    <p className={`font-semibold ${style.text} font-mono text-sm sm:text-base lg:text-lg mt-1 break-all sm:break-normal`}>
                      {formatDateTime(transferData.date, transferData.time)}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-600">Account Number</label>
                    <p className={`font-mono font-semibold ${style.text} text-base sm:text-lg lg:text-xl mt-1 break-all sm:break-normal`}>
                      {transferData.account.replace(/(\d{4})(?=\d)/g, '$1-')}
                    </p>
                  </div>

                  <div className={`bg-gradient-to-r ${style.primary} p-3 sm:p-4 lg:p-6 rounded-lg text-white`}>
                    <label className="text-xs sm:text-sm font-medium text-white/80">Transfer Amount</label>
                    <p className="font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl mt-1 break-words">
                      {formatCurrency(transferData.amount)}
                    </p>
                  </div>

                  <div className={`border-2 ${style.accent} p-3 sm:p-4 rounded-lg ${style.bg}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 sm:gap-0">
                      <span className="font-medium text-gray-700 text-sm sm:text-base">Transaction Status:</span>
                      <span className={`font-bold ${style.text} uppercase tracking-wide text-sm sm:text-base lg:text-lg`}>
                        {transferData.transactionStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Notice */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
              🔒 This transaction is secured with bank-grade encryption. Press ESC to go back to fill-up page.
            </p>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent className="mx-4 sm:mx-auto max-w-md sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">Confirm Navigation</AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base">
              Are you sure you want to leave this page and return to the fill-up form? Your current transfer data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExitConfirm} className="w-full sm:w-auto">
              Yes, Go Back
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransferLoading;
