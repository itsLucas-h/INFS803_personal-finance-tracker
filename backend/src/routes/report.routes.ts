import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
  getSummaryReport,
  getTrendsReport,
  getBudgetVsActualReport,
} from '../controllers/report.controller';

const router = Router();

router.use(protect);

router.get('/summary', getSummaryReport);
router.get('/trends', getTrendsReport);
router.get('/budget-vs-actual', getBudgetVsActualReport);

export default router;
