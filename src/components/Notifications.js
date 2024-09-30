import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';

function Notifications() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 left-4 z-50 md:left-auto">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`mb-2 p-3 rounded-md shadow-md ${
            notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'
          } text-white flex justify-between items-center`}
        >
          <span className="mr-2">{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-white font-bold"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;