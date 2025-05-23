'use client'

import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

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
    id: '',
    title: '',
    targetAmount: 0.0,
    currentAmount: 0.0,
    deadline: new Date().toISOString().split('T')[0],
};

const GoalForm: React.FC<GoalFormProps> = ({ initialData = defaultGoal, onSubmit, isEditing = false }) => {
    const [goal, setGoal] = useState<Goal>(initialData);

    useEffect(() => {
        setGoal(initialData);
    }, [initialData]);

    const validateInput = (): boolean => {
        if (goal.currentAmount > goal.targetAmount) {
            console.error('Current amount must be less than target amount');
            return false;
        }

        const selectedDate = new Date(goal.deadline);
        const today = new Date();
        if (selectedDate < today) {
            console.error('Deadline can not be set in the past');
            return false;
        }

        return true;
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setGoal(prev => ({
            ...prev,
            [name]: ['targetAmount', 'currentAmount'].includes(name)
                ? parseFloat(value) || 0.0
                : value
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (validateInput()) {
            await onSubmit(goal);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm mb-8">
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Saving Goal Name
                </label>
                <input
                    type="text"
                    id="title"
                    placeholder="Name of savings goal"
                    name="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    value={goal.title}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Goal Amount
                </label>
                <input
                    type="number"
                    id="targetAmount"
                    placeholder="$"
                    name="targetAmount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    value={goal.targetAmount}
                    onChange={handleChange}
                    required
                    min="0.01"
                    step="0.01"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="currentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Amount
                </label>
                <input
                    type="number"
                    id="currentAmount"
                    placeholder="$"
                    name="currentAmount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                    value={goal.currentAmount}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline
                </label>
                <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    value={goal.deadline}
                    onChange={handleChange}
                    required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
                {isEditing ? 'Update Goal' : 'Create Goal'}
            </button>
        </form>
    );
};

export default GoalForm;

