import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  EnvelopeIcon, 
  BriefcaseIcon, 
  IdentificationIcon, 
  ArrowRightOnRectangleIcon, 
  ShieldCheckIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, checkAuth } = useAuth(); // Assuming checkAuth refreshes user context
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department?._id || '',
    matricNoOrStaffId: user?.matricNoOrStaffId || '',
    level: user?.level || '',
    avatar: user?.avatar || ''
  });

  useEffect(() => {
    // Fetch departments for the dropdown
    api.get('/departments').then(res => setDepartments(res.data.data)).catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put('/users/profile', formData);
      if (checkAuth) await checkAuth(); // Refresh global user state
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile. Ensure your Matric/Staff ID is unique.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl pb-10">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Profile & Settings</h1>
          <p className="text-gray-500 text-sm font-medium">Manage your account details and preferences.</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-2"
          >
            <PencilSquareIcon className="w-4 h-4 text-gray-500" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircleIcon className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
            
            <div className="relative group mb-5">
              <div className="w-32 h-32 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-4xl border-4 border-white shadow-md overflow-hidden bg-cover bg-center" style={{ backgroundImage: formData.avatar ? `url(${formData.avatar})` : 'none' }}>
                {!formData.avatar && (user?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase())}
              </div>
              
              {isEditing && (
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <CameraIcon className="w-8 h-8 text-white" />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              )}
            </div>

            {isEditing ? (
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                className="w-full text-center text-xl font-black text-gray-900 border-b-2 border-blue-500 outline-none pb-1 bg-transparent"
              />
            ) : (
              <h2 className="text-2xl font-black text-gray-900">{user?.name}</h2>
            )}

            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-3 px-3 py-1 bg-blue-50 rounded-lg">
              {user?.role} Account
            </p>
            {user?.level && !isEditing && (
              <p className="text-xs font-bold text-gray-500 mt-2">{user.level}</p>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold text-sm py-3.5 rounded-xl hover:bg-red-100 transition shadow-sm"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Log Out securely
            </button>
          </div>
        </div>

        {/* Right Column: Account Details */}
        <div className="md:col-span-8">
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-6 md:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6 text-blue-600" /> Account Information
            </h3>

            <div className="space-y-4">
              {/* Email (Non-editable for security) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
                  <EnvelopeIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Email Address (Locked)</p>
                  <p className="text-base font-bold text-gray-900">{user?.email}</p>
                </div>
              </div>

              {/* Department */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
                  <BriefcaseIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Department</p>
                  {isEditing && (user?.role === 'staff' || user?.role === 'admin' || user?.role === 'student') ? (
                    <select 
                      name="department" 
                      value={formData.department} 
                      onChange={handleChange}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500 outline-none p-2.5 shadow-sm mt-1"
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => (
                        <option key={d._id} value={d._id}>{d.name}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-base font-bold text-gray-900">{user?.department?.name || 'Not assigned'}</p>
                  )}
                </div>
              </div>

              {/* Matric / Staff ID */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
                  <IdentificationIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Matric / Staff ID</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="matricNoOrStaffId"
                      value={formData.matricNoOrStaffId} 
                      onChange={handleChange}
                      placeholder="e.g. UG22/SCCS/1078"
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500 outline-none p-2.5 shadow-sm mt-1"
                    />
                  ) : (
                    <p className="text-base font-bold text-gray-900">{user?.matricNoOrStaffId || 'Not set'}</p>
                  )}
                </div>
              </div>

              {/* Academic Level / Rank */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
                  <AcademicCapIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Level / Rank</p>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="level"
                      value={formData.level} 
                      onChange={handleChange}
                      placeholder={user?.role === 'student' ? 'e.g. 400L' : 'e.g. Senior Lecturer'}
                      className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-xl focus:ring-2 focus:ring-blue-500 outline-none p-2.5 shadow-sm mt-1"
                    />
                  ) : (
                    <p className="text-base font-bold text-gray-900">{user?.level || 'Not set'}</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
