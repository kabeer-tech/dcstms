import express from 'express';
import { protect } from '../middleware/auth.js';
import { addComment, getComments } from '../controllers/commentController.js';

const router = express.Router();

router.use(protect);

// Add comment to a ticket
router.post('/:ticketId', addComment);

// Get comments for a ticket (filtered by visibility)
router.get('/:ticketId', getComments);

export default router;
