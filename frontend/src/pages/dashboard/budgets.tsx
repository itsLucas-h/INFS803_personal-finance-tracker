import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';

interface BudgetEntry {
  id: string;
  month: string;
  amount: number;
  category?: string;
  description?: string;
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

export default function BudgetsPage() {
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<string[]>([
    'Food',
    'Rent',
    'Transport',
    'Health',
    'Entertainment',
    'Utilities',
    'Savings',
  ]);
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof BudgetEntry;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('budgets');
    if (stored) {
      setBudgets(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Load categories from localStorage
  useEffect(() => {
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  // Save categories to localStorage when they change
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const chosenCategory = customCategory.trim() !== '' ? customCategory : category;

    if (!chosenCategory) {
      setFormError("Please select or add a category.");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setFormError("Amount must be greater than 0.");
      return;
    }

    if (customCategory && !categories.includes(customCategory)) {
      setCategories(prev => {
        const newCategories = [...prev, customCategory];
        localStorage.setItem('categories', JSON.stringify(newCategories));
        return newCategories;
      });
    }

    const exists = budgets.find(
      (b) => b.month === month && b.category === chosenCategory
    );
    if (exists) {
      setFormError(`A budget for "${chosenCategory}" in ${formatMonth(month)} already exists.`);
      return;
    }

    const newEntry: BudgetEntry = {
      id: crypto.randomUUID(),
      month,
      amount: Math.floor(parseFloat(amount)),
      category: chosenCategory,
      description: description.trim() || undefined,
    };

    setBudgets([...budgets, newEntry]);
    setMonth('');
    setAmount('');
    setCategory('');
    setCustomCategory('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget entry?')) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  const groupBudgetsByMonth = () => {
    const grouped: { [month: string]: BudgetEntry[] } = {};
    const sortedBudgets = [...budgets];
    
    if (sortConfig) {
      sortedBudgets.sort((a, b) => {
        const aValue = a[sortConfig.key] ?? '';
        const bValue = b[sortConfig.key] ?? '';
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    sortedBudgets.forEach((entry) => {
      if (!grouped[entry.month]) {
        grouped[entry.month] = [];
      }
      grouped[entry.month].push(entry);
    });
    return grouped;
  };

  const handleSort = (key: keyof BudgetEntry) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof BudgetEntry) => {
    if (sortConfig?.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const groupedBudgets = groupBudgetsByMonth();

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <h1 className="text-gray-600 text-2xl font-bold">Monthly Budget</h1>
        <p className="text-gray-600">
          Plan and track your monthly budget across different categories.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm mb-8">
        {formError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {formError}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="category" className={STYLES.label}>Select Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={STYLES.input}
          >
            <option value="">-- Choose a category --</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="customCategory" className={STYLES.label}>Or Add New Category</label>
          <input
            type="text"
            id="customCategory"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            placeholder="Enter custom category"
            className={STYLES.input}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className={STYLES.label}>Target Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              id="amount"
              min="0"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className={`${STYLES.input} pl-7`}
              placeholder="0"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className={STYLES.label}>Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter budget description (optional)"
            className={STYLES.input}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="month" className={STYLES.label}>Month</label>
          <input
            type="month"
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
            className={STYLES.input}
          />
        </div>

        <button type="submit" className={STYLES.button}>
          Add Budget
        </button>
      </form>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Budgets by Month</h2>
        {Object.keys(groupedBudgets).length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No budgets added yet. Add your first budget above.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBudgets).map(([month, entries]) => {
              const total = entries.reduce((sum, e) => sum + e.amount, 0);
              return (
                <div key={month} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">{formatMonth(month)}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th 
                            className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('category')}
                          >
                            Category {getSortIcon('category')}
                          </th>
                          <th 
                            className="px-4 py-3 text-right text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('amount')}
                          >
                            Amount {getSortIcon('amount')}
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSort('description')}
                          >
                            Description {getSortIcon('description')}
                          </th>
                          <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {entries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800">
                              {entry.category}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-800">${entry.amount.toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{entry.description || '-'}</td>
                            <td className="px-4 py-3 text-sm text-center">
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className={STYLES.deleteButton}
                                title="Delete budget entry"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-medium">
                          <td className="px-4 py-3 text-sm text-gray-800">Total</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-800">${total.toFixed(2)}</td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
