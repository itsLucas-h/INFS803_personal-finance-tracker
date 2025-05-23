import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { budgetService } from '@/services/budgetService';

interface BudgetEntry {
  id: string;
  month: string;
  amount: number;
  category?: string;
}

interface BudgetData {
  month: string;
  amount: number;
  category: string;
}

const STYLES = {
  input: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400",
  label: "block text-sm font-medium text-gray-700 mb-1",
  button: "w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
  deleteButton: "text-red-600 hover:text-red-800 transition-colors p-2 rounded-full hover:bg-red-50"
} as const;

// Format month string from YYYY-MM to Month YYYY
const formatMonth = (monthStr: string): string => {
  const [year, month] = monthStr.split('-');
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
};

// Pass categories as a prop to BudgetForm and ensure category is always a string
const getBudgetData = (entry?: BudgetEntry): BudgetData => ({
  month: entry?.month || new Date().toISOString().slice(0, 7),
  amount: entry?.amount || 0,
  category: entry?.category || '',
});

// Inline BudgetForm component
const BudgetForm: React.FC<{
  onSubmit: (budget: BudgetData) => void;
  isLoading?: boolean;
  initialData?: BudgetData;
  isEditing?: boolean;
  categories: string[];
}> = ({ onSubmit, isLoading = false, initialData, isEditing = false, categories }) => {
  const [formData, setFormData] = useState<BudgetData>({
    month: initialData?.month || new Date().toISOString().slice(0, 7),
    amount: initialData?.amount || 0,
    category: initialData?.category || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof BudgetData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else if (!isEditing) {
      setFormData({
        month: new Date().toISOString().slice(0, 7),
        amount: 0,
        category: '',
      });
    }
  }, [initialData, isEditing]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BudgetData, string>> = {};
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.month) newErrors.month = 'Month is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      if (!isEditing) {
        setFormData({
          month: new Date().toISOString().slice(0, 7),
          amount: 0,
          category: '',
        });
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
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className={STYLES.label}>Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`${STYLES.input} pl-7`}
            required
            min="0.01"
            step="0.01"
            placeholder="0.00"
          />
        </div>
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
      </div>
      <div className="mb-6">
        <label htmlFor="month" className={STYLES.label}>Month</label>
        <input
          type="month"
          id="month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          className={STYLES.input}
          required
        />
        {errors.month && <p className="mt-1 text-sm text-red-600">{errors.month}</p>}
      </div>
      <button type="submit" className={STYLES.button} disabled={isLoading}>
        {isLoading ? 'Saving...' : isEditing ? 'Update Budget' : 'Add Budget'}
      </button>
    </form>
  );
};

export default function BudgetsPage() {
  const categories = [
    'Food',
    'Rent',
    'Transport',
    'Health',
    'Entertainment',
    'Utilities',
    'Savings',
  ];
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBudget, setEditingBudget] = useState<BudgetEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await budgetService.getBudgets();
      setBudgets(data || []);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch budgets';
      setError(errorMessage);
      console.error('Error fetching budgets:', error);
    }
  };

  const handleSubmit = async (budgetData: BudgetData) => {
    setFormError(null);

    if (!budgetData.category) {
      setFormError("Please select a category.");
      return;
    }
    if (budgetData.amount <= 0) {
      setFormError("Amount must be greater than 0.");
      return;
    }

    try {
      if (editingId) {
        // Edit mode
        const updatedBudget = await budgetService.updateBudget(editingId, budgetData);
        setBudgets(budgets.map(b => b.id === editingId ? updatedBudget : b));
        setEditingId(null);
      } else {
        // Create mode
        const newBudget = await budgetService.createBudget(budgetData);
        setBudgets([...budgets, newBudget]);
      }
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save budget';
      setError(errorMessage);
      console.error('Error saving budget:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget entry?')) {
      try {
        await budgetService.deleteBudget(id);
        setBudgets(budgets.filter(b => b.id !== id));
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete budget';
        setError(errorMessage);
        console.error('Error deleting budget:', error);
      }
    }
  };

  const handleEdit = (budget: BudgetEntry) => {
    setEditingBudget(budget);
    setEditingId(budget.id);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setEditingBudget(null);
    setEditingId(null);
    setIsEditing(false);
  };

  const handleUpdate = async (updatedBudget: BudgetData) => {
    if (!editingId) return;
    try {
      await budgetService.updateBudget(editingId, updatedBudget);
      setBudgets(budgets.map(b => b.id === editingId ? { ...b, ...updatedBudget } : b));
      setEditingId(null);
      setEditingBudget(null);
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update budget';
      setError(errorMessage);
      console.error('Error updating budget:', error);
    }
  };

  const groupedBudgets = budgets.reduce((acc, budget) => {
    if (!acc[budget.month]) {
      acc[budget.month] = [];
    }
    acc[budget.month].push(budget);
    return acc;
  }, {} as Record<string, BudgetEntry[]>);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <h1 className="text-gray-600 text-2xl font-bold">Monthly Budget</h1>
        <p className="text-gray-600">
          Plan and track your monthly budget across different categories.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {formError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {formError}
        </div>
      )}

      {!isEditing && (
        <BudgetForm
          onSubmit={handleSubmit}
          isLoading={false}
          initialData={getBudgetData()}
          isEditing={false}
          categories={categories}
        />
      )}

      {isEditing && editingBudget && (
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
          <h2 className="text-xl font-semibold mb-4 text-gray-600">Edit Budget</h2>
          <BudgetForm
            onSubmit={handleUpdate}
            isLoading={false}
            initialData={getBudgetData(editingBudget)}
            isEditing={true}
            categories={categories}
          />
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Budgets by Month</h2>
        {budgets.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No budgets added yet. Add your first budget above.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBudgets).map(([month, monthBudgets]) => (
              <div key={month} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-4 text-gray-800">{formatMonth(month)}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                          Category
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {monthBudgets.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">
                            {entry.category}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-gray-800">${entry.amount.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(entry)}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 text-sm"
                                disabled={isEditing}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 text-sm"
                                title="Delete budget entry"
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
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
