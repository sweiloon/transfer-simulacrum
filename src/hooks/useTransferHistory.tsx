import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface TransferHistoryItem {
  id: string;
  userId: string;
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
  createdAt: Date;
}

export const useTransferHistory = () => {
  const [transfers, setTransfers] = useState<TransferHistoryItem[]>([]);
  const { user } = useAuth();

  // Load transfers from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadTransfers();
    } else {
      setTransfers([]);
    }
  }, [user]);

  const loadTransfers = () => {
    if (!user) return;
    
    try {
      const savedTransfers = localStorage.getItem('transferHistory');
      if (savedTransfers) {
        const allTransfers = JSON.parse(savedTransfers);
        // Filter transfers for current user
        const userTransfers = allTransfers
          .filter((transfer: TransferHistoryItem) => transfer.userId === user.id)
          .map((transfer: any) => ({
            ...transfer,
            date: new Date(transfer.date),
            effectiveDate: new Date(transfer.effectiveDate),
            createdAt: new Date(transfer.createdAt)
          }))
          .sort((a: TransferHistoryItem, b: TransferHistoryItem) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        setTransfers(userTransfers);
      }
    } catch (error) {
      console.error('Error loading transfer history:', error);
    }
  };

  const addTransfer = (transferData: any) => {
    if (!user) return;

    try {
      const newTransfer: TransferHistoryItem = {
        ...transferData,
        id: Date.now().toString(),
        userId: user.id,
        createdAt: new Date()
      };

      // Get existing transfers from localStorage
      const existingTransfers = JSON.parse(localStorage.getItem('transferHistory') || '[]');
      
      // Add new transfer
      const updatedTransfers = [newTransfer, ...existingTransfers];
      
      // Save to localStorage
      localStorage.setItem('transferHistory', JSON.stringify(updatedTransfers));
      
      // Update local state
      setTransfers(prev => [newTransfer, ...prev]);
      
      return newTransfer.id;
    } catch (error) {
      console.error('Error saving transfer:', error);
      return null;
    }
  };

  const deleteTransfer = (transferId: string) => {
    if (!user) return;

    try {
      // Get all transfers from localStorage
      const allTransfers = JSON.parse(localStorage.getItem('transferHistory') || '[]');
      
      // Remove the transfer
      const updatedTransfers = allTransfers.filter((transfer: TransferHistoryItem) => 
        transfer.id !== transferId
      );
      
      // Save back to localStorage
      localStorage.setItem('transferHistory', JSON.stringify(updatedTransfers));
      
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