import User from '../models/User.js';

// 1. Get all users (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').populate('department', 'name');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Update user role (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { role, department } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (role) user.role = role;
    if (department !== undefined) user.department = department || null;

    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Delete user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Get staff (For assigning tickets)
export const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ['staff', 'admin'] } }).select('-passwordHash');
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Update Profile (Current logged-in user)
export const updateProfile = async (req, res) => {
  try {
    const { name, department, matricNoOrStaffId, level, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name) user.name = name;
    if (department) user.department = department;
    if (matricNoOrStaffId) user.matricNoOrStaffId = matricNoOrStaffId;
    if (level) user.level = level;
    if (avatar !== undefined) user.avatar = avatar; 

    await user.save();
    
    const updatedUser = await User.findById(user._id).populate('department', 'name').select('-passwordHash');
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
