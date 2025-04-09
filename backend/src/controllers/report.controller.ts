import { Controller } from '../types/express/request';
import { Transaction, Budget } from '../models';
import { Op, fn, col, where, literal } from 'sequelize';

export const getSummaryReport: Controller = async (req, res, next) => {
  try {
    const month = req.query.month as string;

    if (!month) {
      return res.status(400).json({
        message: 'Month query param required (e.g., 2025-03)',
      });
    }

    const userId = req.user!.id;

    const [income, expense] = await Promise.all([
      Transaction.sum('amount', {
        where: {
          userId,
          type: 'income',
          [Op.and]: [where(fn('to_char', col('date'), 'YYYY-MM'), month)],
        },
      }),
      Transaction.sum('amount', {
        where: {
          userId,
          type: 'expense',
          [Op.and]: [where(fn('to_char', col('date'), 'YYYY-MM'), month)],
        },
      }),
    ]);

    res.status(200).json({
      month,
      income: income || 0,
      expense: expense || 0,
    });
  } catch (err) {
    next(err);
  }
};

export const getTrendsReport: Controller = async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const transactions = await Transaction.findAll({
      where: { userId },
      attributes: [
        [fn('to_char', col('date'), 'YYYY-MM'), 'month'],
        'type',
        [fn('sum', col('amount')), 'total'],
      ],
      group: ['month', 'type'],
      order: [[literal('month'), 'DESC']],
      limit: 12,
    });

    res.status(200).json({ trends: transactions });
  } catch (err) {
    next(err);
  }
};

export const getBudgetVsActualReport: Controller = async (req, res, next) => {
  try {
    const month = req.query.month as string;

    if (!month) {
      return res.status(400).json({
        message: 'Month query param required (e.g., 2025-03)',
      });
    }

    const userId = req.user!.id;

    const budgets = await Budget.findAll({
      where: { userId, month },
    });

    const expenses = await Transaction.findAll({
      where: {
        userId,
        type: 'expense',
        [Op.and]: [where(fn('to_char', col('date'), 'YYYY-MM'), month)],
      },
      attributes: ['category', [fn('sum', col('amount')), 'total']],
      group: ['category'],
    });

    res.status(200).json({
      month,
      budgets,
      actuals: expenses,
    });
  } catch (err) {
    next(err);
  }
};
