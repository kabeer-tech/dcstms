import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newTicketCount, setNewTicketCount] = useState(0); // Added for ticket icon

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      // 1. Fetch standard notifications (the bell icon)
      const res = await api.get('/notifications');
      const data = res.data.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);

      // 2. Fetch 'Submitted' (New) tickets for Admin/Staff (the ticket icon)
      if (user.role === 'admin' || user.role === 'staff') {
        const ticketRes = await api.get('/tickets?status=submitted');
        setNewTicketCount(ticketRes.data.data.length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, newTicketCount, markAsRead, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    return { unreadCount: 0, newTicketCount: 0, notifications: [], markAsRead: () => {}, markAllAsRead: () => {} };
  }
  return context;
};
