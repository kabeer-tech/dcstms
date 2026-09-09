import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  BuildingOfficeIcon, 
  PlusIcon,
  TrashIcon,
  FolderIcon
} from '@heroicons/react/24/outline';

const Departments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) return;
    
    try {
      // Added code to the payload
      await api.post('/departments', { 
        name: newDeptName, 
        code: newDeptCode.toUpperCase(), 
        description: newDeptDesc 
      });
      setNewDeptName('');
      setNewDeptCode('');
      setNewDeptDesc('');
      setIsCreating(false);
      fetchDepartments();
    } catch (err) {
      console.error('Failed to create department:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      setDepartments(departments.filter(d => d._id !== id));
    } catch (err) {
      console.error('Failed to delete department:', err);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="p-10 text-center text-red-500 font-bold">Access Denied: Admins Only</div>;
  }

  return (
    <div className="max-w-6xl pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Departments</h1>
          <p className="text-gray-500 text-sm font-medium">Manage campus departments to organize staff and routing.</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2 w-max"
        >
          <PlusIcon className="w-5 h-5" />
          Add Department
        </button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-blue-100 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Department</h3>
          <form onSubmit={handleCreateDepartment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Department Name</label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. IT Services"
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Code</label>
                <input
                  type="text"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ITS"
                  maxLength={5}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium transition uppercase"
                  required
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Description</label>
                <input
                  type="text"
                  value={newDeptDesc}
                  onChange={(e) => setNewDeptDesc(e.target.value)}
                  placeholder="Handles technical support..."
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium transition"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
              >
                Save Department
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium">Loading departments...</div>
      ) : departments.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[32px] shadow-sm border border-gray-100">
          <BuildingOfficeIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-bold text-lg">No departments found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept._id} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 flex flex-col hover:border-gray-300 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                    <FolderIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  {dept.code && (
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border border-gray-200">
                      {dept.code}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(dept._id)}
                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                  title="Delete Department"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.name}</h3>
              <p className="text-sm font-medium text-gray-500 mb-6 flex-1">
                {dept.description || 'No description provided.'}
              </p>
              <div className="mt-auto pt-4 border-t border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                ID: {dept._id.substring(0, 8)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;