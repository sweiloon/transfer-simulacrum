import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CreditCard, Building2, FileText, ToggleLeft, ToggleRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

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
  transactionId: string;
}

interface CTOSData {
  name: string;
  newId: string;
  oldId: string;
  dateOfBirth: string;
  address1: string;
  address2: string;
  score: string;
}

const banks = [
  'Malayan Banking Berhad (Maybank)',
  'CIMB Bank Berhad',
  'Public Bank Berhad',
  'RHB Bank Berhad',
  'Hong Leong Bank Berhad',
  'AmBank (M) Berhad',
  'Bank Islam Malaysia Berhad',
  'Bank Kerjasama Rakyat Malaysia Berhad (Bank Rakyat)',
  'United Overseas Bank (Malaysia) Bhd (UOB Malaysia)',
  'OCBC Bank (Malaysia) Berhad'
];

const transferTypes = [
  'Duitnow Transfer',
  'Interbank GIRO',
  '3rd Party Transfer'
];

const Index = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState<'transfer' | 'ctos'>('transfer');
  const [transferData, setTransferData] = useState<TransferData>({
    bank: '',
    name: '',
    date: new Date(),
    time: '',
    type: '',
    account: '',
    amount: '',
    currency: 'RM',
    transactionStatus: '',
    startingPercentage: '',
    transactionId: ''
  });
  
  const [ctosData, setCTOSData] = useState<CTOSData>({
    name: '',
    newId: '',
    oldId: '',
    dateOfBirth: '',
    address1: '',
    address2: '',
    score: ''
  });

  const handleGenerate = () => {
    if (activeForm === 'transfer') {
      // Store transfer data in localStorage to access on loading page
      localStorage.setItem('transferData', JSON.stringify(transferData));
      navigate('/transfer-loading');
    } else {
      // Store CTOS data in localStorage to access on report page
      localStorage.setItem('ctosData', JSON.stringify(ctosData));
      navigate('/ctos-report');
    }
  };

  const isFormValid = () => {
    if (activeForm === 'transfer') {
      const baseValid = transferData.bank && 
             transferData.name && 
             transferData.time && 
             transferData.type && 
             transferData.account && 
             transferData.amount &&
             transferData.transactionStatus &&
             transferData.transactionId;

      // If Processing is selected, also check startingPercentage
      if (transferData.transactionStatus === 'Processing') {
        return baseValid && transferData.startingPercentage && 
               parseInt(transferData.startingPercentage) >= 1 && 
               parseInt(transferData.startingPercentage) <= 100;
      }

      return baseValid;
    } else {
      // CTOS form validation
      return ctosData.name && 
             ctosData.newId && 
             ctosData.oldId && 
             ctosData.dateOfBirth && 
             ctosData.address1 && 
             ctosData.score &&
             parseInt(ctosData.score) >= 300 && 
             parseInt(ctosData.score) <= 850;
    }
  };

  // Show Maybank interface if Maybank is selected
  if (activeForm === 'transfer' && transferData.bank === 'Malayan Banking Berhad (Maybank)') {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header with green gradient */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 text-white">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold">Maybank2u</h1>
                <span className="text-sm bg-green-800 px-2 py-1 rounded">MAE</span>
              </div>
              <nav className="hidden md:flex space-x-6 text-sm">
                <span>MY ACCOUNTS</span>
                <span>INSURANCE</span>
                <span className="text-yellow-300 font-semibold">PAY & TRANSFER</span>
                <span>APPLY</span>
                <span>CONTACT US</span>
              </nav>
              <div className="text-right">
                <div className="text-xs flex items-center">
                  <span className="mr-2">🔒</span>
                  Your last login was on Saturday, 29 March 2025 at 12:36:44
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex space-x-8">
              <button className="py-4 text-gray-500 border-b-2 border-transparent">PAY</button>
              <button className="py-4 text-black font-semibold border-b-2 border-black">TRANSFER</button>
              <button className="py-4 text-gray-500 border-b-2 border-transparent">RELOAD</button>
              <button className="py-4 text-gray-500 border-b-2 border-transparent">REQUEST</button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Transfer From Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm text-gray-600">Transfer From</h3>
                  <p className="text-lg font-semibold text-black">Savings Account-i</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-lg font-semibold text-green-600">RM 11.47</p>
                </div>
              </div>
            </div>

            {/* Transfer To Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm text-gray-600">Transfer To</h3>
                    <button className="text-gray-400">✏️</button>
                  </div>
                  <p className="text-lg font-semibold text-black mb-1">{transferData.name || 'LOO HUI KIEN'}</p>
                  <p className="text-sm text-gray-600">{transferData.account || '6331069024'}</p>
                  <p className="text-lg font-semibold text-black">{transferData.currency} {transferData.amount || '1.80'}</p>
                </div>
              </div>
            </div>

            {/* Transfer Details */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Recipient's bank</p>
                    <p className="font-semibold">PUBLIC BANK</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transaction Type</p>
                    <p className="font-semibold">Funds Transfer</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transfer Mode</p>
                    <p className="font-semibold">DuitNow Transfer</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Effective date</p>
                    <p className="font-semibold">Today 04 Sep 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Recipient Reference</p>
                    <p className="font-semibold">cola</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold">Total Amount</p>
                <p className="text-xl font-bold text-red-600">{transferData.currency} {transferData.amount || '1.80'}</p>
              </div>
            </div>
          </div>

          {/* Bottom notification section */}
          <div className="mt-6 bg-yellow-400 rounded-lg p-6 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-black font-medium">
                Tap on the notification on your smartphone<br />
                to approve the transaction.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-white text-black px-6 py-2 rounded font-medium">
                Secure Verification
              </button>
              <button className="bg-green-600 text-white px-8 py-2 rounded font-medium">
                REQUEST
              </button>
            </div>
          </div>

          {/* Edit Form Toggle */}
          <div className="mt-6 text-center">
            <Button
              variant="outline"
              onClick={() => setTransferData({...transferData, bank: ''})}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Edit Transfer Details
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Toggle Button */}
          <div className="flex items-center justify-center mb-8">
            <Button
              variant="outline"
              onClick={() => setActiveForm(activeForm === 'transfer' ? 'ctos' : 'transfer')}
              className="flex items-center gap-2 h-12 px-6 border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100"
            >
              {activeForm === 'transfer' ? (
                <>
                  <FileText className="h-5 w-5" />
                  Switch to CTOS
                  <ToggleRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  <ToggleLeft className="h-5 w-5" />
                  Switch to Payment Transfer
                  <CreditCard className="h-5 w-5" />
                </>
              )}
            </Button>
          </div>

          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              {activeForm === 'transfer' ? (
                <Building2 className="h-8 w-8 text-gray-900" />
              ) : (
                <FileText className="h-8 w-8 text-gray-900" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeForm === 'transfer' ? 'Payment Transfer' : 'CTOS Report'}
            </h1>
            <p className="text-gray-600">
              {activeForm === 'transfer' 
                ? 'Generate your bank transfer details' 
                : 'Generate your credit score report'
              }
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {activeForm === 'transfer' ? (
              <>
                {/* Bank Selection */}
                <div className="space-y-2">
                  <Label htmlFor="bank" className="text-sm font-medium text-gray-900">
                    Transfer Bank <span className="text-red-500">*</span>
                  </Label>
                  <Select value={transferData.bank} onValueChange={(value) => setTransferData({...transferData, bank: value})}>
                    <SelectTrigger className="h-12 border-gray-300 bg-gray-50 text-gray-900 focus:border-gray-900 focus:ring-gray-900">
                      <SelectValue placeholder="Select your bank" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {banks.map((bank) => (
                        <SelectItem key={bank} value={bank} className="py-3">
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transferer Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-900">
                    Transferer Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={transferData.name}
                    onChange={(e) => setTransferData({...transferData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                {/* Transaction ID */}
                <div className="space-y-2">
                  <Label htmlFor="transactionId" className="text-sm font-medium text-gray-900">
                    Transaction ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="transactionId"
                    value={transferData.transactionId}
                    onChange={(e) => setTransferData({...transferData, transactionId: e.target.value})}
                    placeholder="TXN240805AB123456"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">
                      Transfer Date <span className="text-red-500">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 justify-start text-left font-normal border-gray-300 bg-gray-50 text-gray-900 hover:bg-gray-100 focus:border-gray-900 focus:ring-gray-900",
                            !transferData.date && "text-gray-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {transferData.date ? format(transferData.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={transferData.date}
                          onSelect={(date) => date && setTransferData({...transferData, date})}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium text-gray-900">
                      Transfer Time <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={transferData.time}
                      onChange={(e) => setTransferData({...transferData, time: e.target.value})}
                      className="h-12 border-gray-300 bg-gray-50 text-gray-900 focus:border-gray-900 focus:ring-gray-900"
                      step="1"
                    />
                  </div>
                </div>

                {/* Transfer Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-sm font-medium text-gray-900">
                    Transfer Type <span className="text-red-500">*</span>
                  </Label>
                  <Select value={transferData.type} onValueChange={(value) => setTransferData({...transferData, type: value})}>
                    <SelectTrigger className="h-12 border-gray-300 bg-gray-50 text-gray-900 focus:border-gray-900 focus:ring-gray-900">
                      <SelectValue placeholder="Select transfer type" />
                    </SelectTrigger>
                    <SelectContent>
                      {transferTypes.map((type) => (
                        <SelectItem key={type} value={type} className="py-3">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transaction Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-900">
                    Transaction Status <span className="text-red-500">*</span>
                  </Label>
                  <Select value={transferData.transactionStatus} onValueChange={(value) => setTransferData({...transferData, transactionStatus: value, startingPercentage: value === 'Processing' ? transferData.startingPercentage : ''})}>
                    <SelectTrigger className="h-12 border-gray-300 bg-gray-50 text-gray-900 focus:border-gray-900 focus:ring-gray-900">
                      <SelectValue placeholder="Select transaction status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cancelled" className="py-3">Cancelled</SelectItem>
                      <SelectItem value="Processing" className="py-3">Processing</SelectItem>
                      <SelectItem value="Successful" className="py-3">Successful</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Starting Percentage - Only show for Processing */}
                {transferData.transactionStatus === 'Processing' && (
                  <div className="space-y-2">
                    <Label htmlFor="percentage" className="text-sm font-medium text-gray-900">
                      Starting Percentage <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="percentage"
                      type="number"
                      min="1"
                      max="100"
                      value={transferData.startingPercentage}
                      onChange={(e) => setTransferData({...transferData, startingPercentage: e.target.value})}
                      placeholder="Enter percentage (1-100)"
                      className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                )}

                {/* Bank Account */}
                <div className="space-y-2">
                  <Label htmlFor="account" className="text-sm font-medium text-gray-900">
                    Bank Account Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="account"
                    value={transferData.account}
                    onChange={(e) => setTransferData({...transferData, account: e.target.value.replace(/\D/g, '')})}
                    placeholder="Enter account number (numbers only)"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-900">
                    Transfer Amount <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-3">
                    <Select value={transferData.currency} onValueChange={(value) => setTransferData({...transferData, currency: value})}>
                      <SelectTrigger className="w-24 h-12 border-gray-300 bg-gray-50 text-gray-900 focus:border-gray-900 focus:ring-gray-900">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RM">RM</SelectItem>
                        <SelectItem value="$">$</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="amount"
                      value={transferData.amount}
                      onChange={(e) => setTransferData({...transferData, amount: e.target.value.replace(/[^\d.]/g, '')})}
                      placeholder="0.00"
                      className="flex-1 h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* CTOS Form Fields */}
                <div className="space-y-2">
                  <Label htmlFor="ctosName" className="text-sm font-medium text-gray-900">
                    Name (Your input) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ctosName"
                    value={ctosData.name}
                    onChange={(e) => setCTOSData({...ctosData, name: e.target.value})}
                    placeholder="SING WEI LOON"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newId" className="text-sm font-medium text-gray-900">
                    New ID / Old ID (Your input) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="newId"
                    value={ctosData.newId}
                    onChange={(e) => setCTOSData({...ctosData, newId: e.target.value})}
                    placeholder="950206015427 /-"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oldId" className="text-sm font-medium text-gray-900">
                    Old ID / ID Baru <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="oldId"
                    value={ctosData.oldId}
                    onChange={(e) => setCTOSData({...ctosData, oldId: e.target.value})}
                    placeholder="950206015427"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-900">
                    Date of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dateOfBirth"
                    value={ctosData.dateOfBirth}
                    onChange={(e) => setCTOSData({...ctosData, dateOfBirth: e.target.value})}
                    placeholder="06/02/1995"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address1" className="text-sm font-medium text-gray-900">
                    Address 1 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="address1"
                    value={ctosData.address1}
                    onChange={(e) => setCTOSData({...ctosData, address1: e.target.value})}
                    placeholder="NO. 123, JALAN ABC 1/2"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address2" className="text-sm font-medium text-gray-900">
                    Address 2
                  </Label>
                  <Input
                    id="address2"
                    value={ctosData.address2}
                    onChange={(e) => setCTOSData({...ctosData, address2: e.target.value})}
                    placeholder="TAMAN DEF, 12345 SHAH ALAM, SELANGOR"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="score" className="text-sm font-medium text-gray-900">
                    CTOS Score (300-850) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="score"
                    type="number"
                    min="300"
                    max="850"
                    value={ctosData.score}
                    onChange={(e) => setCTOSData({...ctosData, score: e.target.value})}
                    placeholder="Enter score between 300-850"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              </>
            )}

            {/* Generate Button */}
            <Button 
              onClick={handleGenerate}
              disabled={!isFormValid()}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-medium"
            >
              {activeForm === 'transfer' ? 'Generate' : 'Generate CTOS Report'}
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - Background Image (hidden on small screens) */}
      <div className="hidden lg:block lg:flex-1 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/lovable-uploads/ce07f52c-022f-4733-857d-037c33f65b4e.png')`
          }}
        />
      </div>
    </div>
  );
};

export default Index;