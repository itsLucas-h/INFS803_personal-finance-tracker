export interface BudgetData {
  month: string;
  amount: number;
  category: string;
}

export interface BudgetResponse {
  id: string;
  month: string;
  amount: number;
  category: string;
  createdAt: string;
  updatedAt: string;
} 