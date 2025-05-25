"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

export type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
};

type GoalFormProps = {
  initialData?: Goal;
  onSubmit: (goal: Goal) => Promise<void>;
  isEditing?: boolean;
};

const defaultGoal: Goal = {
  id: "",
  title: "",
  targetAmount: 0.0,
  currentAmount: 0.0,
  deadline: new Date().toISOString().split("T")[0],
};

const GoalForm: React.FC<GoalFormProps> = ({
  initialData = defaultGoal,
  onSubmit,
  isEditing = false,
}) => {
  const [goal, setGoal] = useState<Goal>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setGoal(initialData);
  }, [initialData]);

  const validateInput = (): boolean => {
    setError(null);

    if (goal.currentAmount > goal.targetAmount) {
      setError("Current amount cannot be greater than target amount");
      return false;
    }

    const selectedDate = new Date(goal.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setError("Deadline cannot be set in the past");
      return false;
    }

    return true;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setGoal((prev) => ({
      ...prev,
      [name]: ["targetAmount", "currentAmount"].includes(name)
        ? isNaN(Number(value))
          ? 0
          : parseFloat(value)
        : value,
    }));

    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateInput()) {
      await onSubmit(goal);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm mb-8"
    >
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Saving Goal Name
        </label>
        <div className="relative">
          <input
            type="text"
            id="title"
            name="title"
            value={goal.title}
            onChange={handleChange}
            maxLength={50}
            required
            placeholder="Name of savings goal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
            {goal.title.length}/50
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="targetAmount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Target Goal Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={goal.targetAmount}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            required
            className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="currentAmount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Current Amount
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            type="number"
            id="currentAmount"
            name="currentAmount"
            value={goal.currentAmount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="deadline"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Deadline
        </label>
        <input
          type="date"
          id="deadline"
          name="deadline"
          value={goal.deadline}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isEditing ? "Update Goal" : "Create Goal"}
      </button>
    </form>
  );
};

export default GoalForm;
