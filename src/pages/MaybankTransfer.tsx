import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransferData {
  bank: string;
  name: string;
  account: string;
  amount: string;
  currency: string;
  payFromAccount: string;
  transferMode: string;
  type: string;
  effectiveDate: Date;
  recipientReference: string;
}

const MaybankTransfer = () => {
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('transferData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setTransferData(data);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleTransfer = () => {
    setIsLoading(true);
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isLoading) {
        setIsLoading(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isLoading]);

  if (!transferData) {
    return null;
  }


  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-600">Processing your transfer...</p>
            <Button
              variant="outline"
              onClick={() => setIsLoading(false)}
              className="mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Header with Maybank banner */}
      <div className="relative">
        <img 
          src="/lovable-uploads/adc92189-3f59-49c5-a67d-990fcb08fee0.png" 
          alt="Maybank2u Header"
          className="w-full h-auto"
        />
      </div>


      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 relative">

        {/* Transfer From Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-gray-700 text-sm font-medium">Transfer From Savings Account-i</div>
            </div>
            <div className="text-right">
              <div className="text-gray-600 text-sm">Available Balance</div>
              <div className="text-teal-600 font-medium">RM 11.47</div>
            </div>
          </div>
        </div>

        {/* Transfer To Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-gray-700 text-sm font-medium mb-1">Transfer To {transferData.name}</div>
                <div className="text-gray-600 text-sm">{transferData.account}</div>
                <div className="text-red-600 font-medium text-lg mt-1">{transferData.currency} {transferData.amount}</div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Transfer Details Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">Recipient's bank</span>
                <span className="text-gray-700 text-sm font-medium">PUBLIC BANK</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">Transaction Type</span>
                <span className="text-gray-700 text-sm font-medium">{transferData.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">Transfer Mode</span>
                <span className="text-gray-700 text-sm font-medium">{transferData.transferMode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">Effective date</span>
                <span className="text-gray-700 text-sm font-medium">
                  Today {new Date(transferData.effectiveDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 text-sm">Recipient Reference</span>
                <span className="text-gray-700 text-sm font-medium">
                  {transferData.recipientReference || 'cola'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Amount Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-16">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-gray-900 font-medium text-lg">Total Amount</div>
            <div className="text-red-600 font-bold text-xl">{transferData.currency} {transferData.amount}</div>
          </div>
        </div>

        {/* Action Buttons - moved much lower */}
        <div className="flex justify-center space-x-4 mt-16">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="px-8 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransfer}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Confirm Transfer
          </Button>
        </div>

        {/* Back to Form Button */}
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaybankTransfer;