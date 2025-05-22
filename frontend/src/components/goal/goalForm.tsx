'use client'

import React, { ChangeEvent, FormEvent,useEffect, useState } from 'react';

export type Goal = {
    id: string;
    title: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
};

type GoalFormProps = {
    initialData?: Goal;
    onSubmit: (goal:Goal) => Promise<void>;
    isEditing?: boolean;
};

const defaultGoal: Goal = {
    id: '',
    title: '',
    targetAmount: 0.0,
    currentAmount: 0.0,
    deadline: new Date().toISOString().split('T')[0],
};

const GoalForm: React.FC<GoalFormProps> = ({initialData = defaultGoal, onSubmit, isEditing = false}) => {
    const [goal, setGoal] = useState<Goal>(initialData);

    useEffect(() => {
        setGoal(initialData);
    }, [initialData]);

    const validateInput = (): boolean => {

        if(goal.currentAmount > goal.targetAmount)
        {
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
       setGoal(prev => {
      const newData = {
        ...prev,
        [name]: ['targetAmount', 'currentAmount'].includes(name) 
        ? parseFloat(value) || 0.0 
        : value
      };

      return newData;
    });
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(validateInput())
        {
        console.log(goal);
        await onSubmit(goal);
        }
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

