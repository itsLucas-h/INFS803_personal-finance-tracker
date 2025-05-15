import { useState, useEffect } from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { TransactionForm, TransactionData } from '@/components/transaction';
import { transactionService } from '@/services/transactionService';

interface Transaction extends TransactionData {
  id: string;
  createdAt: string;
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getTransactions();
      setTransactions(data || []);
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
      setIsSubmitting(true);
      const newTransaction = await transactionService.createTransaction(transaction);
      if (newTransaction) {
        setTransactions(prev => [...prev, newTransaction]);
        setError(null);
      }
    } catch (err) {
      setError('Failed to create transaction');
      console.error('Error creating transaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      setDeletingId(id);
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete transaction');
      console.error('Error deleting transaction:', err);
    } finally {
      setDeletingId(null);
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

      <TransactionForm onSubmit={handleSubmit} isLoading={isSubmitting} />

      {loading ? (
        <div className="mt-8 text-center">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          No transactions found. Add your first transaction above.
        </div>
      ) : (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex justify-between items-center border border-gray-100"
              >
                <div className="space-y-1">
                  <p className="font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`font-medium whitespace-nowrap ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deletingId === transaction.id}
                    aria-label="Delete transaction"
                  >
                    {deletingId === transaction.id ? (
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
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

export default TransactionsPage;