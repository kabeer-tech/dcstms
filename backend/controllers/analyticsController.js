import Ticket from '../models/Ticket.js';

export const getAnalytics = async (req, res) => {
  try {
    const match = {};
    
    // Staff can only see their department
    if (req.user.role === 'staff') {
      match.department = req.user.department;
    }
    // Admin sees all
    // Student cannot access analytics
    
    // Total tickets
    const total = await Ticket.countDocuments(match);
    
    // By type
    const byType = await Ticket.aggregate([
      { $match: match },
      { $group: { _id: '$ticketType', count: { $sum: 1 } } }
    ]);
    
    // By status
    const byStatus = await Ticket.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // By priority
    const byPriority = await Ticket.aggregate([
      { $match: match },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    // Average resolution time (in hours)
    const avgResolution = await Ticket.aggregate([
      { $match: { ...match, status: 'resolved', resolutionTime: { $exists: true } } },
      { $group: { _id: '$ticketType', avgHours: { $avg: '$resolutionTime' } } }
    ]);
    
    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = await Ticket.aggregate([
      { $match: { ...match, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            type: '$ticketType'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        byType,
        byStatus,
        byPriority,
        avgResolution,
        monthlyTrend
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
