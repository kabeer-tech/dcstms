import TicketComment from '../models/TicketComment.js';
import Ticket from '../models/Ticket.js';

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { message, visibility } = req.body;
    const ticketId = req.params.ticketId;
    
    // Check if ticket exists and user has access
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    // Check access
    if (req.user.role === 'student' && ticket.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (req.user.role === 'staff' && ticket.department.toString() !== req.user.department.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Determine visibility
    let finalVisibility = 'internal'; // default for staff
    if (req.user.role === 'student') {
      finalVisibility = 'public';
    } else if (visibility === 'public') {
      finalVisibility = 'public';
    }
    
    const comment = await TicketComment.create({
      ticket: ticketId,
      author: req.user._id,
      message,
      visibility: finalVisibility
    });
    
    await comment.populate('author', 'name role');
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get comments (filtered by visibility)
export const getComments = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    // Build query
    const query = { ticket: ticketId };
    
    // If student: only show public comments
    if (req.user.role === 'student') {
      // But only if they are the ticket owner
      if (ticket.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      query.visibility = 'public';
    }
    // If staff: show all comments on their department's tickets
    if (req.user.role === 'staff' && ticket.department.toString() !== req.user.department.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    // Admin: show all
    
    const comments = await TicketComment.find(query)
      .populate('author', 'name role')
      .sort({ createdAt: 1 });
    
    res.json({ success: true, data: comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
