import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, TicketIcon, PlusIcon, BellIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        <Link to="/dashboard" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <HomeIcon className="w-6 h-6" strokeWidth={2} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>

        <Link to="/tickets" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/tickets') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <TicketIcon className="w-6 h-6" strokeWidth={2} />
          <span className="text-[10px] font-medium">Tickets</span>
        </Link>

        {user?.role === 'student' && (
          <Link to="/tickets/new" className={`flex flex-col items-center justify-center w-full h-full ${isActive('/tickets/new') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <div className={`p-3 rounded-full ${isActive('/tickets/new') ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600'}`}>
              <PlusIcon className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-medium mt-1">New</span>
          </Link>
        )}

        <Link to="/notifications" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/notifications') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <div className="relative">
            <BellIcon className="w-6 h-6" strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Alerts</span>
        </Link>

        <Link to="/profile" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/profile') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <Bars3Icon className="w-6 h-6" strokeWidth={2} />
          <span className="text-[10px] font-medium">Menu</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
