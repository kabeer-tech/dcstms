import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { 
  createDepartment, 
  getDepartments, 
  deleteDepartment 
} from '../controllers/departmentController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getDepartments)
  .post(restrictTo('admin'), createDepartment);

router.route('/:id')
  .delete(restrictTo('admin'), deleteDepartment);

export default router;