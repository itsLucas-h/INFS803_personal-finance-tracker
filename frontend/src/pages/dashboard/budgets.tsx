import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BudgetEntry {
  month: string;
  amount: number;
  category?: string;
}

// 🎨 Default category colors
const defaultColors: Record<string, string> = {
  Food: '#82ca9d',
  Rent: '#8884d8',
  Transport: '#ffc658',
  Health: '#ff7f7f',
  Entertainment: '#a4de6c',
  Utilities: '#8dd1e1',
  Savings: '#d0ed57'
};

// 🎨 Cache for dynamic colors
const customColorMap: Record<string, string> = {};

function getCategoryColor(category: string): string {
  if (defaultColors[category]) return defaultColors[category];

  if (!customColorMap[category]) {
    const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 60%, 65%)`;
    customColorMap[category] = randomColor;
  }

  return customColorMap[category];
}

export default function BudgetsPage() {
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
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

  useEffect(() => {
    const stored = localStorage.getItem('budgets');
    if (stored) {
      setBudgets(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const chosenCategory = customCategory.trim() !== '' ? customCategory : category;

    if (!chosenCategory) {
      alert("Please select or add a category.");
      return;
    }

    if (customCategory && !categories.includes(customCategory)) {
      setCategories([...categories, customCategory]);
    }

    const exists = budgets.find(
      (b) => b.month === month && b.category === chosenCategory
    );
    if (exists) {
      alert(`A budget for "${chosenCategory}" in ${month} already exists.`);
      return;
    }

    const newEntry: BudgetEntry = {
      month,
      amount: Math.floor(parseFloat(amount)),
      category: chosenCategory,
    };

    setBudgets([...budgets, newEntry]);
    setMonth('');
    setAmount('');
    setCategory('');
    setCustomCategory('');
  };

  const groupBudgetsByMonth = () => {
    const grouped: { [month: string]: BudgetEntry[] } = {};
    budgets.forEach((entry) => {
      if (!grouped[entry.month]) {
        grouped[entry.month] = [];
      }
      grouped[entry.month].push(entry);
    });
    return grouped;
  };

  const groupedBudgets = groupBudgetsByMonth();

  // ✅ Show only categories with budget entries
  const chartData = Array.from(new Set(budgets.map(b => b.category)))
    .map((cat) => {
      const total = budgets
        .filter((b) => b.category === cat)
        .reduce((sum, b) => sum + b.amount, 0);
      return { name: cat!, amount: total };
    })
    .filter(data => data.amount > 0); // ensures no empty bars

  return (
    <DashboardLayout>
      <div className="bg-white text-black min-h-screen px-8 py-6">
        <h1 className="text-2xl font-bold mb-4">Monthly Budget</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block mb-1 font-medium">Month:</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Target Amount ($):</label>
            <input
              type="number"
              min="0"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Select Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">-- Choose a category --</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Or Add New Category:</label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category"
              className="border p-2 rounded w-full"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add Budget
          </button>
        </form>

        <div>
          <h2 className="text-xl font-semibold mb-4">Budgets by Month</h2>
          {Object.keys(groupedBudgets).length === 0 ? (
            <p className="text-gray-500">No budgets added yet.</p>
          ) : (
            Object.entries(groupedBudgets).map(([month, entries]) => {
              const total = entries.reduce((sum, e) => sum + e.amount, 0);
              return (
                <div key={month} className="mb-8 border rounded shadow-sm p-4">
                  <h3 className="text-lg font-bold mb-2">{month}</h3>
                  <table className="w-full border text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 border">Category</th>
                        <th className="p-2 border">Amount ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, index) => (
                        <tr key={index}>
                          <td className="p-2 border">{entry.category}</td>
                          <td className="p-2 border">${entry.amount}</td>
                        </tr>
                      ))}
                      <tr className="font-semibold bg-gray-50">
                        <td className="p-2 border">Total</td>
                        <td className="p-2 border">${total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })
          )}
        </div>

        {/* 📊 Category Bar Chart */}
        {chartData.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-2">Budget Breakdown by Category</h2>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  {chartData.map((entry) => (
                    <Bar
                      key={entry.name}
                      dataKey="amount"
                      data={[entry]}
                      name={entry.name}
                      fill={getCategoryColor(entry.name)}
                      barSize={20}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
