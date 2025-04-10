import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getSummaryReport,
  getTrendsReport,
  getBudgetVsActualReport,
} from '../controllers/report.controller.js';

const router = Router();

router.use(protect);

router.get('/summary', getSummaryReport);
router.get('/trends', getTrendsReport);
router.get('/budget-vs-actual', getBudgetVsActualReport);

export default router;
