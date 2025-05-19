import { Goal } from '../models/index.js';
import { Controller } from '../types/express/request.js';

export const createGoal: Controller = async (req, res, next) => {
  try {
    const { title, targetAmount, currentAmount, deadline } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const goal = await Goal.create({
      userId: req.user?.id,
      title,
      targetAmount,
      currentAmount,
      deadline,
    });

    res.status(201).json({ 
      message: 'Goal created successfully',
       goal 
      });
  } catch (err) {
    console.error('Error creating goal:', err);
    next(err);
  }
};

export const getGoals: Controller = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

     const goals = await Goal.findAll({
      where: { userId: req.user.id },
      order: ['deadline'],
    });

    res.status(200).json({ 
      message: 'Goals fetched successfully',
       goals
       });
  } catch (err) {
    console.error('Error fetching goals:', err);
    next(err);
  }
};

export const updateGoal: Controller = async (req, res, next) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findByPk(id);

    if (!goal || goal.userId !== req.user?.id) {
      return res.status(404).json({
         message: 'Goal not found' });
    }

    await goal.update(req.body);

    res.status(200).json({ message: 'Goal updated successfully', goal });
  } catch (err) {
    console.error('Error updating goal:', err);
    next(err);
  }
};

export const deleteGoal: Controller = async (req, res, next) => {
  try {
    const { id } = req.params;

    const goal = await Goal.findByPk(id);

    if (!goal || goal.userId !== req.user?.id) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    await goal.destroy();

    res.status(200).json({ message: 'Goal deleted successfully' });
  } catch (err) {
    console.error('Error deleting goal:', err);
    next(err);
  }
};
