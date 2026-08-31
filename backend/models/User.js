import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  matricNoOrStaffId: { type: String, unique: true, sparse: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Static method to hash password
userSchema.statics.hashPassword = async function(plainPassword) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(plainPassword, salt);
};

// Instance method to compare password
userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.passwordHash);
};

const User = mongoose.model('User', userSchema);
export default User;
