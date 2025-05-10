import { TransactionData } from '@/components/transaction';

const API_URL = 'http://localhost:5000/api/transactions';

// Temporary development token - REMOVE IN PRODUCTION
const DEV_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const transactionService = {
  async createTransaction(transaction: TransactionData) {
    try {
      console.log('Sending request to:', `${API_URL}`);
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEV_TOKEN}`
        },
        body: JSON.stringify(transaction),
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
      console.log('Fetching from:', `${API_URL}`);
      const response = await fetch(`${API_URL}`, {
        headers: {
          'Authorization': `Bearer ${DEV_TOKEN}`
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
      console.log('Deleting transaction:', `${API_URL}/${id}`);
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${DEV_TOKEN}`
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