import { Router } from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goal.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createGoalSchema, updateGoalSchema } from '../validators/goal.validator.js';

const router = Router();

router.use(protect);

router.post('/',validate(createGoalSchema), createGoal);
router.get('/', getGoals);
router.put('/:id', validate(updateGoalSchema), updateGoal);
router.delete('/:id', deleteGoal);

export default router;
