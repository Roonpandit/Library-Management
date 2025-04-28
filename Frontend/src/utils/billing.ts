import { api } from '../services/api';
import type { Bill } from '../types';

/**
 * Generate a bill for a borrowed book
 * 
 * @param borrowId - The ID of the borrow record
 * @param lateFee - Optional late fee amount
 * @returns The generated bill or null if there was an error
 */
export const generateBill = async (borrowId: string, lateFee?: number): Promise<Bill | null> => {
  try {
    const { data } = await api.put(`/borrow/${borrowId}/bill`, {
      borrowId,
      lateFee: lateFee || 5 // Default late fee if not provided
    });
    
    return data.bill;
  } catch (error) {
    console.error('Error generating bill:', error);
    return null;
  }
};

/**
 * Calculate a bill based on rental details
 * 
 * @param chargePerDay - The daily charge for the book
 * @param borrowDays - Number of days the book was borrowed
 * @param lateDays - Number of days the book is overdue
 * @param lateFeePerDay - Optional late fee per day (default: 1)
 * @returns The calculated bill
 */
export const calculateBill = (
  chargePerDay: number, 
  borrowDays: number, 
  lateDays: number = 0, 
  lateFeePerDay: number = 1
): Bill => {
  const amount = chargePerDay * borrowDays;
  const lateFee = lateDays * lateFeePerDay;
  const totalAmount = amount + lateFee;
  
  return {
    amount,
    lateFee,
    totalAmount,
    isLate: lateDays > 0
  };
}; 