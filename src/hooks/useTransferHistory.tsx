import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { validateTransferAmount } from '@/utils/sanitization';

export interface TransferHistoryItem {
  id: string;
  user_id: string;
  bank: string;
  name: string;
  date: Date;
  time: string;
  type: string;
  account: string;
  amount: string;
  currency: string;
  transaction_status: string;
  starting_percentage: string;
  transaction_id: string;
  recipient_reference: string;
  pay_from_account: string;
  transfer_mode: string;
  effective_date: Date;
  recipient_bank: string;
  processing_reason: string;
  created_at: Date;
}

export const useTransferHistory = () => {
  const [transfers, setTransfers] = useState<TransferHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load transfers from Supabase when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadTransfers();
    } else {
      setTransfers([]);
    }
  }, [user]);

  const loadTransfers = async () => {
    console.log('📋 Loading transfers for user:', user?.id);
    if (!user) {
      console.log('❌ No user found, cannot load transfers');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔍 Querying Supabase for transfers...');
      const result = await Promise.race([
        supabase
          .from('transfer_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Load timeout')), 10000)
        )
      ]) as any;

      if (result?.error) {
        console.error('❌ Error loading transfer history:', result.error);
        return;
      }

      if (result?.data) {
        console.log('✅ Raw transfers from database:', result.data);
        const formattedTransfers = result.data.map((transfer: any) => ({
          ...transfer,
          date: new Date(transfer.date),
          effective_date: new Date(transfer.effective_date),
          created_at: new Date(transfer.created_at),
          processing_reason: transfer.processing_reason || ''
        }));
        console.log('✅ Formatted transfers:', formattedTransfers);

        setTransfers(formattedTransfers);
        console.log('✅ Transfers loaded and set in state');
      } else {
        console.log('ℹ️ No transfers found in database');
      }
    } catch (error) {
      console.error('❌ Exception while loading transfers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransfer = async (transferData: any) => {
    console.log('📝 addTransfer called with data:', transferData);
    console.log('👤 Current user:', user);

    if (!user) {
      console.log('❌ No user found, cannot save transfer');
      return null;
    }

    try {
      // Validate transfer amount
      const amountValidation = validateTransferAmount(transferData.amount);
      if (!amountValidation.isValid) {
        console.error('❌ Invalid transfer amount:', amountValidation.message);
        return null;
      }
      console.log('✅ Amount validation passed');

      // Note: Data should already be sanitized by the caller (Index.tsx)
      // We use the data as-is to avoid double-encoding issues
      const sanitizedData = transferData;
      console.log('📝 Transfer data received:', sanitizedData);

      // Validate required fields
      if (!sanitizedData.bank) {
        console.error('❌ Missing required field: bank');
        return null;
      }
      if (!sanitizedData.name) {
        console.error('❌ Missing required field: name');
        return null;
      }
      if (!sanitizedData.account) {
        console.error('❌ Missing required field: account');
        return null;
      }
      if (!sanitizedData.amount) {
        console.error('❌ Missing required field: amount');
        return null;
      }
      console.log('✅ Required fields validation passed');

      let newTransfer: any;
      try {
        // Format date safely
        const formatDate = (dateValue: any): string => {
          if (!dateValue) return new Date().toISOString().split('T')[0];
          if (dateValue instanceof Date) return dateValue.toISOString().split('T')[0];
          const parsedDate = new Date(dateValue);
          if (isNaN(parsedDate.getTime())) return new Date().toISOString().split('T')[0];
          return parsedDate.toISOString().split('T')[0];
        };

        const nullableString = (value: any): string | null => {
          if (typeof value !== 'string') return null;
          const trimmed = value.trim();
          return trimmed === '' ? null : trimmed;
        };

        const optionalProcessingReason = nullableString(sanitizedData.processingReason);

        newTransfer = {
          user_id: user.id,
          bank: sanitizedData.bank || '',
          name: sanitizedData.name || '',
          account: sanitizedData.account || '',
          amount: sanitizedData.amount || '',
          currency: sanitizedData.currency || 'RM',
          transaction_status: sanitizedData.transactionStatus || 'Processing',
          date: formatDate(sanitizedData.date),
          // Nullable fields - set to null if empty, not empty string
          time: nullableString(sanitizedData.time),
          type: nullableString(sanitizedData.type),
          starting_percentage: nullableString(sanitizedData.startingPercentage),
          transaction_id: nullableString(sanitizedData.transactionId),
          recipient_reference: nullableString(sanitizedData.recipientReference),
          pay_from_account: nullableString(sanitizedData.payFromAccount),
          transfer_mode: nullableString(sanitizedData.transferMode),
          effective_date: sanitizedData.effectiveDate ? formatDate(sanitizedData.effectiveDate) : null,
          recipient_bank: nullableString(sanitizedData.recipientBank),
          processing_reason: optionalProcessingReason
        };
      } catch (formatError) {
        console.error('❌ Error formatting transfer data:', formatError);
        console.log('📝 Sanitized data that caused formatting error:', sanitizedData);
        return null;
      }

      console.log('💾 Attempting to insert to Supabase:', newTransfer);

      const { data, error } = await supabase
        .from('transfer_history')
        .insert([newTransfer])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error:', error);
        if (typeof error.message === 'string' && error.message.toLowerCase().includes('processing_reason')) {
          console.error('ℹ️ processing_reason column is missing from the transfer_history table.');
          console.info('➡️ To add it, run the Supabase migration in this repo or execute:');
          console.info('   ALTER TABLE public.transfer_history ADD COLUMN processing_reason TEXT;');
        }
        return null;
      }

      if (data) {
        console.log('✅ Transfer saved to database:', data);
        const formattedTransfer = {
          ...data,
          date: new Date(data.date),
          effective_date: new Date(data.effective_date),
          created_at: new Date(data.created_at),
          processing_reason: data.processing_reason || ''
        };
        setTransfers(prev => [formattedTransfer, ...prev]);
        console.log('✅ Transfer added to local state');
        return data.id;
      }

      console.log('❌ No data returned from Supabase');
      return null;
    } catch (error) {
      console.error('❌ Exception in addTransfer:', error);
      return null;
    }
  };

  const deleteTransfer = async (transferId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('transfer_history')
        .delete()
        .eq('id', transferId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting transfer:', error);
        return;
      }

      // Update local state
      setTransfers(prev => prev.filter(transfer => transfer.id !== transferId));
    } catch (error) {
      console.error('Error deleting transfer:', error);
    }
  };

  const getTransferById = (transferId: string): TransferHistoryItem | undefined => {
    return transfers.find(transfer => transfer.id === transferId);
  };

  return { 
    transfers, 
    addTransfer, 
    deleteTransfer, 
    getTransferById,
    refreshTransfers: loadTransfers,
    isLoading
  };
};
