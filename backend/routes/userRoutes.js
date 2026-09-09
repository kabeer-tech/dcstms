import express from 'express';
import { getUsers, updateUserRole, deleteUser, getStaff } from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Staff list MUST come before the global admin restriction 
// so that standard staff members can fetch it to assign tickets
router.get('/staff', restrictTo('admin', 'staff'), getStaff);

// Apply admin restriction to all routes below this line
router.use(restrictTo('admin'));

router.get('/', getUsers);
router.patch('/:id/role', updateUserRole); 
router.delete('/:id', deleteUser);

export default router;