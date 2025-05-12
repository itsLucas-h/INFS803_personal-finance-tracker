import React from "react";

export type Goal = {
    title: string;
    targetAmount: string;
    currentAmount: string;
    deadline: string;
};

const API_URL = 'http://localhost:5432/api/goals';

export const createGoal = async (goal: Goal): Promise<void> => {
    const response = await fetch(`${API_URL}/goals`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(goal),
    });

    if(!response.ok){
        const error = await response.text();
        throw new Error(`Failed to create goal: {error}`);
    }
};