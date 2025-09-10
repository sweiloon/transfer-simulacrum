import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

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
    
    try {
      const { data, error } = await supabase
        .from('transfer_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading transfer history:', error);
        return;
      }

      if (data) {
        const formattedTransfers = data.map((transfer: any) => ({
          ...transfer,
          date: new Date(transfer.date),
          effective_date: new Date(transfer.effective_date),
          created_at: new Date(transfer.created_at)
        }));
        setTransfers(formattedTransfers);
      }
    } catch (error) {
      console.error('Error loading transfer history:', error);
    }
  };

  const addTransfer = async (transferData: any) => {
    if (!user) return null;

    try {
      const newTransfer = {
        user_id: user.id,
        bank: transferData.bank,
        name: transferData.name,
        date: transferData.date,
        time: transferData.time,
        type: transferData.type,
        account: transferData.account,
        amount: transferData.amount,
        currency: transferData.currency,
        transaction_status: transferData.transactionStatus,
        starting_percentage: transferData.startingPercentage,
        transaction_id: transferData.transactionId,
        recipient_reference: transferData.recipientReference,
        pay_from_account: transferData.payFromAccount,
        transfer_mode: transferData.transferMode,
        effective_date: transferData.effectiveDate,
        recipient_bank: transferData.recipientBank
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
    refreshTransfers: loadTransfers
  };
};