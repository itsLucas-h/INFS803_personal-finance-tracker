import { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import GoalForm from "@/components/goal/goalForm";
import { Goal } from "@/components/goal/goalForm";
import { goalService } from "@/services/goalService";

export default function GoalsPage() {
  const [showForm, setShowForm] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const fetchedGoals = await goalService.getGoals();
      setGoals(fetchedGoals || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch goals');
      console.error('Error fetching goals: ', err);
    } finally {
      setLoading(false);
    }
  }

  const handleGoalSubmit = async (goal: Goal) => {
    try {
      if (editingGoal) {
        const updatedGoal = await goalService.updateGoal(goal.id, goal);
        setGoals(prev => 
          prev.map(g => (g.id === updatedGoal.id ? updatedGoal : g))
        );
      } else {
        const newGoal = await goalService.createGoal(goal);
        setGoals(prev => [...prev, newGoal]);
      }
      
      setShowForm(false);
      setEditingGoal(null);
      setError(null);
    } catch (err) {
      setError('Failed to create new goal');
      console.error('Error creating goal: ', err);
    }
  }

  const handleGoalDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await goalService.deleteGoal(id);
      setGoals(prev => prev.filter(t => t.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete goal');
      console.error('Error deleting goal: ', err);
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <h1 className="text-gray-800 text-2xl font-bold">Goals</h1>
        <p className="text-gray-600">Set and track your financial goals with ease.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {!showForm && (
        <div className="flex justify-center mb-6">
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={() => setShowForm(true)}
          >
            + Set a new goal
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingGoal ? "Edit Goal" : "New Goal"}
            </h2>
            <button
              className="text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => {
                setShowForm(false);
                setEditingGoal(null);
              }}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <GoalForm 
            initialData={editingGoal || undefined}
            isEditing={!!editingGoal}
            onSubmit={handleGoalSubmit} 
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading goals...</div>
      ) : goals.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No goals found. Set your first goal to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full px-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4 break-words line-clamp-2 min-h-[3rem]">{goal.title}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Target:</span>
                  <span className="font-medium text-gray-800">${goal.targetAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saved:</span>
                  <span className="font-medium text-gray-800">${goal.currentAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-medium text-gray-800">{new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => {
                    setEditingGoal(goal);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:text-red-800 transition-colors"
                  onClick={() => handleGoalDelete(goal.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
