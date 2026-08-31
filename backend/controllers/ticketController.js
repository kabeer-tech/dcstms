import Ticket from '../models/Ticket.js';

// Create a new ticket
export const createTicket = async (req, res) => {
  try {
    const { ticketType, category, description, department, priority, isAnonymous } = req.body;
    
    const ticket = await Ticket.create({
      ticketType,
      category,
      description,
      department,
      priority: priority || 'medium',
      isAnonymous: isAnonymous || false,
      student: req.user._id,
      status: 'submitted'
    });
    
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get tickets (filtered by role)
export const getTickets = async (req, res) => {
  try {
    const { type, status, category, page = 1, limit = 10 } = req.query;
    const query = {};
    
    // Role-based filtering
    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'staff') {
      query.department = req.user.department;
    }
    // Admin sees all
    
    if (type) query.ticketType = type;
    if (status) query.status = status;
    if (category) query.category = category;
    
    const skip = (page - 1) * limit;
    const tickets = await Ticket.find(query)
      .populate('student', 'name email')
      .populate('department', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Ticket.countDocuments(query);
    
    res.json({
      success: true,
      data: tickets,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('student', 'name email')
      .populate('department', 'name')
      .populate('assignedTo', 'name');
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    // Check access: student can only see their own tickets
    if (req.user.role === 'student' && ticket.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    // Staff can only see tickets in their department
    if (req.user.role === 'staff' && ticket.department._id.toString() !== req.user.department.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    // Only staff or admin can update
    if (req.user.role === 'student') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    if (status) {
      ticket.status = status;
      if (status === 'resolved') {
        ticket.resolvedAt = new Date();
        ticket.resolutionTime = Math.round((ticket.resolvedAt - ticket.createdAt) / (1000 * 60 * 60));
      }
      if (status === 'closed') {
        ticket.closedAt = new Date();
      }
    }
    
    if (assignedTo) {
      ticket.assignedTo = assignedTo;
    }
    
    await ticket.save();
    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
