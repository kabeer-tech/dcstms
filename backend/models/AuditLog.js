import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { 
    type: String, 
    enum: ['STATUS_CHANGED', 'ASSIGNED', 'COMMENT_ADDED', 'TICKET_CREATED', 'TICKET_CLOSED', 'USER_UPDATED', 'TICKET_ESCALATED'],
    required: true 
  },
  targetTicket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' },
  details: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: false });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
export default AuditLog;
