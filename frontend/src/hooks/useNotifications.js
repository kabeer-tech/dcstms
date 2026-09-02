import { useState, useEffect } from 'react';
import api from '../services/api';

export const useNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications');
        const notifications = res.data.data || [];
        const unread = notifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchUnread();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return { unreadCount, loading };
};
