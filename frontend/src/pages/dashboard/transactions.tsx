import { useState, useEffect } from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { TransactionForm, TransactionList, TransactionData } from '@/components/transaction';
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
  const [isEditing, setIsEditing] = useState(false);

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

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditEnd = () => {
    setIsEditing(false);
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

      {!isEditing && (
        <TransactionForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      )}

      {loading ? (
        <div className="mt-8 text-center">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          No transactions found. Add your first transaction above.
        </div>
      ) : (
        <div className="mt-8">
          <TransactionList 
            transactions={transactions} 
            onTransactionUpdate={fetchTransactions}
            onEditStart={handleEditStart}
            onEditEnd={handleEditEnd}
          />
        </div>
      )}
    </DashboardLayout>
  );
}

export default TransactionsPage;