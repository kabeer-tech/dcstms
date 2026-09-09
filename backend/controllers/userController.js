import User from '../models/User.js';
import { logAction } from '../services/auditService.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('department', 'name');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Prevent admin from locking themselves out by changing their own role
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot change your own role.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await logAction({
      actor: req.user._id,
      action: 'USER_ROLE_UPDATED',
      details: { target: user._id, from: oldRole, to: role },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStaff = async (req, res) => {
  try {
    // Include both staff and admins so tickets can be assigned to either
    const staff = await User.find({ role: { $in: ['staff', 'admin'] } })
      .select('name email department')
      .populate('department', 'name');
      
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Prevent an admin from deleting themselves
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await logAction({
      actor: req.user._id,
      action: 'USER_DELETED',
      details: { target: req.params.id, email: user.email },
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};