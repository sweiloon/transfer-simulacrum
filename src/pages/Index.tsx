
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CreditCard, Building2 } from 'lucide-react';
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
    startingPercentage: ''
  });

  const handleGenerate = () => {
    // Store transfer data in localStorage to access on loading page
    localStorage.setItem('transferData', JSON.stringify(transferData));
    navigate('/transfer-loading');
  };

  const isFormValid = () => {
    const baseValid = transferData.bank && 
           transferData.name && 
           transferData.time && 
           transferData.type && 
           transferData.account && 
           transferData.amount &&
           transferData.transactionStatus;

    // If Processing is selected, also check startingPercentage
    if (transferData.transactionStatus === 'Processing') {
      return baseValid && transferData.startingPercentage && 
             parseInt(transferData.startingPercentage) >= 1 && 
             parseInt(transferData.startingPercentage) <= 100;
    }

    return baseValid;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Building2 size={32} />
            <CardTitle className="text-2xl font-bold">Payment Transfer Generator</CardTitle>
          </div>
          <p className="text-blue-100">Generate your bank transfer details</p>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {/* Bank Selection */}
          <div className="space-y-2">
            <Label htmlFor="bank" className="text-sm font-medium text-gray-700">
              Transfer Bank <span className="text-red-500">*</span>
            </Label>
            <Select value={transferData.bank} onValueChange={(value) => setTransferData({...transferData, bank: value})}>
              <SelectTrigger className="h-12">
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
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Transferer Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={transferData.name}
              onChange={(e) => setTransferData({...transferData, name: e.target.value})}
              placeholder="Enter your full name"
              className="h-12"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Transfer Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 justify-start text-left font-normal",
                      !transferData.date && "text-muted-foreground"
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
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                Transfer Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={transferData.time}
                onChange={(e) => setTransferData({...transferData, time: e.target.value})}
                className="h-12"
                step="1"
              />
            </div>
          </div>

          {/* Transfer Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium text-gray-700">
              Transfer Type <span className="text-red-500">*</span>
            </Label>
            <Select value={transferData.type} onValueChange={(value) => setTransferData({...transferData, type: value})}>
              <SelectTrigger className="h-12">
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
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
              Transaction Status <span className="text-red-500">*</span>
            </Label>
            <Select value={transferData.transactionStatus} onValueChange={(value) => setTransferData({...transferData, transactionStatus: value, startingPercentage: value === 'Processing' ? transferData.startingPercentage : ''})}>
              <SelectTrigger className="h-12">
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
              <Label htmlFor="percentage" className="text-sm font-medium text-gray-700">
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
                className="h-12"
              />
            </div>
          )}

          {/* Bank Account */}
          <div className="space-y-2">
            <Label htmlFor="account" className="text-sm font-medium text-gray-700">
              Bank Account Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="account"
              value={transferData.account}
              onChange={(e) => setTransferData({...transferData, account: e.target.value.replace(/\D/g, '')})}
              placeholder="Enter account number (numbers only)"
              className="h-12"
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Transfer Amount <span className="text-red-500">*</span>
            </Label>
            <div className="flex gap-3">
              <Select value={transferData.currency} onValueChange={(value) => setTransferData({...transferData, currency: value})}>
                <SelectTrigger className="w-24 h-12">
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
                className="flex-1 h-12"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button 
            onClick={handleGenerate}
            disabled={!isFormValid()}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg transition-all duration-200 disabled:opacity-50"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Generate Transfer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
