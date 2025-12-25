import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTransferHistory } from '@/hooks/useTransferHistory';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, CreditCard, Trash2, Building2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { safeLocalStorage } from '@/utils/storage';
import { formatCurrency } from '@/utils/currency';
import { decodeHtml } from '@/utils/sanitization';

const TransferHistory = () => {
  const { transfers, deleteTransfer, isLoading: transfersLoading } = useTransferHistory();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewTransfer = (transfer: any) => {
    // Store the transfer data to be loaded in the main form with proper field mapping
    const mappedTransfer = {
      ...transfer,
      transactionStatus: transfer.transaction_status,
      startingPercentage: transfer.starting_percentage,
      transactionId: transfer.transaction_id,
      recipientReference: transfer.recipient_reference,
      payFromAccount: transfer.pay_from_account,
      transferMode: transfer.transfer_mode,
      effectiveDate: transfer.effective_date,
      recipientBank: transfer.recipient_bank
    };
    safeLocalStorage.setJSON('editTransferData', mappedTransfer);
    navigate('/');
  };

  const handleDeleteTransfer = async (transferId: string) => {
    if (confirm('Are you sure you want to delete this transfer from history?')) {
      setDeletingId(transferId);
      try {
        await deleteTransfer(transferId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const formatAmount = (amount: string, currency: string) => {
    // Use our new currency formatting utility
    return formatCurrency(amount);
  };

  // Show loading spinner
  if (transfersLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading transfer history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Transfer History</h1>
            <p className="text-muted-foreground">
              {transfers.length} transfer{transfers.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Empty State */}
        {transfers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No transfers found</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't created any transfers yet. Start by creating your first transfer.
              </p>
              <Button onClick={() => navigate('/')}>
                Create Transfer
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Transfer List */
          <div className="space-y-4">
            {transfers.map((transfer) => (
              <Card key={transfer.id} className="hover:shadow-md transition-shadow cursor-pointer group">
                <div onClick={() => handleViewTransfer(transfer)}>
                  <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{decodeHtml(transfer.bank)}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {format(transfer.created_at, 'PPP')}
                          {transfer.time && (
                            <>
                              <Clock className="h-3 w-3 ml-2" />
                              {transfer.time}
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(transfer.transaction_status)}
                      >
                        {transfer.transaction_status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTransfer(transfer);
                        }}
                        className="text-primary hover:text-primary hover:bg-primary/10"
                        title="View Transfer"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTransfer(transfer.id);
                        }}
                        disabled={deletingId === transfer.id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
                        title="Delete Transfer"
                      >
                        {deletingId === transfer.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Transferer:</span>
                      <p className="text-foreground">{decodeHtml(transfer.name)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Amount:</span>
                      <p className="text-foreground font-semibold">
                        {formatAmount(transfer.amount, transfer.currency)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Account:</span>
                      <p className="text-foreground font-mono">{transfer.account}</p>
                    </div>
                    {transfer.type && (
                      <div>
                        <span className="font-medium text-muted-foreground">Type:</span>
                        <p className="text-foreground">{decodeHtml(transfer.type)}</p>
                      </div>
                    )}
                    {transfer.recipient_bank && (
                      <div>
                        <span className="font-medium text-muted-foreground">Recipient Bank:</span>
                        <p className="text-foreground">{decodeHtml(transfer.recipient_bank)}</p>
                      </div>
                    )}
                    {transfer.transaction_id && (
                      <div>
                        <span className="font-medium text-muted-foreground">Transaction ID:</span>
                        <p className="text-foreground font-mono">{decodeHtml(transfer.transaction_id)}</p>
                      </div>
                    )}
                  </div>
                  
                  {transfer.recipient_reference && (
                    <div className="pt-2 border-t">
                      <span className="font-medium text-muted-foreground">Reference:</span>
                      <p className="text-foreground">{decodeHtml(transfer.recipient_reference)}</p>
                    </div>
                  )}
                  
                  {transfer.transaction_status === 'Processing' && transfer.starting_percentage && (
                    <div className="pt-2 border-t">
                      <span className="font-medium text-muted-foreground">Progress:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${transfer.starting_percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {transfer.starting_percentage}%
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t flex items-center justify-between">
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      Click to view and edit this transfer
                    </span>
                    <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardContent>
              </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferHistory;