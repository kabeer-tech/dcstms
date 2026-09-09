import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MagnifyingGlassIcon, ChevronDownIcon, TagIcon, ClockIcon, FolderIcon, ArrowsUpDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const statusMap = {
  submitted: { label: 'Open', class: 'bg-blue-100 text-blue-700' },
  in_review: { label: 'Pending', class: 'bg-yellow-100 text-yellow-700' },
  escalated: { label: 'Escalated', class: 'bg-orange-100 text-orange-700' },
  resolved: { label: 'Resolved', class: 'bg-green-100 text-green-700' },
  closed: { label: 'Closed', class: 'bg-gray-100 text-gray-700' },
};

const priorityMap = {
  low: { label: 'Low', class: 'text-gray-500 bg-gray-50 border border-gray-200' },
  medium: { label: 'Medium', class: 'text-yellow-600 bg-yellow-50 border border-yellow-200' },
  high: { label: 'High', class: 'text-orange-600 bg-orange-50 border border-orange-200' },
  urgent: { label: 'Urgent', class: 'text-red-600 bg-red-50 border border-red-200' },
};

const TicketList = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/tickets');
        setTickets(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(t =>
    t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Loading tickets...</div>;

  return (
    <div className="pb-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <p className="text-blue-600 font-bold text-sm mb-1">{getGreeting()}, {user?.name.split(' ')[0]}</p>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {isStaff ? 'Assigned Tickets' : 'My Tickets'}
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            {isStaff ? 'Manage and update your ticket queue' : 'Track and manage your support requests'}
          </p>
        </div>
        {isStaff && (
          <div className="bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
            {filteredTickets.length} assigned
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full max-w-sm">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={isStaff ? "Search tickets or requesters..." : "Search tickets..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium shadow-sm transition"
          />
        </div>
        
        <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {isStaff ? (
            <>
              {['Status', 'Priority', 'Category', 'Department'].map((filter) => (
                <button key={filter} className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 whitespace-nowrap hover:bg-gray-50 shadow-sm min-w-[120px]">
                  {filter} <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </>
          ) : (
            <>
              <button className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 whitespace-nowrap hover:bg-gray-50 shadow-sm min-w-[140px]">
                <span className="flex items-center gap-2"><TagIcon className="w-4 h-4 text-gray-400" /> All Types</span> <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </button>
              <button className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 whitespace-nowrap hover:bg-gray-50 shadow-sm min-w-[140px]">
                <span className="flex items-center gap-2"><ClockIcon className="w-4 h-4 text-gray-400" /> All Status</span> <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </button>
              <button className="flex items-center justify-between gap-3 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 whitespace-nowrap hover:bg-gray-50 shadow-sm min-w-[160px]">
                <span className="flex items-center gap-2"><FolderIcon className="w-4 h-4 text-gray-400" /> All Categories</span> <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="text-sm font-bold text-gray-600">{filteredTickets.length} tickets in queue</span>
        <button className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 transition">
          <ArrowsUpDownIcon className="w-4 h-4" /> Sort by priority
        </button>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[24px] shadow-sm border border-gray-100">
          <p className="text-gray-500 font-bold text-lg">No tickets found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTickets.map((ticket) => {
            const status = statusMap[ticket.status] || { label: ticket.status, class: 'bg-gray-100 text-gray-700' };
            const priority = priorityMap[ticket.priority] || { label: ticket.priority, class: 'text-gray-500 bg-gray-50 border border-gray-200' };
            
            return (
              <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="block group">
                <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6 hover:border-gray-300 hover:shadow-md transition-all h-full flex flex-col">
                  
                  <div className="flex justify-between items-start mb-5">
                    <span className="font-black text-gray-900 text-lg">#{ticket.ticketNumber}</span>
                    {isStaff ? (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${priority.class}`}>
                        {priority.label}
                      </span>
                    ) : (
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${status.class}`}>
                        {status.label}
                      </span>
                    )}
                  </div>

                  {isStaff && ticket.student && (
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-100">
                          {ticket.student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{ticket.student.name}</p>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Requester</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${status.class}`}>
                        {status.label}
                      </span>
                    </div>
                  )}

                  <p className="text-sm text-gray-800 font-medium mb-6 line-clamp-2">
                    {ticket.description}
                  </p>

                  <div className="mt-auto flex justify-between items-center text-xs font-bold text-gray-400 border-t border-gray-50 pt-4">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      <FolderIcon className="w-4 h-4" /> {ticket.department?.name || ticket.category}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4" /> 
                      {ticket.createdAt === new Date().toISOString() ? `Today, ${new Date(ticket.createdAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}` : new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {isStaff && ticket.priority === 'urgent' && ticket.status === 'submitted' && (
                    <div className="mt-4 bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl flex justify-between items-center border border-red-100">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">⚠️</span> Needs immediate attention
                      </div>
                      <span className="text-red-700 underline underline-offset-2 hover:text-red-800">Assign</span>
                    </div>
                  )}
                  
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TicketList;