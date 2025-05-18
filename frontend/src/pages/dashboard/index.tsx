import DashboardLayout from "@/layouts/DashboardLayout";
import { withAuth } from "@/components/auth/withAuth";

function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-gray-600 text-3xl font-bold mb-2">
          Welcome to your Dashboard
        </h1>
        <p className="text-gray-600">
          Choose a section from the sidebar to get started.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(DashboardHome);
import { useState, useEffect } from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { withAuth } from "@/components/auth/withAuth";
import { transactionService } from '@/services/transactionService';
import { budgetService } from '@/services/budgetService';
import Link from 'next/link';
import { Wallet, TrendingUp, TrendingDown, Plus, Target, PieChart } from 'lucide-react';
import { Budget } from '@/types/budget';
import { TransactionData } from '@/components/transaction';

interface DashboardStats {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalBudgeted: number;
  totalRemaining: number;
}

function DashboardHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    totalBudgeted: 0,
    totalRemaining: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<TransactionData[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch transactions from EC2
      const transactions = await transactionService.getTransactions();
      setRecentTransactions(transactions.slice(0, 5));

      // Calculate monthly stats
      const now = new Date();
      const thisMonth = transactions.filter((t: TransactionData) => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear();
      });

      const monthlyIncome = thisMonth
        .filter((t: TransactionData) => t.type === 'income')
        .reduce((sum: number, t: TransactionData) => sum + t.amount, 0);

      const monthlyExpenses = thisMonth
        .filter((t: TransactionData) => t.type === 'expense')
        .reduce((sum: number, t: TransactionData) => sum + t.amount, 0);

      // Fetch budgets from EC2
      const currentBudgets = await budgetService.getBudgets();
      setBudgets(currentBudgets);

      // Calculate budget totals
      const totalBudgeted = currentBudgets.reduce((sum: number, budget: Budget) => sum + budget.amount, 0);
      const totalRemaining = currentBudgets.reduce((sum: number, budget: Budget) => sum + budget.remaining, 0);

      setStats({
        monthlyIncome,
        monthlyExpenses,
        totalBudgeted,
        totalRemaining,
      });

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Total Budgeted</h3>
            <Wallet className="text-blue-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-blue-600">
            ${stats.totalBudgeted.toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Budget Remaining</h3>
            <Target className="text-purple-600" size={24} />
          </div>
          <p className="text-2xl font-bold text-purple-600">
            ${stats.totalRemaining.toFixed(2)}
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
            <Wallet className="text-green-600" size={20} />
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
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions yet. Add your first transaction to get started.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentTransactions.map((transaction) => (
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

      {/* Budget Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Budget Overview</h2>
          <Link
            href="/dashboard/budgets"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {budgets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No budgets set. Create your first budget to start tracking expenses.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-800">{budget.category}</p>
                    <p className="text-sm text-gray-500">
                      {budget.month} • ${budget.spent.toFixed(2)} spent
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-blue-600">
                      ${budget.remaining.toFixed(2)} remaining
                    </p>
                    <p className="text-sm text-gray-500">
                      of ${budget.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default withAuth(DashboardHome);