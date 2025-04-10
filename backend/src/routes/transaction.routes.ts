import { Router } from 'express';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createTransactionSchema,
  updateTransactionSchema,
} from '../validators/transaction.validator.js';

const router = Router();

router.use(protect);

router.post('/', validate(createTransactionSchema), createTransaction);
router.get('/', getTransactions);
router.put('/:id', validate(updateTransactionSchema), updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
