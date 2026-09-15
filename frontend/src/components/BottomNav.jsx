import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, TicketIcon, PlusIcon, BellIcon, Bars3Icon, UserGroupIcon, BuildingOfficeIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { unreadCount, newTicketCount } = useNotifications();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Mobile Admin Popup Menu */}
      {showMenu && (
        <div ref={menuRef} className="fixed bottom-20 right-4 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-2 z-50 flex flex-col gap-1 w-52 md:hidden origin-bottom-right animate-in fade-in zoom-in duration-200">
          {user?.role === 'admin' && (
            <>
              <Link to="/users" onClick={() => setShowMenu(false)} className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl flex items-center gap-3 transition">
                <UserGroupIcon className="w-5 h-5" /> Manage Users
              </Link>
              <Link to="/departments" onClick={() => setShowMenu(false)} className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl flex items-center gap-3 transition">
                <BuildingOfficeIcon className="w-5 h-5" /> Departments
              </Link>
              <div className="h-px bg-gray-100 my-1"></div>
            </>
          )}
          <Link to="/profile" onClick={() => setShowMenu(false)} className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl flex items-center gap-3 transition">
            <Cog8ToothIcon className="w-5 h-5 text-gray-400" /> Profile & Settings
          </Link>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 md:hidden pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          
          <Link to="/dashboard" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <HomeIcon className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">Dashboard</span>
          </Link>

          <Link to="/tickets" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/tickets') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <div className="relative">
              <TicketIcon className="w-6 h-6" strokeWidth={2} />
              {newTicketCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[9px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-white">
                  {newTicketCount > 9 ? '9+' : newTicketCount}
                </span>
              )}
            </div>
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

          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 outline-none ${showMenu || isActive('/profile') || isActive('/users') || isActive('/departments') ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Bars3Icon className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">Menu</span>
          </button>

        </div>
      </nav>
    </>
  );
};

export default BottomNav;
