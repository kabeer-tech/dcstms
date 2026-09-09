import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { BellIcon, CheckCircleIcon, TicketIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 font-medium text-gray-500">Loading notifications...</div>;

  return (
    <div className="max-w-4xl pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-500 text-sm font-medium">Stay updated with your ticket activities and account alerts.</p>
        </div>
        <span className="bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2 w-max">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          {notifications.filter(n => !n.isRead).length} unread
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellIcon className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-900 font-bold text-lg mb-1">All caught up!</p>
          <p className="text-gray-500 text-sm font-medium">You have no new notifications.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden p-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-4 p-4 md:p-5 rounded-2xl transition-all border-b border-gray-50 last:border-0 ${
                n.isRead ? 'opacity-70 hover:bg-gray-50' : 'bg-blue-50/30 hover:bg-blue-50/50'
              }`}
            >
              <div className={`p-3 rounded-full shrink-0 ${n.isRead ? 'bg-gray-100' : 'bg-blue-100 text-blue-600'}`}>
                {n.ticket ? <TicketIcon className="w-5 h-5" /> : <BellIcon className="w-5 h-5" />}
              </div>
              
              <div className="flex-1 min-w-0 mt-1">
                <p className={`text-sm ${n.isRead ? 'text-gray-700 font-medium' : 'text-gray-900 font-bold'}`}>
                  {n.message}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <p className="text-xs font-bold text-gray-400">
                    {new Date(n.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {n.ticket && (
                    <Link
                      to={`/tickets/${n.ticket._id}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm"
                    >
                      View Ticket &rarr;
                    </Link>
                  )}
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="shrink-0 text-blue-500 hover:text-blue-700 p-2 bg-white rounded-full border border-blue-100 shadow-sm transition"
                  title="Mark as read"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;