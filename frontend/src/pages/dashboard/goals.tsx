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
    try{
      const fetchedGoals = await goalService.getGoals();
      console.log("Fetched goals: ", fetchedGoals);
      setGoals(fetchedGoals || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch goals');
      console.error('Error fetching goals: ', err);
    } finally {
      setLoading(false);
    }
  }

  /*
  const handleGoalSubmit = async (goal: Goal) => {
    try {
      await goalService.createGoal(goal);
      console.log("Goal submitted: ", goal);
      const updatedGoals = await goalService.getGoals();
      setGoals(updatedGoals || []);
      setShowForm(false);
    } catch (error) {
      console.error("Failed to submit goal", error);
    }
  };
  */

  const handleGoalSubmit = async (goal: Goal) => {
    try{

      if(editingGoal)
      {
        const updatedGoal = await goalService.updateGoal(goal.id, goal);
        setGoals(prev => 
          prev.map(g => (g.id === updatedGoal.id ? updatedGoal : g))
        );
      }
      else{
        const newGoal = await goalService.createGoal(goal);
        setGoals(prev => [...prev, newGoal]);
      }
      
      setShowForm(false);
      setEditingGoal(null);
      setError(null);
    } catch(err) {
      setError('Failed to create new goal');
      console.error('Error creating goal: ', err );
    }
  }

  const handleGoalDelete = async (id: string) => {
     if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
     }

      try{
        await goalService.deleteGoal(id);
        setGoals(prev => prev.filter(t => t.id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete goal');
        console.error('Error deleting goal: ', err)
      }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-gray-600 text-2xl font-bold">Goals</h1>
        <p className="text-gray-600">Set and track your financial goals with ease.</p>

        <button
          type="button"
          className="px-10 py-2 bg-gray-500 text-white rounded-lg"
          onClick={() => setShowForm(true)}
        >
          + Set a new goal
        </button>

        {loading && <p>Loading goals...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && goals.length === 0 && <p>No goals found.</p>}

        {!loading && !error && goals.length > 0 && (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6 w-full px-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold text-black-700 mb-3">{goal.title}</h3>
                <div className="text-gray-700 space-y-1 mb-3">
                  <p>
                    <span className="font-medium">Target:</span> ${goal.targetAmount}
                  </p>
                  <p>
                    <span className="font-medium">Saved:</span> ${goal.currentAmount}
                  </p>
                  <p>
                    <span className="font-medium">Deadline:</span> {goal.deadline}
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setEditingGoal(goal);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleGoalDelete(goal.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed bg-gray-100 bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-full shadow-lg relative">
              <button
                className="absolute text-4xl top-2 right-2 text-gray-600 hover:text-black"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
              <h2 className="text-3xl font-semibold text-center py-10">
                { editingGoal ? "Edit Goal" : "New Goal"}
              </h2>
              <GoalForm 
              initialData={editingGoal || undefined}
              isEditing={true}
              onSubmit={handleGoalSubmit} 
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
