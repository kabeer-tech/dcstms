import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../services/notificationService.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, matricNoOrStaffId } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashedPassword = await User.hashPassword(password);
    const user = await User.create({
      name, email, passwordHash: hashedPassword, role: role || 'student', department, matricNoOrStaffId
    });
    const token = signToken(user._id);

    res.status(201).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordHash').populate('department');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated' });
    }
    const token = signToken(user._id);

    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, matricNoOrStaffId: user.matricNoOrStaffId } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'No user found with that email address.' });

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Build the reset URL pointing to your React frontend
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetURL = `${frontendURL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you requested a password reset.\n\nPlease click on the following link, or paste it into your browser to complete the process:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    const emailSent = await sendEmail({
      to: user.email,
      subject: 'DCSTMS Password Reset Request (Valid for 15 mins)',
      text: message
    });

    if (!emailSent) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'There was an error sending the email. Try again later.' });
    }

    res.status(200).json({ success: true, message: 'Token sent to email!' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // Hash the token from the URL to compare it with the encrypted one in the DB
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
    }

    user.passwordHash = await User.hashPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = signToken(user._id);
    res.status(200).json({ success: true, token, message: 'Password has been successfully reset' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
