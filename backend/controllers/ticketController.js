import Ticket from '../models/Ticket.js';
import Department from '../models/Department.js';
import User from '../models/User.js';
import { logAction } from '../services/auditService.js';
import { notifyUser } from '../services/notificationService.js';

export const createTicket = async (req, res) => {
  try {
    const { ticketType, category, description, department, priority, isAnonymous } = req.body;
    const ticketNumber = Ticket.generateTicketNumber(ticketType);
    const ticket = await Ticket.create({
      ticketNumber,
      ticketType,
      category,
      description,
      department,
      priority: priority || 'medium',
      isAnonymous: isAnonymous || false,
      student: req.user._id,
      status: 'submitted'
    });
    await logAction({
      actor: req.user._id,
      action: 'TICKET_CREATED',
      targetTicket: ticket._id,
      details: { ticketType, category }
    });
    // Notify student
    await notifyUser({
      recipient: req.user,
      ticket: ticket._id,
      message: `Your ticket ${ticketNumber} has been submitted successfully.`,
      emailSubject: 'Ticket Submitted'
    });
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const { type, status, category, page = 1, limit = 10 } = req.query;
    const query = {};
    if (req.user.role === 'student') query.student = req.user._id;
    else if (req.user.role === 'staff') query.department = req.user.department;
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

export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('student', 'name email')
      .populate('department', 'name')
      .populate('assignedTo', 'name');
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (req.user.role === 'student' && ticket.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (req.user.role === 'staff' && ticket.department._id.toString() !== req.user.department.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    if (req.user.role === 'student') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const oldStatus = ticket.status;
    const oldAssigned = ticket.assignedTo;
    if (status) {
      ticket.status = status;
      if (status === 'resolved' && !ticket.resolvedAt) {
        ticket.resolvedAt = new Date();
        ticket.resolutionTime = Math.round((ticket.resolvedAt - ticket.createdAt) / (1000 * 60 * 60));
      }
      if (status === 'closed') ticket.closedAt = new Date();
    }
    if (assignedTo) {
      ticket.assignedTo = assignedTo;
    }
    await ticket.save();
    if (status && status !== oldStatus) {
      await logAction({
        actor: req.user._id,
        action: 'STATUS_CHANGED',
        targetTicket: ticket._id,
        details: { from: oldStatus, to: status }
      });
      // Notify student
      const student = await User.findById(ticket.student);
      if (student) {
        await notifyUser({
          recipient: student,
          ticket: ticket._id,
          message: `Your ticket ${ticket.ticketNumber} status changed from ${oldStatus} to ${status}`,
          emailSubject: 'Ticket Status Update'
        });
      }
    }
    if (assignedTo && assignedTo !== oldAssigned?.toString()) {
      await logAction({
        actor: req.user._id,
        action: 'ASSIGNED',
        targetTicket: ticket._id,
        details: { from: oldAssigned, to: assignedTo }
      });
    }
    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
