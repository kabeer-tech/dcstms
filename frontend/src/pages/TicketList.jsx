import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

const statusMap = {
  submitted: { label: 'Submitted', class: 'badge-submitted' },
  in_review: { label: 'In Review', class: 'badge-in_review' },
  escalated: { label: 'Escalated', class: 'badge-escalated' },
  resolved: { label: 'Resolved', class: 'badge-resolved' },
  closed: { label: 'Closed', class: 'badge-closed' },
};

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get('/tickets');
        setTickets(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
        {user?.role === 'student' && (
          <Link to="/tickets/new" className="btn-primary">
            + New Ticket
          </Link>
        )}
      </div>

      {tickets.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No tickets found.</p>
          <p className="text-gray-400 text-sm">Submit your first ticket now!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const statusInfo = statusMap[ticket.status] || { label: ticket.status, class: 'badge' };
            return (
              <Link key={ticket._id} to={`/tickets/${ticket._id}`} className="block">
                <div className="card hover:border-blue-300 border-2 border-transparent transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {ticket.ticketNumber}
                        </span>
                        <span className="text-xs uppercase font-semibold text-gray-500">
                          {ticket.ticketType}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-700">{ticket.description.slice(0, 120)}...</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
                        <span className="badge bg-gray-100 text-gray-700">Priority: {ticket.priority}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xl">→</span>
                  </div>
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
