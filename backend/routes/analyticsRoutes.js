import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { getAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('staff', 'admin'));

router.get('/', getAnalytics);

export default router;
