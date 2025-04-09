import { Router } from 'express';
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from '../controllers/budget.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createBudgetSchema, updateBudgetSchema } from '../validators/budget.validator';

const router = Router();

router.use(protect);

router.post('/', validate(createBudgetSchema), createBudget);
router.get('/', getBudgets);
router.put('/:id', validate(updateBudgetSchema), updateBudget);
router.delete('/:id', deleteBudget);

export default router;
