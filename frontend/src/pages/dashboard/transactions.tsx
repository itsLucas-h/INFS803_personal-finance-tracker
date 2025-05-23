import { useState, useEffect } from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { transactionService } from '@/services/transactionService';

interface TransactionData {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

interface Transaction extends TransactionData {
  id: string;
  createdAt: string;
}

const STYLES = {
  input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400",
  label: "block text-sm font-medium text-gray-700 mb-1",
  button: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  deleteButton: "text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
} as const;

const CATEGORIES = [
  'Food',
  'Rent',
  'Transport',
  'Health',
  'Entertainment',
  'Utilities',
  'Savings',
  'Salary',
  'Freelance',
  'Investments',
  'Gifts',
  'Other',
];

const getTransactionData = (entry?: TransactionData): TransactionData => ({
  amount: entry?.amount || 0,
  description: entry?.description || '',
  category: entry?.category || '',
  date: entry?.date || new Date().toISOString().split('T')[0],
  type: entry?.type || 'expense',
});

const TransactionForm: React.FC<{
  onSubmit: (transaction: TransactionData) => void;
  isLoading?: boolean;
  initialData?: TransactionData;
  isEditing?: boolean;
}> = ({ onSubmit, isLoading = false, initialData, isEditing = false }) => {
  const [formData, setFormData] = useState<TransactionData>(getTransactionData(initialData));
  const [errors, setErrors] = useState<Partial<Record<keyof TransactionData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (!isEditing) {
      setFormData(getTransactionData());
    }
  }, [initialData, isEditing]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TransactionData, string>> = {};
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!isEditing) {
        setFormData(getTransactionData());
      }
      setErrors({});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm mb-8">
      <div className="mb-4">
        <label htmlFor="type" className={STYLES.label}>Transaction Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className={STYLES.input}
          required
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className={STYLES.label}>Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className={STYLES.input}
          required
          min="0.01"
          step="0.01"
          placeholder="0.00"
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="description" className={STYLES.label}>Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={STYLES.input}
          placeholder="Enter transaction description"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="category" className={STYLES.label}>Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={STYLES.input}
          required
        >
          <option value="">Select a category</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="date" className={STYLES.label}>Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={STYLES.input}
          required
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
      </div>
      <button type="submit" className={STYLES.button} disabled={isLoading}>
        {isLoading ? 'Saving...' : isEditing ? 'Update Transaction' : 'Add Transaction'}
      </button>
    </form>
  );
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
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

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditingTransaction(null);
    setIsEditing(false);
  };

  const handleUpdate = async (updatedTransaction: TransactionData) => {
    if (!editingTransaction) return;
    try {
      await transactionService.updateTransaction(editingTransaction.id, updatedTransaction);
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? { ...t, ...updatedTransaction } : t));
      setEditingTransaction(null);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update transaction');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.deleteTransaction(id);
        setTransactions(transactions.filter(t => t.id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete transaction');
        console.error('Error deleting transaction:', err);
      }
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

      {!isEditing && (
        <TransactionForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      )}

      {isEditing && editingTransaction && (
        <div className="mb-6 relative max-w-md mx-auto">
          <button
            onClick={handleEditCancel}
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
            isLoading={false}
            initialData={getTransactionData(editingTransaction)}
            isEditing={true}
          />
        </div>
      )}

      {loading ? (
        <div className="mt-8 text-center">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="mt-8 text-center text-gray-500">
          No transactions found. Add your first transaction above.
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Transactions</h2>
          <div className="space-y-6">
            {transactions.map((entry) => (
              <div key={entry.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium text-gray-800">{entry.category}</span>
                    <span className="ml-2 text-gray-500 text-sm">{entry.type === 'income' ? 'Income' : 'Expense'}</span>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleEdit(entry)}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed mr-2 px-3 py-1 text-sm"
                      disabled={isEditing}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-gray-800">{entry.description}</div>
                    <div className="text-gray-500 text-sm">{new Date(entry.date).toLocaleDateString()}</div>
                  </div>
                  <div className={`font-medium text-lg ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}