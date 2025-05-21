import { BudgetData, BudgetResponse } from "@/components/budget";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/budgets`;

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
  async createBudget(budget: BudgetData) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(budget),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create budget");
      }

      const data = await response.json();
      return data.budget;
    } catch (error) {
      console.error("Error creating budget:", error);
      throw new Error("Could not create budget. Please try again later.");
    }
  },

  async getBudgets() {
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
      console.error("Error fetching budgets:", error);
      throw new Error("Could not fetch budgets. Please try again later.");
    }
  },

  async deleteBudget(id: string) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete budget");
      }

      return true;
    } catch (error) {
      console.error("Error deleting budget:", error);
      throw new Error("Could not delete budget. Please try again later.");
    }
  },

  async updateBudget(id: string, budget: BudgetData) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(budget),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update budget");
      }
      const data = await response.json();
      return data.budget;
    } catch (error) {
      console.error("Error updating budget:", error);
      throw new Error("Could not update budget. Please try again later.");
    }
  },
}; 