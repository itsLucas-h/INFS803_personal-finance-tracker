import React, { useState } from 'react';
import { TransactionData } from './TransactionForm';
import { TransactionForm } from './TransactionForm';
import { transactionService } from '@/services/transactionService';

interface Transaction extends TransactionData {
  id: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onTransactionUpdate: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onTransactionUpdate 
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        setIsLoading(true);
        await transactionService.deleteTransaction(id);
        onTransactionUpdate();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdate = async (transaction: TransactionData) => {
    if (!editingTransaction) return;
    
    try {
      setIsLoading(true);
      await transactionService.updateTransaction(editingTransaction.id, transaction);
      setEditingTransaction(null);
      onTransactionUpdate();
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {editingTransaction && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit Transaction</h2>
          <TransactionForm
            onSubmit={handleUpdate}
            isLoading={isLoading}
            initialData={editingTransaction}
            isEditing={true}
          />
        </div>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="max-w-[200px] truncate" title={transaction.description}>
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {transaction.category}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatAmount(transaction.amount)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}; 