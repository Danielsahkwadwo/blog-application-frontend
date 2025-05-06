import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export const useToast = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a NotificationProvider');
  }
  
  return {
    showToast: context.showToast,
  };
};