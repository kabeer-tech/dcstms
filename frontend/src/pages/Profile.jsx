import { useAuth } from '../context/AuthContext';
import { EnvelopeIcon, BriefcaseIcon, IdentificationIcon, ArrowRightOnRectangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-5xl pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Profile & Settings</h1>
        <p className="text-gray-500 text-sm font-medium">Manage your account details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-4xl mb-5 border-4 border-white shadow-md">
              {user?.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <h2 className="text-2xl font-black text-gray-900">{user?.name}</h2>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-2 px-3 py-1 bg-blue-50 rounded-lg">
              {user?.role} Account
            </p>
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
                  <EnvelopeIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Email Address</p>
                  <p className="text-base font-bold text-gray-900">{user?.email}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
                  <BriefcaseIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Department</p>
                  <p className="text-base font-bold text-gray-900">{user?.department?.name || 'Not assigned'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm shrink-0">
                  <IdentificationIcon className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Matric / Staff ID</p>
                  <p className="text-base font-bold text-gray-900">{user?.matricNoOrStaffId || 'Not set'}</p>
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