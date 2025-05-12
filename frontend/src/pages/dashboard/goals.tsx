import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import GoalForm from "@/components/goal/goalForm";
import { Goal } from "@/services/goalService";
import { createGoal } from "@/services/goalService";
import { create } from "domain";


export default function GoalsPage() {

  const [showForm, setShowForm] = useState(false);

  const handleGoalSubmit = async (goal: Goal) => {
    await createGoal(goal);
    console.log("Goal submitted: ", goal);
    setShowForm(false);
  }
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-gray-600 text-2xl font-bold">Goals</h1>
        <p className="text-gray-600">
          Set and track your financial goals with ease.
        </p>

        <button
        type="button"
        className="px-10 py-2 bg-gray-500 text-white rounded-lg"
        onClick={() => setShowForm(true)}
        >
          +  Set a new goal
        </button>

        {showForm && (
        <div className="fixed bg-gray-100 bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full shadow-lg relative">
            <button
              className="absolute text-4xl top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <h2 className="text-3xl font-semibold text-center py-10">New Goal</h2>
            <GoalForm onSubmit={handleGoalSubmit} />

          </div>
        </div>
      )}

      </div>


 
    </DashboardLayout>

  );
}
