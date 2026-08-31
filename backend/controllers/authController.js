import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, matricNoOrStaffId } = req.body;
    
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    // Hash password using static method
    const hashedPassword = await User.hashPassword(password);
    
    const user = await User.create({
      name,
      email,
      passwordHash: hashedPassword,
      role: role || 'student',
      department,
      matricNoOrStaffId
    });
    
    const token = signToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
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
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        matricNoOrStaffId: user.matricNoOrStaffId
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
