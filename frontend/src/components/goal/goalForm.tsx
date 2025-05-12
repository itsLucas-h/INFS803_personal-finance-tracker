'use client'

import React, { ChangeEvent, FormEvent,useEffect, useState } from 'react';

type Goal = {
    title: string;
    targetAmount: string;
    currentAmount: string;
    deadline: string;
};

type GoalFormProps = {
    initialData?: Goal;
    onSubmit: (goal:Goal) => Promise<void>;
    isEditing?: boolean;
};

const defaultGoal: Goal = {
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: ''
};

const GoalForm: React.FC<GoalFormProps> = ({initialData = defaultGoal, onSubmit, isEditing = false}) => {
    const [goal, setGoal] = useState<Goal>(initialData);

    useEffect(() => {
        setGoal(initialData);
    }, [initialData]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setGoal({...goal,[event.target.name]: event.target.value})
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await onSubmit(goal);
    }

    return (

        <form noValidate onSubmit={handleSubmit}>
            <div className='goal-form-group'>
                <h2>Saving goal name</h2>
                <input
                type="text"
                placeholder="Name of savings goal"
                name="title"
                className="goal-form-input"
                value={goal.title}
                onChange={handleChange}
                required
                />
                <br/>
            </div>

            <div className='goal-form-group'>
                <h2>Target goal amount</h2>
                <input
                type="number"
                placeholder="$"
                name = "targetAmount"
                className="goal-form-input"
                value={goal.targetAmount}
                onChange ={handleChange}
                required
                />
                <br />
            </div>

            <div className='goal-form-group'>
                <h2>Current amount</h2>
                <input
                type="number"
                placeholder="$"
                name ="currentAmount"
                className="goal-form-input"
                value={goal.currentAmount}
                onChange={handleChange}
                required
                />
                <br />
            </div>

            <div className='goal-form-group'>
                <h2>Deadline</h2>
                <input
                type="date"
                name="deadline"
                className="goal-form-input text-gray-400"
                value={goal.deadline}
                onChange={handleChange}
                required
                />
                <br />
            </div>
            
            <div className='goal-form-group'>
                <button
                type="submit"
                 className="mx-40 px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-300 transition"
                >
                    Submit
                </button>
            </div> 
        </form>

    );
};

export default GoalForm;

