import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { budgetService } from '@/services/budgetService';

interface BudgetEntry {
  id: string;
  month: string;
  amount: number;
  category?: string;
  description?: string;
}

interface BudgetData {
  month: string;
  amount: number;
  category: string;
  description?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const API_URL = `${API_BASE_URL}/api/budgets`;

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

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

function toDDMMMYYYY(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  return dateString;
}

export default function BudgetsPage() {
  const [formData, setFormData] = useState<BudgetData>({
    month: new Date().toISOString().slice(0, 7),
    amount: 0,
    category: '',
    description: '',
  });
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
  const [error, setError] = useState<string | null>(null);

  const getCurrentYear = () => new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => getCurrentYear() - 2 + i);

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = formData.month.split('-')[0];
    const month = e.target.value;
    setFormData(prev => ({
      ...prev,
      month: `${year}-${month}`
    }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value;
    const month = formData.month.split('-')[1];
    setFormData(prev => ({
      ...prev,
      month: `${year}-${month}`
    }));
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const data = await budgetService.getBudgets();
      setBudgets(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch budgets');
      console.error('Error fetching budgets:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.category) {
      setFormError("Please select a category.");
      return;
    }
    if (formData.amount <= 0) {
      setFormError("Amount must be greater than 0.");
      return;
    }
    // Check for duplicate
    const exists = budgets.find(
      (b) => b.month === formData.month && b.category === formData.category
    );
    if (exists) {
      setFormError(`A budget for "${formData.category}" in ${formData.month} already exists.`);
      return;
    }
    try {
      const newBudget = await budgetService.createBudget(formData);
      setBudgets([...budgets, newBudget]);
      setFormData({
        month: new Date().toISOString().slice(0, 7),
        amount: 0,
        category: '',
        description: '',
      });
      setError(null);
    } catch (err) {
      setError('Failed to create budget');
      console.error('Error creating budget:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : 
              name === 'month' ? value :
              value
    }));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget entry?')) {
      try {
        await budgetService.deleteBudget(id);
        setBudgets(budgets.filter(b => b.id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete budget');
        console.error('Error deleting budget:', err);
      }
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

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

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
            name="category"
            value={formData.category}
            onChange={handleChange}
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
          <label htmlFor="amount" className={STYLES.label}>Target Amount</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              min="0"
              step="1"
              value={formData.amount}
              onChange={handleChange}
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter budget description (optional)"
            className={STYLES.input}
          />
        </div>

        <div className="mb-6">
          <label className={STYLES.label}>Month and Year</label>
          <div className="flex gap-4">
            <div className="flex-1">
              <select
                id="year"
                name="year"
                value={formData.month.split('-')[0]}
                onChange={handleYearChange}
                required
                className={STYLES.input}
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select
                id="month"
                name="month"
                value={formData.month.split('-')[1]}
                onChange={handleMonthChange}
                required
                className={STYLES.input}
              >
                {months.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
