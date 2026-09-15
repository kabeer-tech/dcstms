import Ticket from '../models/Ticket.js';
import Department from '../models/Department.js';
import User from '../models/User.js';
import { logAction } from '../services/auditService.js';
import { notifyUser } from '../services/notificationService.js';

export const createTicket = async (req, res) => {
  try {
    const { title, ticketType, category, description, department, priority, isAnonymous } = req.body;
    const ticketNumber = Ticket.generateTicketNumber(ticketType);
    const ticket = await Ticket.create({
      title,
      ticketNumber,
      ticketType,
      category,
      description,
      department,
      priority: priority || 'medium',
      isAnonymous: isAnonymous || false,
      student: req.user._id,
      status: 'submitted',
      readBy: [req.user._id] // Creator has automatically "read" it
    });

    await logAction({
      actor: req.user._id,
      action: 'TICKET_CREATED',
      targetTicket: ticket._id,
      details: { title, ticketType, category }
    });

    await notifyUser({
      recipient: req.user,
      ticket: ticket._id,
      message: `Your ticket ${ticketNumber} has been submitted successfully.`,
      emailSubject: 'Ticket Submitted'
    });

    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await notifyUser({
        recipient: admin,
        ticket: ticket._id,
        message: `New ticket submitted: ${ticketNumber} - ${title}`,
        emailSubject: 'New Ticket Alert'
      });
    }

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const { type, status, category, page = 1, limit = 50 } = req.query;
    const query = {};

    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'staff') {
      const staffConditions = [{ assignedTo: req.user._id }];
      if (req.user.department) {
        staffConditions.push({ department: req.user.department });
      }
      query.$or = staffConditions;
    }

    if (type) query.ticketType = type;
    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    let tickets = await Ticket.find(query)
      .populate('student', 'name email')
      .populate('department', 'name')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    tickets = tickets.map(t => {
      const ticketObj = t.toObject();
      if (ticketObj.isAnonymous && req.user.role !== 'admin' && ticketObj.student._id.toString() !== req.user._id.toString()) {
        ticketObj.student = { _id: ticketObj.student._id, name: 'Anonymous Student', email: 'Hidden' };
      }
      return ticketObj;
    });

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
      .populate('assignedTo', 'name email');

    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    if (req.user.role === 'student' && ticket.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (req.user.role === 'staff') {
      const isAssigned = ticket.assignedTo && ticket.assignedTo._id.toString() === req.user._id.toString();
      const isSameDept = ticket.department && req.user.department && ticket.department._id.toString() === req.user.department.toString();

      if (!isAssigned && !isSameDept) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    // MARK TICKET AS VIEWED BY THIS USER
    if (!ticket.readBy.includes(req.user._id)) {
      ticket.readBy.push(req.user._id);
      await ticket.save();
    }

    const ticketObj = ticket.toObject();
    
    if (ticketObj.isAnonymous && req.user.role !== 'admin' && ticketObj.student._id.toString() !== req.user._id.toString()) {
      ticketObj.student = { _id: ticketObj.student._id, name: 'Anonymous Student', email: 'Hidden' };
    }

    res.json({ success: true, data: ticketObj });
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
    let isModified = false;

    if (status) {
      ticket.status = status;
      if (status === 'resolved' && !ticket.resolvedAt) {
        ticket.resolvedAt = new Date();
        ticket.resolutionTime = Math.round((ticket.resolvedAt - ticket.createdAt) / (1000 * 60 * 60));
      }
      if (status === 'closed') ticket.closedAt = new Date();
      isModified = true;
    }

    if (assignedTo) {
      ticket.assignedTo = assignedTo;
      isModified = true;
    }

    // RESET READ STATUS IF UPDATED
    if (isModified) {
      ticket.readBy = [req.user._id];
    }

    await ticket.save();

    if (status && status !== oldStatus) {
      await logAction({
        actor: req.user._id,
        action: 'STATUS_CHANGED',
        targetTicket: ticket._id,
        details: { from: oldStatus, to: status }
      });

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
