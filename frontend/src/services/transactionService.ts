import { TransactionData } from "@/components/transaction";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!API_BASE_URL) throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');

const API_URL = `${API_BASE_URL}/api/transactions`;

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

export const transactionService = {
  async createTransaction(transaction: TransactionData) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create transaction");
      }

      const data = await response.json();
      return data.transaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw new Error("Could not create transaction. Please try again later.");
    }
  },

  async getTransactions() {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to fetch transactions");
      }

      const data = await response.json();
      return data.transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw new Error("Could not fetch transactions. Please try again later.");
    }
  },

  async updateTransaction(id: string, transaction: TransactionData) {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update transaction');
      }

      const data = await response.json();
      return data.transaction;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw new Error('Could not update transaction. Please try again later.');
    }
  },

  async deleteTransaction(id: string) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete transaction");
      }

      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      throw new Error("Could not delete transaction. Please try again later.");
    }
  },
};
