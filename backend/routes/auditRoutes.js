import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { getAuditLogs } from '../controllers/auditController.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/', getAuditLogs);

export default router;
