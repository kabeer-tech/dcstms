import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '../hooks/useNotifications';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">DCSTMS</span>
          </Link>

          {user && (
            <div className="flex items-center gap-5">
              <Link to="/notifications" className="relative hidden md:block">
                <BellIcon className="w-6 h-6 text-gray-500 hover:text-blue-600 transition" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                  <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{user.role}</span>
                </div>
                
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm cursor-pointer md:hidden">
                  {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>

                <button
                  onClick={handleLogout}
                  className="hidden md:block text-sm bg-gray-50 text-gray-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-100 transition"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
