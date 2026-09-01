import { NavLink } from 'react-router-dom';
import { HomeIcon, TicketIcon, PlusIcon, BellIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 md:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <HomeIcon className="w-6 h-6" strokeWidth={2} />
          <span className="text-[10px] font-medium">Dashboard</span>
        </NavLink>

        <NavLink to="/tickets" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <TicketIcon className="w-6 h-6" strokeWidth={2} />
          <span className="text-[10px] font-medium">Tickets</span>
        </NavLink>

        {user?.role === 'student' && (
          <NavLink to="/tickets/new" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <div className={`p-3 rounded-full ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-50 text-blue-600'}`}>
              <PlusIcon className="w-6 h-6" strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-medium mt-1">New</span>
          </NavLink>
        )}

        <NavLink to="/notifications" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <div className="relative">
            <BellIcon className="w-6 h-6" strokeWidth={2} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">3</span>
          </div>
          <span className="text-[10px] font-medium">Alerts</span>
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <Bars3Icon className="w-6 h-6" strokeWidth={2} />
          <span className="text-[10px] font-medium">Menu</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
