import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket', required: true, index: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  visibility: { type: String, enum: ['public', 'internal'], default: 'internal' }
}, { timestamps: true });

const TicketComment = mongoose.model('TicketComment', commentSchema);
export default TicketComment;
