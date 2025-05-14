import { useState, useEffect } from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { TransactionForm, TransactionData } from '@/components/transaction';
import { transactionService } from '@/services/transactionService';
import { withAuth } from "@/components/auth/withAuth";

interface Transaction extends TransactionData {
  id: string;
  createdAt: string;
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getTransactions();
      setTransactions(response.transactions || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (transaction: TransactionData) => {
    try {
      const response = await transactionService.createTransaction(transaction);
      setTransactions(prev => [...prev, response.transaction]);
      setError(null);
    } catch (err) {
      setError('Failed to create transaction');
      console.error('Error creating transaction:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete transaction');
      console.error('Error deleting transaction:', err);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <h1 className="text-gray-600 text-2xl font-bold">Transactions</h1>
        <p className="text-gray-600">
          Here you can view and manage your transactions.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <TransactionForm onSubmit={handleSubmit} />

      {loading ? (
        <div className="mt-8 text-center">Loading transactions...</div>
      ) : (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()} - {transaction.category}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default withAuth(TransactionsPage);