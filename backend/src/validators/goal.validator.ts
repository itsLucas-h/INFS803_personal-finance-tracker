import { z } from 'zod';

export const createGoalSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    targetAmount: z.number().positive('Target amount must be a positive number'),
    deadline: z.string().optional(), // ISO date string
  }),
});

export const updateGoalSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    targetAmount: z.number().positive().optional(),
    currentAmount: z.number().min(0, 'Current amount cannot be negative').optional(),
    deadline: z.string().optional(),
  }),
});
