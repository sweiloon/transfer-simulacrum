import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeTransferData, validateTransferAmount } from '@/utils/sanitization';

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
    if (!user) return;
    
    setIsLoading(true);
    try {
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
        console.error('Error loading transfer history:', result.error);
        return;
      }

      if (result?.data) {
        const formattedTransfers = result.data.map((transfer: any) => ({
          ...transfer,
          date: new Date(transfer.date),
          effective_date: new Date(transfer.effective_date),
          created_at: new Date(transfer.created_at)
        }));
        setTransfers(formattedTransfers);
      }
    } catch (error) {
      console.error('Error loading transfer history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransfer = async (transferData: any) => {
    if (!user) return null;

    try {
      // Validate transfer amount
      const amountValidation = validateTransferAmount(transferData.amount);
      if (!amountValidation.isValid) {
        console.error('Invalid transfer amount:', amountValidation.message);
        return null;
      }

      // Sanitize transfer data
      const sanitizedData = sanitizeTransferData(transferData);

      const newTransfer = {
        user_id: user.id,
        bank: sanitizedData.bank,
        name: sanitizedData.name,
        date: sanitizedData.date,
        time: sanitizedData.time,
        type: sanitizedData.type,
        account: sanitizedData.account,
        amount: sanitizedData.amount,
        currency: sanitizedData.currency,
        transaction_status: sanitizedData.transactionStatus,
        starting_percentage: sanitizedData.startingPercentage,
        transaction_id: sanitizedData.transactionId,
        recipient_reference: sanitizedData.recipientReference,
        pay_from_account: sanitizedData.payFromAccount,
        transfer_mode: sanitizedData.transferMode,
        effective_date: sanitizedData.effectiveDate,
        recipient_bank: sanitizedData.recipientBank
      };

      const { data, error } = await supabase
        .from('transfer_history')
        .insert([newTransfer])
        .select()
        .single();

      if (error) {
        console.error('Error saving transfer:', error);
        return null;
      }

      if (data) {
        const formattedTransfer = {
          ...data,
          date: new Date(data.date),
          effective_date: new Date(data.effective_date),
          created_at: new Date(data.created_at)
        };
        setTransfers(prev => [formattedTransfer, ...prev]);
        return data.id;
      }

      return null;
    } catch (error) {
      console.error('Error saving transfer:', error);
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