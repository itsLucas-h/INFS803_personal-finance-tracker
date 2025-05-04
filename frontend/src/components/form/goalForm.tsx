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

        <form noValidate onSubmit={handleSubmit} className='GoalForm'>

            <div className='goal-form-group'>
                <h2>Saving goal name</h2>
                <p className='goal-form-required-input'>Required</p>
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
                <p className='goal-form-required-input'>Required</p>
                <input
                type="number"
                placeholder="Target amount to reach"
                name = "targetAmount"
                className="goal-form-input"
                value={goal.targetAmount}
                onChange ={handleChange}
                required
                />
                <br />
            </div>

            <div className='goal-form-group'>
                <h2>Current amount needed to reach target goal</h2>
                <p className='goal-form-required-input'>Required</p>
                <input
                type="number"
                placeholder="Current amount"
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
                <p className='goal-form-required-input'>Required</p>
                <input
                type="date"
                name="deadline"
                className="goal-form-input"
                value={goal.deadline}
                onChange={handleChange}
                required
                />
                <br />
            </div>
            
        </form>
    );
};

export default GoalForm;

