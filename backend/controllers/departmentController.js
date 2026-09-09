import Department from '../models/Department.js';

export const createDepartment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
    }
    
    // Extract code from req.body
    const { name, code, description } = req.body;
    
    // Validate both name and code
    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Department name and code are required' });
    }

    const department = await Department.create({ name, code, description });
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
    }

    const department = await Department.findByIdAndDelete(req.params.id);
    
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};