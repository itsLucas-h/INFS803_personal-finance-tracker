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

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const budgetService = {
  async getBudgets(): Promise<BudgetResponse[]> {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to fetch budgets");
      }
      const data = await response.json();
      return data.budgets;
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  },

  async createBudget(budgetData: BudgetData): Promise<BudgetResponse> {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(budgetData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create budget");
      }
      const data = await response.json();
      return data.budget;
    } catch (error) {
      console.error('Error creating budget:', error);
      throw error;
    }
  },

  async deleteBudget(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete budget");
      }
      return;
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  },
}; 