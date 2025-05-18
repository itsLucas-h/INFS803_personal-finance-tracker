import { Controller } from '../types/express/request.js';
import { Transaction } from '../models/index.js';

export const createTransaction: Controller = async (req, res, next) => {
  try {
    const { type, category, amount, description, date } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      category,
      amount,
      description,
      date,
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    next(error);
  }
};

export const getTransactions: Controller = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [['date', 'DESC']],
    });

    res.status(200).json({
      message: 'Transactions fetched successfully',
      transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    next(error);
  }
};

export const updateTransaction: Controller = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, category, amount, description, date } = req.body;

    const transaction = await Transaction.findByPk(id);

    if (!transaction || transaction.userId !== req.user?.id) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.update({
      type,
      category,
      amount,
      description,
      date,
    });

    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction,
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    next(error);
  }
};

export const deleteTransaction: Controller = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findByPk(id);

    if (!transaction || transaction.userId !== req.user?.id) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();

    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    next(error);
  }
};
