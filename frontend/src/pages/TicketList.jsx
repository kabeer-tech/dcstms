import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { MagnifyingGlassIcon, FunnelIcon, TagIcon, ClockIcon, FolderIcon, ArrowsUpDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const statusMap = {
  submitted: { label: 'Open', class: 'bg-blue-500 text-white' },
  in_review: { label: 'In Review', class: 'bg-blue-100 text-blue-700' },
  escalated: { label: 'Escalated', class: 'bg-orange-100 text-orange-700' },
  resolved: { label: 'Resolved', class: 'bg-green-100 text-green-700' },
  closed: { label: 'Closed', class: 'bg-gray-100 text-gray-700' },
};

const priorityMap = {
  low: { label: 'Low', class: 'text-gray-500' },
  medium: { label: 'Medium', class: 'text-blue-500' },
  high: { label: 'High', class: 'text-orange-500' },
  urgent: { label: 'Urgent', class: 'text-red-500' },
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

  if (loading) return <div className="text-center py-10 text-gray-500 font-medium">Loading tickets...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold text-gray-900">
            {isStaff ? 'Assigned Tickets' : 'My Tickets'}
          </h1>
          {isStaff && (
            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
              {filteredTickets.length} assigned
            </span>
          )}
        </div>
        <p className="text-gray-500 text-sm">
          {isStaff ? 'Manage and update your ticket queue' : 'Track and manage your support requests'}
        </p>
      </div>

      <div className="relative mb-4">
        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={isStaff ? "Search tickets or requesters..." : "Search tickets..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-medium transition shadow-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
        {isStaff ? (
          <>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 whitespace-nowrap">
              Status <ChevronRightIcon className="w-3 h-3 rotate-90" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 whitespace-nowrap">
              Priority <ChevronRightIcon className="w-3 h-3 rotate-90" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 whitespace-nowrap">
              Category <ChevronRightIcon className="w-3 h-3 rotate-90" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 whitespace-nowrap">
              Department <ChevronRightIcon className="w-3 h-3 rotate-90" />
            </button>
          </>
        ) : (
          <>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 whitespace-nowrap">
              <TagIcon className="w-4 h-4 text-gray-400" /> All Types <ChevronRightIcon className="w-3 h-3 rotate-90 text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 whitespace-nowrap">
              <ClockIcon className="w-4 h-4 text-gray-400" /> All Status <ChevronRightIcon className="w-3 h-3 rotate-90 text-gray-400" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 whitespace-nowrap">
              <FolderIcon className="w-4 h-4 text-gray-400" /> All Categories
            </button>
          </>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-gray-600">{filteredTickets.length} tickets</span>
        <button className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-gray-900">
          <ArrowsUpDownIcon className="w-4 h-4" /> Sort
        </button>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 font-medium">No tickets found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTickets.map((ticket) => {
            const status = statusMap[ticket.status] || { label: ticket.status, class: 'bg-gray-100 text-gray-700' };
            const priority = priorityMap[ticket.priority] || { label: ticket.priority, class: 'text-gray-500' };
            
            return (
              <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="block group">
                <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 p-5 group-hover:border-gray-300 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">#{ticket.ticketNumber}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${status.class}`}>
                        {status.label}
                      </span>
                    </div>
                    {isStaff ? (
                      <ChevronRightIcon className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                    ) : (
                      <span className={`text-xs font-bold ${priority.class}`}>{priority.label}</span>
                    )}
                  </div>

                  {isStaff && ticket.student && (
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {ticket.student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{ticket.student.name}</p>
                          <p className="text-xs text-gray-500 font-medium">Requester</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${priority.class}`}>{priority.label}</span>
                    </div>
                  )}

                  <p className="text-sm text-gray-800 font-medium mb-4 line-clamp-2">
                    {ticket.description}
                  </p>

                  <div className="flex justify-between items-center text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <FolderIcon className="w-4 h-4" /> {ticket.department?.name || ticket.category}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4" /> 
                      {new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {isStaff && ticket.priority === 'urgent' && ticket.status === 'submitted' && (
                    <div className="mt-4 bg-red-50 text-red-700 text-xs font-bold p-3 rounded-xl flex justify-between items-center border border-red-100">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">⚠️</span> Needs immediate attention
                      </div>
                      <span className="text-red-700">Assign</span>
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
