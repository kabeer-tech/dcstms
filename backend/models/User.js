import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  matricNoOrStaffId: { type: String, unique: true, sparse: true },
  level: { type: String, trim: true },
  avatar: { type: String },
  isActive: { type: Boolean, default: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
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

// Instance method to generate password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Encrypt the token to save in the database
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes
  
  return resetToken; // Return the unencrypted token to send via email
};

const User = mongoose.model('User', userSchema);
export default User;
