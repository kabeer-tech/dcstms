import TicketComment from '../models/TicketComment.js';
import Ticket from '../models/Ticket.js';
import { logAction } from '../services/auditService.js';

export const addComment = async (req, res) => {
  try {
    const { message, visibility } = req.body;
    const ticketId = req.params.ticketId;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (req.user.role === 'student' && ticket.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (req.user.role === 'staff' && ticket.department.toString() !== req.user.department.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    let finalVisibility = 'internal';
    if (req.user.role === 'student') finalVisibility = 'public';
    else if (visibility === 'public') finalVisibility = 'public';
    const comment = await TicketComment.create({
      ticket: ticketId,
      author: req.user._id,
      message,
      visibility: finalVisibility
    });
    await comment.populate('author', 'name role');
    // Log comment
    await logAction({
      actor: req.user._id,
      action: 'COMMENT_ADDED',
      targetTicket: ticketId,
      details: { visibility: finalVisibility }
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    const query = { ticket: ticketId };
    if (req.user.role === 'student') {
      if (ticket.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      query.visibility = 'public';
    }
    if (req.user.role === 'staff' && ticket.department.toString() !== req.user.department.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const comments = await TicketComment.find(query)
      .populate('author', 'name role')
      .sort({ createdAt: 1 });
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
