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
    // Simulate transfer processing
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to success page or show success message
    }, 3000);
  };

  if (!transferData) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="text-gray-600">Processing your transfer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Maybank banner */}
      <div className="relative">
        <img 
          src="/lovable-uploads/adc92189-3f59-49c5-a67d-990fcb08fee0.png" 
          alt="Maybank2u Header"
          className="w-full h-auto"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <button className="px-4 py-4 text-gray-500 border-b-2 border-transparent hover:text-gray-700">
              PAY
            </button>
            <button className="px-4 py-4 text-gray-900 border-b-2 border-blue-600 font-medium">
              TRANSFER
            </button>
            <button className="px-4 py-4 text-gray-500 border-b-2 border-transparent hover:text-gray-700">
              RELOAD
            </button>
            <button className="px-4 py-4 text-gray-500 border-b-2 border-transparent hover:text-gray-700">
              REQUEST
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 relative">
        {/* Back Button - moved to top right */}
        <div className="absolute top-0 right-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Form
          </Button>
        </div>

        {/* Transfer From Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm">Transfer From</div>
              <div className="text-gray-900 font-medium text-lg">{transferData.payFromAccount}</div>
            </div>
            <div className="text-right">
              <div className="text-gray-600 text-sm">Available Balance</div>
              <div className="text-blue-600 font-medium">RM 11.47</div>
            </div>
          </div>
        </div>

        {/* Transfer To Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-gray-600 text-sm">Transfer To</div>
                <div className="text-gray-900 font-medium text-lg">{transferData.name}</div>
                <div className="text-gray-600 text-sm">{transferData.account}</div>
                <div className="text-red-600 font-medium text-lg">{transferData.currency} {transferData.amount}</div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="border-t border-yellow-400 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient's bank</span>
                    <span className="text-gray-900 font-medium">PUBLIC BANK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Type</span>
                    <span className="text-gray-900 font-medium">{transferData.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transfer Mode</span>
                    <span className="text-gray-900 font-medium">{transferData.transferMode}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effective date</span>
                    <span className="text-gray-900 font-medium">
                      Today {new Date(transferData.effectiveDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient Reference</span>
                    <span className="text-gray-900 font-medium">
                      {transferData.recipientReference || 'cola'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Amount Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="text-gray-900 font-medium text-lg">Total Amount</div>
            <div className="text-red-600 font-bold text-xl">{transferData.currency} {transferData.amount}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
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
      </div>
    </div>
  );
};

export default MaybankTransfer;