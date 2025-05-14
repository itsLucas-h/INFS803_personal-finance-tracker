import { TransactionData } from '@/components/transaction';

const API_URL = 'http://localhost:5000/api/transactions';

const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const transactionService = {
  async createTransaction(transaction: TransactionData) {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      console.log('Sending request to:', `${API_URL}`);
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ body: transaction }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create transaction');
      }

      return response.json();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error('Network error: Please check if the backend server is running');
    }
  },

  async getTransactions() {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      console.log('Fetching from:', `${API_URL}`);
      const response = await fetch(`${API_URL}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to fetch transactions');
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Network error: Please check if the backend server is running');
    }
  },

  async deleteTransaction(id: string) {
    try {
      const token = getAuthToken();
      if (!token) throw new Error('Not authenticated');

      console.log('Deleting transaction:', `${API_URL}/${id}`);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete transaction');
      }

      return response.json();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error('Network error: Please check if the backend server is running');
    }
  }
}; 