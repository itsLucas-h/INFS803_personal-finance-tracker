import { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { transactionService } from '@/services/transactionService';
import { budgetService } from '@/services/budgetService';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28', '#FF4444', '#0088FE'];

// Add explicit types for transactions and budgets
interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
  createdAt?: string;
}
interface BudgetEntry {
  id: string;
  month: string;
  amount: number;
  category: string;
  description?: string;
}

function groupByCategory(items: Transaction[], type: 'income' | 'expense' = 'expense') {
  const result: Record<string, number> = {};
  items.forEach(item => {
    if (item.type === type) {
      result[item.category] = (result[item.category] || 0) + item.amount;
    }
  });
  return Object.entries(result).map(([category, amount]) => ({ category, amount }));
}

function ReportsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [txs, buds] = await Promise.all([
        transactionService.getTransactions(),
        budgetService.getBudgets()
      ]);
      setTransactions(txs || []);
      setBudgets(buds || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch report data');
    } finally {
      setLoading(false);
    }
  };

  // Filter by selected month
  const filteredTxs = transactions.filter(t => t.date?.slice(0, 7) === selectedMonth);
  const filteredBuds = budgets.filter(b => b.month === selectedMonth);

  // Pie chart data: expenses by category
  const expenseByCategory = groupByCategory(filteredTxs, 'expense');
  // Bar chart data: budget vs. actual by category
  const barData = filteredBuds.map(b => {
    const actual = filteredTxs.filter(t => t.category === b.category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      category: b.category,
      Budget: b.amount,
      Actual: actual,
    };
  });

  // Summary
  const totalIncome = filteredTxs.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filteredTxs.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <h1 className="text-gray-600 text-2xl font-bold">Reports</h1>
        <p className="text-gray-600">Visualize your finances and compare with your budgets.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex-1 flex justify-end space-x-8 mt-4 md:mt-0">
          <div>
            <div className="text-gray-500 text-sm">Total Income</div>
            <div className="text-green-600 font-bold text-lg">${totalIncome.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Total Expenses</div>
            <div className="text-red-600 font-bold text-lg">${totalExpense.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm">Net</div>
            <div className={`font-bold text-lg ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${(totalIncome - totalExpense).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Expenses by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseByCategory}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {expenseByCategory.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Budget vs. Actual</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Budget" fill="#8884d8" />
              <Bar dataKey="Actual" fill="#ff8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ReportsPage;
