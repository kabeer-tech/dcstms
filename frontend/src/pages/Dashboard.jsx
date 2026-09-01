import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { PlusIcon, TicketIcon, ArrowUpRightIcon, ClockIcon, CheckCircleIcon, QueueListIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/tickets?limit=5');
        const tickets = res.data.data || [];
        const total = tickets.length;
        const open = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;
        const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;
        setStats({ total, open, resolved });
        setRecent(tickets.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusIcon = (status) => {
    if (status === 'resolved' || status === 'closed') return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    if (status === 'in_review') return <ClockIcon className="w-5 h-5 text-yellow-500" />;
    return <TicketIcon className="w-5 h-5 text-blue-500" />;
  };

  if (user?.role === 'staff' || user?.role === 'admin') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-8">
        <div>
          <p className="text-sm font-medium text-blue-600 mb-1">{user?.department?.name || 'IT Services Staff'}</p>
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-gray-900">Assigned Tickets Queue</h2>
            <span className="text-xs font-medium text-gray-400">Today</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <QueueListIcon className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Assigned</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <ClockIcon className="w-5 h-5 text-orange-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900">4</p>
              <p className="text-xs font-medium text-gray-500 mt-1">In progress</p>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-xs font-medium text-gray-500 mt-1">Resolved</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-2xl p-4 flex justify-between items-center border border-red-100">
          <div className="flex items-center gap-3">
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md">Urgent</span>
            <span className="text-sm font-semibold text-gray-900">Priority queue</span>
          </div>
          <Link to="/tickets" className="text-sm font-semibold text-blue-600 flex items-center gap-1">
            View <ArrowUpRightIcon className="w-3 h-3" />
          </Link>
        </div>
        
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
          {recent.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">No recent activity.</div>
          ) : (
            recent.map((ticket) => (
              <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="flex items-center p-4 hover:bg-gray-50 transition">
                <div className="bg-gray-50 rounded-full p-2.5 mr-4">
                  {getStatusIcon(ticket.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    Ticket #{ticket.ticketNumber}
                  </p>
                  <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{ticket.category}</p>
                </div>
                <div className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2">
                  {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-8">
      <div>
        <p className="text-blue-600 font-medium text-sm mb-1">{getGreeting()}, {user?.name.split(' ')[0]}</p>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">How can we help today?</h1>
        <p className="text-gray-500 text-sm mt-2">Track requests and get support from your department.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link to="/tickets/new" className="bg-blue-600 rounded-3xl p-5 shadow-lg shadow-blue-600/20 text-white flex flex-col h-36 relative overflow-hidden group">
          <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center mb-auto">
            <PlusIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Submit New<br/>Ticket</h3>
          </div>
          <ArrowUpRightIcon className="w-5 h-5 absolute bottom-5 right-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>

        <Link to="/tickets" className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm text-gray-900 flex flex-col h-36 relative group hover:border-gray-200 transition-all">
          <div className="bg-blue-50 w-10 h-10 rounded-full flex items-center justify-center mb-auto">
            <TicketIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">View My<br/>Tickets</h3>
          </div>
          <ArrowUpRightIcon className="w-5 h-5 absolute bottom-5 right-5 text-blue-600 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your overview</h2>
          <span className="text-xs font-medium text-gray-400">This month</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs font-medium text-gray-500 mt-1">Total tickets</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-orange-400 mb-2"></div>
            <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
            <p className="text-xs font-medium text-gray-500 mt-1">Open</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="w-2 h-2 rounded-full bg-green-500 mb-2"></div>
            <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            <p className="text-xs font-medium text-gray-500 mt-1">Resolved</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent activity</h2>
          <Link to="/tickets" className="text-sm font-semibold text-blue-600">View all</Link>
        </div>
        
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
          {recent.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">No recent activity.</div>
          ) : (
            recent.map((ticket) => (
              <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="flex items-center p-4 hover:bg-gray-50 transition">
                <div className="bg-gray-50 rounded-full p-2.5 mr-4">
                  {getStatusIcon(ticket.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    Ticket #{ticket.ticketNumber} {ticket.status === 'resolved' ? 'resolved' : ticket.status === 'submitted' ? 'submitted' : 'updated'}
                  </p>
                  <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{ticket.category}</p>
                </div>
                <div className="text-xs font-medium text-gray-400 whitespace-nowrap ml-2">
                  {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
