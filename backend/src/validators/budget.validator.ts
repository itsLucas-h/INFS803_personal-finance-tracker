import { z } from 'zod';

export const createBudgetSchema = z.object({
  body: z.object({
    month: z.string().min(1, 'Month is required'),
    category: z.string().min(1, 'Category is required'),
    amount: z.number().positive('Amount must be a positive number'),
  }),
});

export const updateBudgetSchema = z.object({
  body: z.object({
    month: z.string().optional(),
    category: z.string().optional(),
    amount: z.number().positive().optional(),
  }),
});
