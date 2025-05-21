export interface BudgetData {
  month: string;
  amount: number;
  category: string;
  description?: string;
}

export interface BudgetResponse {
  id: string;
  month: string;
  amount: number;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
} 