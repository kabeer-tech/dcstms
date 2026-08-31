import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true, index: true },
  ticketType: { 
    type: String, 
    enum: ['complaint', 'service_request'], 
    required: true 
  },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, required: true },
  description: { type: String, required: true, minlength: 10 },
  status: { 
    type: String, 
    enum: ['submitted', 'in_review', 'escalated', 'resolved', 'closed'], 
    default: 'submitted' 
  },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  isAnonymous: { type: Boolean, default: false },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number
  }],
  resolvedAt: Date,
  closedAt: Date,
  resolutionTime: Number
}, { timestamps: true });

// Static method to generate ticket number
ticketSchema.statics.generateTicketNumber = function(ticketType) {
  const prefix = ticketType === 'complaint' ? 'CMP' : 'SRV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
};

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
