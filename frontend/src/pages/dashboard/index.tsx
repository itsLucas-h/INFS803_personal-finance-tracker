import { useState, useEffect } from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { withAuth } from "@/components/auth/withAuth";
import { transactionService } from '@/services/transactionService';
import { TransactionData } from '@/components/transaction';
import Link from 'next/link';
import { Wallet, TrendingUp, TrendingDown, Plus, Target, PieChart } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface Transaction extends TransactionData {
  id: string;
  createdAt: string;
}

interface FinancialStats {
  monthlyIncome: number;
  monthlyExpenses: number;
}

function getChartData(transactions: Transaction[], groupBy: 'month' | 'week' | 'year') {
  const data: Record<string, { label: string; income: number; expense: number }> = {};
  transactions.forEach((t) => {
    const date = new Date(t.date);
    let key = '';
    let label = '';
    if (groupBy === 'month') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      label = key;
    } else if (groupBy === 'week') {
      // Get ISO week number
      const tempDate = new Date(date.getTime());
      tempDate.setHours(0, 0, 0, 0);
      // Thursday in current week decides the year.
      tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
      const week1 = new Date(tempDate.getFullYear(), 0, 4);
      const weekNo = 1 + Math.round(
        ((tempDate.getTime() - week1.getTime()) / 86400000
          - 3 + ((week1.getDay() + 6) % 7)) / 7
      );
      key = `${tempDate.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
      label = key;
    } else if (groupBy === 'year') {
      key = `${date.getFullYear()}`;
      label = key;
    }
    if (!data[key]) {
      data[key] = { label, income: 0, expense: 0 };
    }
    if (t.type === 'income') data[key].income += t.amount;
    if (t.type === 'expense') data[key].expense += t.amount;
  });
  // Sort by key
  return Object.values(data).sort((a, b) => a.label.localeCompare(b.label));
}

function DashboardHome() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<FinancialStats>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
  });
  const [groupBy, setGroupBy] = useState<'month' | 'week' | 'year'>('month');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const transactionsData = await transactionService.getTransactions();
      setTransactions(transactionsData || []);
      
      // Calculate financial stats
      const now = new Date();
      const thisMonth = transactionsData.filter((t: Transaction) => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      });

      const monthlyIncome = thisMonth
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      const monthlyExpenses = thisMonth
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      setStats({
        monthlyIncome,
        monthlyExpenses,
      });

      const chartData = getChartData(transactionsData, groupBy);

      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Income</h3>
            <TrendingUp className="text-green-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-green-600">
            ${stats.monthlyIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Expenses</h3>
            <TrendingDown className="text-red-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-red-600">
            ${stats.monthlyExpenses.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/transactions"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="text-blue-600" size={20} />
            <span className="font-medium text-blue-600">Add Transaction</span>
          </Link>
          <Link
            href="/dashboard/budgets"
            className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <PieChart className="text-green-600" size={20} />
            <span className="font-medium text-green-600">Set Budget</span>
          </Link>
          <Link
            href="/dashboard/goals"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Target className="text-purple-600" size={20} />
            <span className="font-medium text-purple-600">Set Goal</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <PieChart className="text-orange-600" size={20} />
            <span className="font-medium text-orange-600">View Reports</span>
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Transactions</h2>
          <Link
            href="/dashboard/transactions"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions yet. Add your first transaction to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">{transaction.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                    </p>
                  </div>
                  <span
                    className={`font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expenses & Income Over Time */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Expenses & Income Over Time</h2>
        <div className="flex items-center mb-2">
          <label className="mr-2 font-medium text-gray-700">Group by:</label>
          <select
            value={groupBy}
            onChange={e => setGroupBy(e.target.value as 'month' | 'week' | 'year')}
            className="bg-black text-white border border-gray-400 rounded px-2 py-1"
          >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getChartData(transactions, groupBy)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#22c55e" name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(DashboardHome);
