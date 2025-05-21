import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/budgets`;

interface BudgetData {
  month: string;
  amount: number;
  category: string;
  description?: string;
}

interface BudgetResponse {
  id: string;
  month: string;
  amount: number;
  category: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const budgetService = {
  async getBudgets(): Promise<BudgetResponse[]> {
    try {
      const response = await axios.get<{ budgets: BudgetResponse[] }>(API_URL, { headers: getAuthHeaders() });
      return response.data.budgets;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  },

  async createBudget(budgetData: BudgetData): Promise<BudgetResponse> {
    try {
      const response = await axios.post<{ budget: BudgetResponse }>(API_URL, budgetData, { headers: getAuthHeaders() });
      return response.data.budget;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  },

  async deleteBudget(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },
}; 