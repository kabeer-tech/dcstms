import User from '../models/User.js';
import { logAction } from '../services/auditService.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate('department', 'name');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { role, isActive, department } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (department) user.department = department;
    await user.save();
    await logAction({
      actor: req.user._id,
      action: 'USER_UPDATED',
      details: { target: user._id, updates: { role, isActive, department } },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('name email department').populate('department', 'name');
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
