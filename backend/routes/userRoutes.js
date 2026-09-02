import express from 'express';
import { getUsers, updateUser, getStaff } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin'));

router.get('/', getUsers);
router.patch('/:id', updateUser);

// Staff list (accessible by admin and staff for assignment)
router.get('/staff', restrictTo('admin', 'staff'), getStaff);

export default router;
