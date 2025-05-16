import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { TextField, Button, LinearProgress, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

interface Goal {
  id: number;
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
  completed: boolean;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [savedAmount, setSavedAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline) return;

    const newGoal: Goal = {
      id: editId || Date.now(),
      name,
      targetAmount: parseFloat(targetAmount),
      savedAmount: editId
        ? goals.find((goal) => goal.id === editId)?.savedAmount || 0
        : parseFloat(savedAmount) || 0,
      deadline,
      completed: false,
    };

    if (editId) {
      setGoals((prev) =>
        prev.map((goal) => (goal.id === editId ? newGoal : goal))
      );
      setEditId(null);
    } else {
      setGoals((prev) => [...prev, newGoal]);
    }

    setName("");
    setTargetAmount("");
    setSavedAmount("");
    setDeadline("");
  };

  const handleDelete = (id: number) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const handleEdit = (goal: Goal) => {
    setEditId(goal.id);
    setName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setSavedAmount(goal.savedAmount.toString());
    setDeadline(goal.deadline);
  };

  const handleMarkComplete = (id: number) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, completed: true } : goal
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-gray-600 text-2xl font-bold">Goals</h1>
        <p className="text-gray-600">
          Set and track your financial goals with ease.
        </p>

        {/* Form to Add/Edit Goals */}
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
          <TextField
            label="Goal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Target Amount ($)"
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            fullWidth
          />
          <TextField
            label="Saved Amount ($)"
            type="number"
            value={savedAmount}
            onChange={(e) => setSavedAmount(e.target.value)}
            fullWidth
            disabled={!!editId} // Disable saved amount input when editing
          />
          <TextField
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            {editId ? "Save Changes" : "Add Goal"}
          </Button>
        </form>

        {/* List of Goals */}
        <div className="w-full max-w-3xl mt-8 space-y-4">
          {goals.map((goal) => {
            const progress =
              (goal.savedAmount / goal.targetAmount) * 100 || 0;

            return (
              <div
                key={goal.id}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold">{goal.name}</h2>
                    <p className="text-sm text-gray-500">
                      Deadline: {goal.deadline}
                    </p>
                    <p className="text-sm text-gray-500">
                      {goal.completed
                        ? "Goal Completed!"
                        : `Saved: $${goal.savedAmount} / $${goal.targetAmount}`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {!goal.completed && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="success"
                        onClick={() => handleMarkComplete(goal.id)}
                      >
                        Mark Complete
                      </Button>
                    )}
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(goal)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </div>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  className="mt-4"
                />
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
