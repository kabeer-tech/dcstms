import AuditLog from '../models/AuditLog.js';

export const getAuditLogs = async (req, res) => {
  try {
    const { ticketId, limit = 50, page = 1 } = req.query;
    const query = {};
    if (ticketId) query.targetTicket = ticketId;
    const skip = (page - 1) * limit;
    const logs = await AuditLog.find(query)
      .populate('actor', 'name email')
      .populate('targetTicket', 'ticketNumber')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    const total = await AuditLog.countDocuments(query);
    res.json({
      success: true,
      data: logs,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
