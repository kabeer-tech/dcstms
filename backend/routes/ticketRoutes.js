import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { createTicket, getTickets, getTicketById, updateTicketStatus } from '../controllers/ticketController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create ticket (students only)
router.post('/', restrictTo('student'), createTicket);

// Get tickets (filtered by role)
router.get('/', getTickets);

// Get single ticket
router.get('/:id', getTicketById);

// Update ticket status (staff/admin only)
router.patch('/:id/status', restrictTo('staff', 'admin'), updateTicketStatus);

export default router;
