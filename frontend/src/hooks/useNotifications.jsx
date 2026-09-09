import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      const data = res.data.data || [];
      setNotifications(data);
      // Count how many notifications are NOT marked as read
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications(); // Refresh the count
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications(); // Refresh the count
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to be used in Navbar, Sidebar, and BottomNav
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    // Failsafe empty state so the UI doesn't crash if the provider isn't wrapped yet
    return { unreadCount: 0, notifications: [], markAsRead: () => {}, markAllAsRead: () => {} };
  }
  return context;
};
