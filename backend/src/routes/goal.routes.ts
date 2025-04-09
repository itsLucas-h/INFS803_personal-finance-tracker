import { Router } from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goal.controller';
import { protect } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createGoalSchema, updateGoalSchema } from '../validators/goal.validator';

const router = Router();

router.use(protect);

router.post('/', validate(createGoalSchema), createGoal);
router.get('/', getGoals);
router.put('/:id', validate(updateGoalSchema), updateGoal);
router.delete('/:id', deleteGoal);

export default router;
