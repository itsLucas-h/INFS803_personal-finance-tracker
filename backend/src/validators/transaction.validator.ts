import { z } from 'zod';

export const createTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be a positive number'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
});

export const updateTransactionSchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().optional(),
  amount: z.number().positive().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
});
