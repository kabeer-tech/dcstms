import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { BellIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user } = useAuth();
  const { unreadCount = 0 } = useNotifications() || {};

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <nav className="bg-white sticky top-0 z-40 border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 md:hidden">
            <ShieldCheckIcon className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">DCSTMS</span>
          </Link>

          {/* Desktop Context Header */}
          <div className="hidden md:flex flex-col justify-center">
            <p className="text-xs font-medium text-gray-500">{currentDate}</p>
            <p className="text-sm font-bold text-gray-900 capitalize">{user?.role} workspace</p>
          </div>

          {user && (
            <div className="flex items-center gap-4 ml-auto">
              <Link to="/notifications" className="relative p-2 hover:bg-gray-50 rounded-full transition">
                <BellIcon className="w-5 h-5 text-gray-700" strokeWidth={2} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Desktop User Avatar (Navigates to Profile) */}
              <Link 
                to="/profile"
                className="hidden md:flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full transition" 
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
              </Link>

              {/* Mobile User Avatar (Navigates to Profile) */}
              <Link 
                to="/profile"
                className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs md:hidden shadow-sm" 
              >
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;