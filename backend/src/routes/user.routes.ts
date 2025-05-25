import { Router } from 'express';
import { getMe, updateMe, deleteUserByEmail } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.delete('/', protect, deleteUserByEmail);

export default router;
