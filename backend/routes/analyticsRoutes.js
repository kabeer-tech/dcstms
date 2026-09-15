import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

// Only Staff and Admin can view analytics
router.use(protect);
router.get('/', restrictTo('admin', 'staff'), getAnalytics);

export default router;
