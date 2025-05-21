import { z } from 'zod';

export const createBudgetSchema = z.object({
  month: z
    .string()
    .min(1, 'Month is required')
    .regex(/^[0-9]{4}-[0-9]{2}$/, 'Month must be in YYYY-MM format'),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be a positive number'),
  description: z.string().optional(),
});

export const updateBudgetSchema = z.object({
  month: z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}$/, 'Month must be in YYYY-MM format')
    .optional(),
  category: z.string().optional(),
  amount: z.number().positive().optional(),
  description: z.string().optional(),
});
