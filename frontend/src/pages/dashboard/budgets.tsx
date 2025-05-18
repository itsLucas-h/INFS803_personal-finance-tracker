import { useState, useEffect } from 'react';
import DashboardLayout from "@/layouts/DashboardLayout";
import { withAuth } from "@/components/auth/withAuth";
import { budgetService } from "@/services/budgetService";
import { Budget, BudgetFormData } from "@/types/budget";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { BudgetForm } from "@/components/budget";

function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const fetchedBudgets = await budgetService.getBudgets();
      setBudgets(fetchedBudgets);
      setError(null);
    } catch (err) {
      setError('Failed to fetch budgets. Please try again.');
      console.error('Error fetching budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (data: BudgetFormData) => {
    try {
      setIsSubmitting(true);
      const newBudget = await budgetService.createBudget({
        ...data,
        spent: 0,
        remaining: data.amount,
        userId: '', // Will be set by backend
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      setBudgets([...budgets, newBudget]);
      setIsFormOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to create budget. Please try again.');
      console.error('Error creating budget:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBudget = async (id: string, data: Partial<Budget>) => {
    try {
      setIsSubmitting(true);
      const updatedBudget = await budgetService.updateBudget(id, data);
      setBudgets(budgets.map(b => b.id === id ? updatedBudget : b));
      setEditingBudget(null);
      setError(null);
    } catch (err) {
      setError('Failed to update budget. Please try again.');
      console.error('Error updating budget:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    
    try {
      await budgetService.deleteBudget(id);
      setBudgets(budgets.filter(b => b.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete budget. Please try again.');
      console.error('Error deleting budget:', err);
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Budgets</h1>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Budget</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {budgets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No budgets set. Create your first budget to start tracking expenses.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="p-6 flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {budget.category}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {budget.month} • ${budget.spent.toFixed(2)} spent of ${budget.amount.toFixed(2)}
                    </p>
                    <div className="mt-2 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          budget.spent / budget.amount > 0.9
                            ? 'bg-red-500'
                            : budget.spent / budget.amount > 0.7
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-semibold text-blue-600">
                      ${budget.remaining.toFixed(2)} remaining
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingBudget(budget)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Budget Form Modal */}
        {(isFormOpen || editingBudget) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md relative">
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingBudget(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {editingBudget ? 'Edit Budget' : 'Create New Budget'}
                </h2>
                <BudgetForm
                  onSubmit={(data) => {
                    if (editingBudget) {
                      handleUpdateBudget(editingBudget.id, data);
                    } else {
                      handleCreateBudget(data);
                    }
                  }}
                  isLoading={isSubmitting}
                  initialData={editingBudget ? {
                    month: editingBudget.month,
                    category: editingBudget.category,
                    amount: editingBudget.amount,
                  } : undefined}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default withAuth(BudgetsPage);
