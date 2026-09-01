import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

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

  if (loading) return <div className="text-center py-10 font-medium text-gray-500">Loading notifications...</div>;

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">
          {notifications.filter(n => !n.isRead).length} new
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellIcon className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-900 font-bold text-lg mb-1">All caught up!</p>
          <p className="text-gray-500 text-sm font-medium">You have no new notifications.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`bg-white rounded-[20px] shadow-sm p-4 transition-all ${
                n.isRead ? 'border border-gray-100 opacity-70' : 'border-2 border-blue-100'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className={`text-sm ${n.isRead ? 'text-gray-700 font-medium' : 'text-gray-900 font-bold'}`}>
                    {n.message}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-xs font-medium text-gray-400">
                      {new Date(n.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {n.ticket && (
                      <Link
                        to={`/tickets/${n.ticket._id}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800"
                      >
                        View Ticket &rarr;
                      </Link>
                    )}
                  </div>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="text-blue-500 hover:text-blue-700 p-1 bg-blue-50 rounded-full transition"
                    title="Mark as read"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
