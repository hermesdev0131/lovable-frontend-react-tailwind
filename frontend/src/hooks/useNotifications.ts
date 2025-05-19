
import { useState, useEffect } from 'react';
import { Notification } from '@/types/masterAccount';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export function useNotifications(isInMasterMode: boolean, currentClientId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    setNotifications([newNotification, ...notifications]);
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const getNotifications = (forClientId?: string | null) => {
    return notifications.filter(notification => {
      if (forClientId !== undefined) {
        if (notification.forClientId !== forClientId) return false;
      } else if (!isInMasterMode && currentClientId !== null) {
        if (notification.forClientId !== currentClientId && notification.forClientId !== null) return false;
      }
      
      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getUnreadNotificationsCount = (forClientId?: string | null) => {
    return getNotifications(forClientId).filter(notification => !notification.read).length;
  };

  return {
    notifications,
    addNotification,
    markNotificationAsRead,
    getNotifications,
    getUnreadNotificationsCount
  };
}
