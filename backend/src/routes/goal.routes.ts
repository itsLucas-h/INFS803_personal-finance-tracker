import { Router } from 'express';
import { createGoal, getGoals, updateGoal, deleteGoal } from '../controllers/goal.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/', createGoal);
router.get('/', getGoals);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);

export default router;
