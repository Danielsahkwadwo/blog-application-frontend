import React, { createContext, useContext, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Notification } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      type,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Show the toast
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast(message);
        break;
      case 'warning':
        toast(message, {
          icon: '⚠️',
        });
        break;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showToast,
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            style: {
              borderLeft: '4px solid #10B981',
            },
          },
          error: {
            style: {
              borderLeft: '4px solid #EF4444',
            },
          },
        }}
      />
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext }