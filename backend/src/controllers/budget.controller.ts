import { Budget } from '../models';
import { Controller } from '../types/express/request';

export const createBudget: Controller = async (req, res, next) => {
  const { month, category, amount } = req.body;

  if (!month || !category || !amount) {
    res.status(400).json({ message: 'All fields are required.' });
    return;
  }

  try {
    const budget = await Budget.create({
      userId: req.user!.id,
      month,
      category,
      amount,
    });

    res.status(201).json({ message: 'Budget created successfully', budget });
  } catch (error) {
    console.error('❌ Create Budget Error:', error);
    next(error);
  }
};

export const getBudgets: Controller = async (req, res, next) => {
  try {
    const budgets = await Budget.findAll({
      where: { userId: req.user!.id },
      order: [['month', 'DESC']],
    });

    res.status(200).json({ message: 'Goals fetched successfully', budgets });
  } catch (error) {
    console.error('❌ Get Budgets Error:', error);
    next(error);
  }
};

export const updateBudget: Controller = async (req, res, next) => {
  const { id } = req.params;
  const { month, category, amount } = req.body;

  try {
    const budget = await Budget.findOne({
      where: { id, userId: req.user!.id },
    });

    if (!budget) {
      res.status(404).json({ message: 'Budget not found' });
      return;
    }
    budget.month = month ?? budget.month;
    budget.category = category ?? budget.category;
    budget.amount = amount ?? budget.amount;

    await budget.save();

    res.status(200).json({ message: 'Budget updated successfully', budget });
  } catch (error) {
    console.error('❌ Update Budget Error:', error);
    next(error);
  }
};

export const deleteBudget: Controller = async (req, res, next) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findOne({
      where: { id, userId: req.user!.id },
    });

    if (!budget) {
      res.status(404).json({ message: 'Budget not found' });
      return;
    }

    await budget.destroy();

    res.status(200).json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('❌ Delete Budget Error:', error);
    next(error);
  }
};
