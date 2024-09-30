import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const newNotification = { id: Date.now(), message, type };
    setNotifications(prevNotifications => [...prevNotifications, newNotification]);

    // Remove the notification after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);

    // If the browser supports it, show a system notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Task Management App', { body: message });
    }
  };

  const removeNotification = (id) => {
    setNotifications(prevNotifications => prevNotifications.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);