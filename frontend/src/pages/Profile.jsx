import { useAuth } from '../context/AuthContext';
import { UserIcon, EnvelopeIcon, BriefcaseIcon, IdentificationIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 md:p-8">
        <div className="flex flex-col items-center text-center mb-8 pb-8 border-b border-gray-100">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-3xl mb-4 border-4 border-white shadow-md">
            {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wide mt-1">{user?.role}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent">
            <div className="bg-white p-2 rounded-xl shadow-sm"><EnvelopeIcon className="w-5 h-5 text-gray-500" /></div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email</p>
              <p className="text-sm font-bold text-gray-900">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent">
            <div className="bg-white p-2 rounded-xl shadow-sm"><BriefcaseIcon className="w-5 h-5 text-gray-500" /></div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Department</p>
              <p className="text-sm font-bold text-gray-900">{user?.department?.name || 'Not assigned'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent">
            <div className="bg-white p-2 rounded-xl shadow-sm"><IdentificationIcon className="w-5 h-5 text-gray-500" /></div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Matric/Staff ID</p>
              <p className="text-sm font-bold text-gray-900">{user?.matricNoOrStaffId || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold text-sm py-4 rounded-xl hover:bg-red-100 transition"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
