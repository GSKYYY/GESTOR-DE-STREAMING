import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Bell, XCircle } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = useCallback((title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    const newNotification: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      read: false,
      timestamp: new Date(),
    };
    
    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-remove toast from screen (but keep in history if needed, for now we remove from state after 5s for clean UI)
    // In a real app, you might want to separate "Toast State" from "History State". 
    // Here we will keep them in state but hide the "Toast" visually after timeout logic inside the Toast component?
    // To keep it simple: We keep them in state for history, the UI handles the "Toast" animation.
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead, removeNotification, unreadCount }}>
      {children}
      <ToastContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};

// Toast UI Components
const ToastContainer: React.FC<{ notifications: AppNotification[], removeNotification: (id: string) => void }> = ({ notifications, removeNotification }) => {
  // We only show the latest 3 unread notifications as toasts to avoid clutter
  const toastsToShow = notifications.filter(n => !n.read).slice(0, 3);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      {toastsToShow.map(notification => (
        <Toast key={notification.id} notification={notification} onClose={() => removeNotification(notification.id)} />
      ))}
    </div>
  );
};

const Toast: React.FC<{ notification: AppNotification, onClose: () => void }> = ({ notification, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Wait for animation
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-white dark:bg-slate-800 border-l-4 border-green-500',
    error: 'bg-white dark:bg-slate-800 border-l-4 border-red-500',
    warning: 'bg-white dark:bg-slate-800 border-l-4 border-amber-500',
    info: 'bg-white dark:bg-slate-800 border-l-4 border-blue-500'
  };

  return (
    <div className={`
      pointer-events-auto w-80 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 
      flex items-start gap-3 transform transition-all duration-300
      ${bgColors[notification.type]}
      ${isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
    `}>
      <div className="flex-shrink-0 mt-0.5">
        {icons[notification.type]}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-1">{notification.title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-snug">{notification.message}</p>
      </div>
      <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};