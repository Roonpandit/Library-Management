import { useState } from 'react';
import { api } from '../services/api';
import type { Bill } from '../types';

export const useBillGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);

  const generateBill = async (borrowId: string, lateFee?: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data } = await api.put(`/borrow/${borrowId}/bill`, {
        borrowId,
        lateFee: lateFee || 5 // Default late fee if not provided
      });
      
      setBill(data.bill);
      return data.bill;
    } catch (err) {
      console.error('Error generating bill:', err);
      setError('Failed to generate bill. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    generateBill,
    loading,
    error,
    bill
  };
}; 