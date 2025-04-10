import { Router } from 'express';
import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from '../controllers/budget.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createBudgetSchema, updateBudgetSchema } from '../validators/budget.validator.js';

const router = Router();

router.use(protect);

router.post('/', validate(createBudgetSchema), createBudget);
router.get('/', getBudgets);
router.put('/:id', validate(updateBudgetSchema), updateBudget);
router.delete('/:id', deleteBudget);

export default router;
