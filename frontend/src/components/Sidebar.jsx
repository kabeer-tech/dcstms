import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import {
  HomeIcon,
  TicketIcon,
  PlusIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  Cog8ToothIcon,
  ChartPieIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unreadCount = 0, newTicketCount = 0 } = useNotifications() || {};

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Tickets', path: '/tickets', icon: TicketIcon, count: newTicketCount },
    
    // Student-specific menu
    ...(user?.role === 'student' ? [
      { name: 'New ticket', path: '/tickets/new', icon: PlusIcon },
      { name: 'FAQs', path: '/faqs', icon: QuestionMarkCircleIcon }
    ] : []),
    
    // Staff-specific menu
    ...(user?.role === 'staff' ? [
      { name: 'Answer FAQs', path: '/faqs/manage', icon: QuestionMarkCircleIcon }
    ] : []),
    
    // Admin-specific menu
    ...(user?.role === 'admin' ? [
      { name: 'Analytics', path: '/analytics', icon: ChartPieIcon },
      { name: 'Users', path: '/users', icon: UserGroupIcon },
      { name: 'Departments', path: '/departments', icon: BuildingOfficeIcon },
      { name: 'Manage FAQs', path: '/faqs/manage', icon: QuestionMarkCircleIcon }
    ] : []),
    
    { name: 'Notifications', path: '/notifications', icon: BellIcon, count: unreadCount },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-white border-r border-gray-100 z-50">

      <div className="flex items-center gap-3 px-6 h-20">
        <div className="bg-blue-600 p-2 rounded-xl shadow-sm shadow-blue-600/20">
          <ShieldCheckIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-gray-900 leading-tight tracking-tight">DCSTMS</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{user?.role} portal</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1.5 scrollbar-hide">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </div>
                {item.count > 0 && (
                  <span className={`${item.name === 'Tickets' ? 'bg-orange-500' : 'bg-red-500'} text-white text-[10px] min-w-[20px] h-[20px] flex items-center justify-center px-1 rounded-full font-bold shadow-sm`}>
                    {item.count > 9 ? '9+' : item.count}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 mt-auto relative" ref={dropdownRef}>
        {showDropdown && (
          <div className="absolute bottom-[calc(100%-10px)] left-4 right-4 bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl overflow-hidden z-50 py-1">
            <div className="px-4 py-3 border-b border-gray-50 mb-1 bg-gray-50/50">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs font-medium text-gray-500 truncate">{user?.email}</p>
            </div>

            <Link
              to="/profile"
              onClick={() => setShowDropdown(false)}
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
            >
              <Cog8ToothIcon className="w-5 h-5 text-gray-400" />
              Profile & Settings
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500" />
              Log Out securely
            </button>
          </div>
        )}

        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className={`bg-white rounded-[20px] p-3 flex items-center justify-between border shadow-sm cursor-pointer transition ${showDropdown ? 'border-blue-300 ring-4 ring-blue-50' : 'border-gray-100 hover:bg-gray-50 hover:border-gray-200'}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200">
              {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">
                {user?.role === 'admin' ? 'Administrator' : user?.role === 'staff' ? (user?.department?.name || 'Staff') : 'Student'}
              </p>
            </div>
          </div>
          <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
