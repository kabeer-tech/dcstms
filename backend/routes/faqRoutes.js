import express from 'express';
import { getFAQs, createFAQ, deleteFAQ } from '../controllers/faqController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.route('/')
  .get(getFAQs)
  .post(restrictTo('admin', 'staff'), createFAQ);

router.route('/:id')
  .delete(restrictTo('admin', 'staff'), deleteFAQ);

export default router;
