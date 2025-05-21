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
  onEditStart: () => void;
  onEditEnd: () => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  onTransactionUpdate,
  onEditStart,
  onEditEnd
}) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedDescriptionId, setExpandedDescriptionId] = useState<string | null>(null);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    onEditStart();
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
      onEditEnd();
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

  const toggleDescription = (id: string) => {
    setExpandedDescriptionId(expandedDescriptionId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {editingTransaction && (
        <div className="mb-6 relative">
          <button
            onClick={() => {
              setEditingTransaction(null);
              onEditEnd();
            }}
            className="absolute -top-2 -right-2 text-red-600 hover:text-red-800 focus:outline-none"
            aria-label="Cancel editing"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold mb-4 text-gray-600">Edit Transaction</h2>
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
                    <button
                      onClick={() => toggleDescription(transaction.id)}
                      className={`text-left hover:text-blue-600 focus:outline-none focus:text-blue-600 ${
                        expandedDescriptionId === transaction.id ? 'whitespace-normal break-words' : 'max-w-[200px] truncate'
                      }`}
                      title={expandedDescriptionId === transaction.id ? "Click to collapse" : "Click to expand"}
                    >
                      {transaction.description}
                    </button>
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