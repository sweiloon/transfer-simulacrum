
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CreditCard, Building2, FileText, ToggleLeft, ToggleRight, History, LogOut, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTransferHistory } from '@/hooks/useTransferHistory';
import { safeLocalStorage } from '@/utils/storage';
import { validateTransferAmount, validateAccountNumber, validateRecipientName, validateReference, sanitizeTransferData } from '@/utils/sanitization';
import { formatCurrencyInput, parseCurrency } from '@/utils/currency';

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
  recipientReference: string;
  payFromAccount: string;
  transferMode: string;
  effectiveDate: Date;
  recipientBank: string;
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
  '3rd Party Transfer',
  'Funds Transfer'
];

const transferModes = [
  'Duitnow Transfer',
  'Interbank GIRO',
  '3rd Party Transfer',
  'Funds Transfer'
];

const payFromAccounts = [
  'Savings Account-i',
  'DuitNow'
];

const Index = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const { addTransfer } = useTransferHistory();
  const [activeForm, setActiveForm] = useState<'transfer' | 'ctos'>('transfer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    transactionId: '',
    recipientReference: '',
    payFromAccount: 'Savings Account-i',
    transferMode: 'Funds Transfer',
    effectiveDate: new Date(),
    recipientBank: ''
  });

  // State for formatted amount display
  const [displayAmount, setDisplayAmount] = useState('');
  
  const [ctosData, setCTOSData] = useState<CTOSData>({
    name: '',
    newId: '',
    oldId: '',
    dateOfBirth: '',
    address1: '',
    address2: '',
    score: ''
  });

  // Load transfer data if editing from history
  useEffect(() => {
    const editData = safeLocalStorage.getJSON<any>('editTransferData');
    if (editData) {
      try {
        const updatedData = {
          ...editData,
          date: new Date(editData.date),
          effectiveDate: new Date(editData.effective_date || editData.effectiveDate),
          transactionStatus: editData.transaction_status || editData.transactionStatus,
          startingPercentage: editData.starting_percentage || editData.startingPercentage,
          transactionId: editData.transaction_id || editData.transactionId,
          recipientReference: editData.recipient_reference || editData.recipientReference,
          payFromAccount: editData.pay_from_account || editData.payFromAccount,
          transferMode: editData.transfer_mode || editData.transferMode,
          recipientBank: editData.recipient_bank || editData.recipientBank
        };
        setTransferData(updatedData);
        
        // Format the amount for display
        if (updatedData.amount) {
          setDisplayAmount(formatCurrencyInput(`RM${updatedData.amount}`));
        }
        
        // Clear the edit data after loading
        safeLocalStorage.removeItem('editTransferData');
      } catch (error) {
        console.error('Error loading edit transfer data:', error);
      }
    }
  }, []);

  // Handle amount input changes with currency formatting
  const handleAmountChange = (value: string) => {
    // Format the input for display
    const formattedDisplay = formatCurrencyInput(value);
    setDisplayAmount(formattedDisplay);
    
    // Extract numerical value for internal storage
    const numericValue = parseCurrency(formattedDisplay);
    setTransferData({...transferData, amount: numericValue.toString()});
  };

  const handleGenerate = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsGenerating(true);
    
    try {
      if (activeForm === 'transfer') {
        // Validate transfer form data
        const amountValidation = validateTransferAmount(transferData.amount);
        if (!amountValidation.isValid) {
          alert(amountValidation.message);
          setIsGenerating(false);
          return;
        }

        const accountValidation = validateAccountNumber(transferData.account);
        if (!accountValidation.isValid) {
          alert(accountValidation.message);
          setIsGenerating(false);
          return;
        }

        const nameValidation = validateRecipientName(transferData.name);
        if (!nameValidation.isValid) {
          alert(nameValidation.message);
          setIsGenerating(false);
          return;
        }

        const refValidation = validateReference(transferData.recipientReference);
        if (!refValidation.isValid) {
          alert(refValidation.message);
          setIsGenerating(false);
          return;
        }

        if (!transferData.bank) {
          alert('Please select a bank');
          setIsGenerating(false);
          return;
        }

        // Sanitize data before storing and sending
        const sanitizedTransferData = sanitizeTransferData(transferData);

        try {
          // Save transfer to history
          await addTransfer(sanitizedTransferData);
          
          // Store transfer data in localStorage to access on loading page
          safeLocalStorage.setJSON('transferData', sanitizedTransferData);
          
          // Navigate to Maybank-specific page if Maybank is selected
          if (sanitizedTransferData.bank === 'Malayan Banking Berhad (Maybank)') {
            navigate('/maybank-transfer');
          } else {
            navigate('/transfer-loading');
          }
        } catch (error) {
          console.error('Error saving transfer:', error);
          // Still navigate even if saving fails
          safeLocalStorage.setJSON('transferData', sanitizedTransferData);
          
          if (sanitizedTransferData.bank === 'Malayan Banking Berhad (Maybank)') {
            navigate('/maybank-transfer');
          } else {
            navigate('/transfer-loading');
          }
        }
      } else {
        // Validate CTOS form data
        if (!ctosData.name.trim()) {
          alert('Please enter a name');
          setIsGenerating(false);
          return;
        }

        if (!ctosData.newId.trim()) {
          alert('Please enter a new IC number');
          setIsGenerating(false);
          return;
        }

        // Sanitize CTOS data
        const sanitizedCTOSData = sanitizeTransferData(ctosData);
        
        // Store CTOS data in localStorage to access on report page
        safeLocalStorage.setJSON('ctosData', sanitizedCTOSData);
        navigate('/ctos-report');
      }
    } catch (error) {
      console.error('Error generating:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent double clicks
    
    setIsLoggingOut(true);
    try {
      // Clear sensitive data from localStorage
      safeLocalStorage.removeItem('transferData');
      safeLocalStorage.removeItem('ctosData');
      safeLocalStorage.removeItem('editTransferData');
      
      await logout();
      navigate('/auth', { replace: true });
    } catch (error) {
      console.error('Error during logout:', error);
      // Force navigation even if logout fails
      navigate('/auth', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isFormValid = () => {
    if (activeForm === 'transfer') {
      // Only check required fields: Transfer Bank, Transferer Name, Transfer Amount, Bank Account Number, Transaction Status
      const baseValid = transferData.bank && 
             transferData.name && 
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

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Top Navigation */}
          <div className="flex items-center justify-between">
            {activeForm === 'transfer' && (
              <Button
                variant="outline"
                onClick={() => navigate('/transfer-history')}
                className="flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                History
              </Button>
            )}
            {activeForm !== 'transfer' && <div />}
            
            {/* User Info and Logout */}
            {user && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {user.name}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="h-8 w-8"
                >
                  {isLoggingOut ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
          {/* Toggle Button */}
          <div className="flex items-center justify-center mb-8">
            <Button
              variant="outline"
              onClick={() => setActiveForm(activeForm === 'transfer' ? 'ctos' : 'transfer')}
              className="flex items-center gap-2 h-12 px-6"
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
                <Building2 className="h-8 w-8 text-foreground" />
              ) : (
                <FileText className="h-8 w-8 text-foreground" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {activeForm === 'transfer' ? 'Payment Transfer' : 'CTOS Report'}
            </h1>
            <p className="text-muted-foreground">
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
                  <Label htmlFor="bank" className="text-sm font-medium text-foreground">
                    Transfer Bank <span className="text-destructive">*</span>
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
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Transferer Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={transferData.name}
                    onChange={(e) => setTransferData({...transferData, name: e.target.value})}
                    placeholder="Enter your full name"
                    className="h-12"
                  />
                </div>

                {/* Transaction ID - Hidden for Maybank */}
                {transferData.bank !== 'Malayan Banking Berhad (Maybank)' && (
                  <div className="space-y-2">
                    <Label htmlFor="transactionId" className="text-sm font-medium text-foreground">
                      Transaction ID
                    </Label>
                    <Input
                      id="transactionId"
                      value={transferData.transactionId}
                      onChange={(e) => setTransferData({...transferData, transactionId: e.target.value})}
                      placeholder="TXN240805AB123456"
                      className="h-12"
                    />
                  </div>
                )}

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Transfer Date
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
                    <Label htmlFor="time" className="text-sm font-medium text-foreground">
                      Transfer Time
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
                  <Label htmlFor="type" className="text-sm font-medium text-foreground">
                    Transfer Type
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
                  <Label htmlFor="status" className="text-sm font-medium text-foreground">
                    Transaction Status <span className="text-destructive">*</span>
                  </Label>
                  <Select value={transferData.transactionStatus} onValueChange={(value) => setTransferData({...transferData, transactionStatus: value, startingPercentage: value === 'Processing' ? transferData.startingPercentage : ''})}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select transaction status" />
                    </SelectTrigger>
                    <SelectContent>
                      {transferData.bank === 'Malayan Banking Berhad (Maybank)' ? (
                        <SelectItem value="Processing" className="py-3">Processing</SelectItem>
                      ) : (
                        <>
                          <SelectItem value="Cancelled" className="py-3">Cancelled</SelectItem>
                          <SelectItem value="Processing" className="py-3">Processing</SelectItem>
                          <SelectItem value="Successful" className="py-3">Successful</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Starting Percentage - Only show for Processing */}
                {transferData.transactionStatus === 'Processing' && (
                  <div className="space-y-2">
                    <Label htmlFor="percentage" className="text-sm font-medium text-foreground">
                      Starting Percentage
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
                  <Label htmlFor="account" className="text-sm font-medium text-foreground">
                    Bank Account Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="account"
                    value={transferData.account}
                    onChange={(e) => setTransferData({...transferData, account: e.target.value.replace(/\D/g, '')})}
                    placeholder="Enter account number (numbers only)"
                    className="h-12"
                  />
                </div>

                {/* Recipient's Bank */}
                <div className="space-y-2">
                  <Label htmlFor="recipientBank" className="text-sm font-medium text-foreground">
                    Recipient's Bank
                  </Label>
                  <Select value={transferData.recipientBank} onValueChange={(value) => setTransferData({...transferData, recipientBank: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select recipient's bank" />
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

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                    Transfer Amount <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="amount"
                    value={displayAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="RM0.00"
                    className="h-12"
                  />
                </div>

                {/* Recipient Reference */}
                <div className="space-y-2">
                  <Label htmlFor="recipientReference" className="text-sm font-medium text-gray-900">
                    Recipient Reference
                  </Label>
                  <Input
                    id="recipientReference"
                    value={transferData.recipientReference}
                    onChange={(e) => setTransferData({...transferData, recipientReference: e.target.value})}
                    placeholder="Optional reference note"
                    className="h-12"
                  />
                </div>

                {/* Pay From Account */}
                <div className="space-y-2">
                  <Label htmlFor="payFromAccount" className="text-sm font-medium text-foreground">
                    Pay From Account
                  </Label>
                  <Select value={transferData.payFromAccount} onValueChange={(value) => setTransferData({...transferData, payFromAccount: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {payFromAccounts.map((account) => (
                        <SelectItem key={account} value={account} className="py-3">
                          {account}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transfer Mode */}
                <div className="space-y-2">
                  <Label htmlFor="transferMode" className="text-sm font-medium text-foreground">
                    Transfer Mode
                  </Label>
                  <Select value={transferData.transferMode} onValueChange={(value) => setTransferData({...transferData, transferMode: value})}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select transfer mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {transferModes.map((mode) => (
                        <SelectItem key={mode} value={mode} className="py-3">
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Effective Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Effective Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "h-12 justify-start text-left font-normal",
                          !transferData.effectiveDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {transferData.effectiveDate ? format(transferData.effectiveDate, "dd/MM/yyyy") : <span>Pick effective date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={transferData.effectiveDate}
                        onSelect={(date) => date && setTransferData({...transferData, effectiveDate: date})}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            ) : (
              <>
                {/* CTOS Form Fields */}
                <div className="space-y-2">
                  <Label htmlFor="ctosName" className="text-sm font-medium text-foreground">
                    Name (Your input) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ctosName"
                    value={ctosData.name}
                    onChange={(e) => setCTOSData({...ctosData, name: e.target.value})}
                    placeholder="SING WEI LOON"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newId" className="text-sm font-medium text-foreground">
                    New ID / Old ID (Your input) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="newId"
                    value={ctosData.newId}
                    onChange={(e) => setCTOSData({...ctosData, newId: e.target.value})}
                    placeholder="950206015427 /-"
                    className="h-12"
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
                    placeholder="06-02-1995"
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
                    placeholder="NO. 49, JALAN IMPIAN EMAS 68, TAMAN IMPIAN EMAS, MALAYSIA, 81300 SKUDAI, JOHOR"
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
                    placeholder="Optional address"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="score" className="text-sm font-medium text-gray-900">
                    Credit Score (300-850) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="score"
                    type="number"
                    min="300"
                    max="850"
                    value={ctosData.score}
                    onChange={(e) => setCTOSData({...ctosData, score: e.target.value})}
                    placeholder="457"
                    className="h-12 border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              </>
            )}

            {/* Generate Button */}
            <Button 
              onClick={handleGenerate}
              disabled={!isFormValid() || isGenerating}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:hover:bg-gray-900"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Generating...
                </>
              ) : activeForm === 'transfer' ? (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Generate Transfer
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Generate Report
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Right side - Background Image (Hidden on mobile) */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-orange-200 via-purple-200 to-blue-300 relative overflow-hidden">
        <img 
          src="/lovable-uploads/c89bdd41-48aa-430e-ac63-da848e1e15cc.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Index;
