import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  PlusIcon, 
  TicketIcon, 
  ArrowUpRightIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  InboxStackIcon, 
  LightBulbIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0, urgent: 0 });
  const [recent, setRecent] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/tickets');
        const allTickets = res.data.data || [];
        setTickets(allTickets);

        setStats({ 
          total: allTickets.length, 
          open: allTickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length,
          inProgress: allTickets.filter(t => t.status === 'in_review' || t.status === 'escalated').length,
          resolved: allTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
          urgent: allTickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved' && t.status !== 'closed').length
        });
        
        setRecent(allTickets.slice(0, 6)); 
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusIcon = (status) => {
    if (status === 'resolved' || status === 'closed') 
      return <div className="bg-green-50 p-2.5 rounded-xl border border-green-100 shrink-0"><CheckCircleIcon className="w-5 h-5 text-green-500" /></div>;
    if (status === 'in_review') 
      return <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-100 shrink-0"><ClockIcon className="w-5 h-5 text-orange-500" /></div>;
    return <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 shrink-0"><TicketIcon className="w-5 h-5 text-blue-500" /></div>;
  };

  const priorityQueue = tickets
    .filter(t => t.status !== 'resolved' && t.status !== 'closed')
    .filter(t => t.ticketNumber.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const p = { urgent: 4, high: 3, medium: 2, low: 1 };
      return (p[b.priority] || 0) - (p[a.priority] || 0);
    })
    .slice(0, 6);

  if (user?.role === 'staff' || user?.role === 'admin') {
    return (
      <div className="space-y-6 md:space-y-8 pb-8">
        <div>
          <p className="text-blue-600 font-bold text-sm mb-1">{getGreeting()}, {user?.name.split(' ')[0]}</p>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900">{user?.role === 'admin' ? 'Admin Dashboard' : 'Staff Dashboard'}</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Manage your assigned service requests and complaints.</p>
        </div>

        <div>
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-gray-900">Assigned Tickets Queue</h2>
            <div className="bg-white border border-gray-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer shadow-sm hover:bg-gray-50 transition">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Today 
              <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-gray-900">{stats.total}</p>
                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">Assigned</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                <InboxStackIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-gray-900">{stats.inProgress}</p>
                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">In progress</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100 shrink-0">
                <ClockIcon className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-gray-900">{stats.resolved}</p>
                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">Resolved</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shrink-0">
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">Priority queue</h2>
                {stats.urgent > 0 && (
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    {stats.urgent} urgent
                  </span>
                )}
              </div>
              <Link to="/tickets" className="text-sm font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap">View all tickets</Link>
            </div>
            
            <div className="relative mb-5">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search assigned tickets..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium shadow-sm transition" 
              />
            </div>

            <div className="space-y-3">
              {priorityQueue.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-100 text-sm font-medium text-gray-500 shadow-sm">
                  {search ? 'No tickets match your search.' : 'Queue is empty.'}
                </div>
              ) : (
                priorityQueue.map((ticket) => (
                  <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-center gap-3 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                      <div className={`shrink-0 p-2.5 rounded-xl border ${ticket.priority === 'urgent' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
                        <TicketIcon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-bold text-gray-900 truncate">#{ticket.ticketNumber}</span>
                        <span className="text-xs font-medium text-gray-500 truncate mt-0.5">{ticket.description}</span>
                      </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-300 shrink-0 group-hover:text-blue-500 transition-colors" />
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent activity</h2>
              <Link to="/tickets" className="text-sm font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap">View all</Link>
            </div>
            
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-2 mb-6">
              {recent.length === 0 ? (
                <div className="p-8 text-center text-sm font-medium text-gray-500">No recent activity.</div>
              ) : (
                recent.slice(0, 4).map((ticket) => (
                  <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="flex items-center p-3 md:p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition rounded-2xl group">
                    <div className="mr-3 md:mr-4 shrink-0">
                      {getStatusIcon(ticket.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        Ticket #{ticket.ticketNumber}
                      </p>
                      <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{ticket.category}</p>
                    </div>
                    <div className="text-xs font-bold text-gray-400 whitespace-nowrap ml-2 md:ml-3 shrink-0">
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="bg-blue-50 rounded-3xl p-5 md:p-6 border border-blue-100 flex gap-4 items-start shadow-sm">
              <div className="bg-blue-500 p-2.5 rounded-full shrink-0 shadow-sm">
                <LightBulbIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900">Keep your queue moving</p>
                <p className="text-xs font-medium text-gray-600 mt-1.5 leading-relaxed">Resolve or update tickets regularly to keep response times low.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="space-y-6 md:space-y-8 pb-8">
      <div>
        <p className="text-blue-600 font-bold text-sm mb-1">{getGreeting()}, {user?.name.split(' ')[0]}</p>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight">How can we help today?</h1>
        <p className="text-gray-500 text-sm mt-2 font-medium">Track requests and get support from your department.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/tickets/new" className="bg-blue-500 rounded-[24px] p-6 shadow-md text-white relative overflow-hidden group h-36 md:h-40 flex flex-col justify-end">
          <div className="bg-white/20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center absolute top-5 left-5 md:top-6 md:left-6 backdrop-blur-sm">
            <PlusIcon className="w-5 h-5 md:w-6 md:h-6 text-white" strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-lg md:text-xl z-10">Submit New Ticket</h3>
          <ArrowUpRightIcon className="w-5 h-5 md:w-6 md:h-6 absolute bottom-6 right-6 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>

        <Link to="/tickets" className="bg-white border border-gray-200 rounded-[24px] p-6 shadow-sm text-gray-900 relative group h-36 md:h-40 flex flex-col justify-end hover:border-gray-300 hover:shadow-md transition-all">
          <div className="bg-blue-50 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center absolute top-5 left-5 md:top-6 md:left-6 border border-blue-100">
            <TicketIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-lg md:text-xl">View My Tickets</h3>
          <ArrowUpRightIcon className="w-5 h-5 md:w-6 md:h-6 absolute bottom-6 right-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </Link>
      </div>

      <div>
        <div className="flex flex-wrap justify-between items-end gap-2 mb-4">
          <h2 className="text-lg font-bold text-gray-900">Your overview</h2>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">This month</span>
        </div>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mt-auto">
              <p className="text-2xl md:text-3xl font-black text-gray-900">{stats.total}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Total</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col">
            <div className="w-2 h-2 rounded-full bg-orange-400 mb-2"></div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mt-auto">
              <p className="text-2xl md:text-3xl font-black text-gray-900">{stats.open}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Open</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col">
            <div className="w-2 h-2 rounded-full bg-green-500 mb-2"></div>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2 mt-auto">
              <p className="text-2xl md:text-3xl font-black text-gray-900">{stats.resolved}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <h2 className="text-lg font-bold text-gray-900">Recent activity</h2>
          <Link to="/tickets" className="text-sm font-bold text-blue-600 hover:text-blue-700 whitespace-nowrap">View all</Link>
        </div>
        
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden p-2">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-sm font-medium text-gray-500">No recent activity.</div>
          ) : (
            recent.map((ticket) => (
              <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="flex items-center p-3 md:p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition rounded-2xl group">
                <div className="mr-3 md:mr-4 shrink-0">{getStatusIcon(ticket.status)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    Ticket #{ticket.ticketNumber}
                  </p>
                  <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{ticket.description}</p>
                </div>
                <div className="text-xs font-bold text-gray-400 whitespace-nowrap ml-2 md:ml-4 shrink-0">
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
