import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { validateTask } from '../utils/taskValidation';

const TaskContext = createContext();

export function useTasks() {  // यहाँ नाम बदला और एक्सपोर्ट किया
  return useContext(TaskContext);
}

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load tasks from localStorage when the component mounts
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const sendBrowserNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const checkDueDateReminders = useCallback(() => {
    const now = new Date();
    tasks.forEach(task => {
      if (task.dueDate && !task.completed) {
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);

        if (hoursDiff <= 24 && hoursDiff > 0) {
          addNotification(`Task "${task.description}" is due in less than 24 hours!`, 'warning');
          sendBrowserNotification(`Task Due Soon`, `"${task.description}" is due in less than 24 hours!`);
        } else if (hoursDiff <= 0) {
          addNotification(`Task "${task.description}" is overdue!`, 'error');
          sendBrowserNotification(`Task Overdue`, `"${task.description}" is overdue!`);
        }
      }
    });
  }, [tasks, addNotification]);

  useEffect(() => {
    // Check for due date reminders every minute
    const interval = setInterval(() => {
      checkDueDateReminders();
    }, 60000);

    return () => clearInterval(interval);
  }, [checkDueDateReminders]);

  const addTask = (newTask) => {
    const taskWithId = { ...newTask, id: newTask.id || Date.now() };
    setTasks(prevTasks => [...prevTasks, taskWithId]);
    addNotification(`New task "${newTask.description}" has been created.`, 'info');
  };

  const addBulkTasks = (newTasks) => {
    setTasks(prevTasks => [...prevTasks, ...newTasks]);
    addNotification(`${newTasks.length} tasks have been imported.`, 'info');
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    if (updatedTask.completed) {
      addNotification(`Task "${updatedTask.description}" has been completed.`, 'success');
    }
    if (updatedTask.assignedTo && updatedTask.assignedTo !== user.id) {
      addNotification(`Task "${updatedTask.description}" has been updated.`, 'info');
    }
  };

  const deleteTask = (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    addNotification(`Task "${taskToDelete.description}" has been deleted.`, 'info');
  };

  const getUserTasks = () => {
    return tasks.filter(task => task.assignedTo === user.id || task.createdBy === user.id);
  };

  const getAllTasks = () => {
    return tasks;
  };

  const canModifyTask = (task) => {
    return task.assignedTo === user.id || task.createdBy === user.id || user.role === 'admin';
  };

  const addComment = (taskId, comment) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newComment = {
          id: Date.now(),
          userId: user.id,
          content: comment,
          createdAt: new Date().toISOString()
        };
        const updatedComments = [...(task.comments || []), newComment];
        
        // Notify task creator and assignee
        if (task.createdBy !== user.id) {
          addNotification(`New comment on task "${task.description}"`, 'info');
        }
        if (task.assignedTo && task.assignedTo !== user.id && task.assignedTo !== task.createdBy) {
          addNotification(`New comment on task "${task.description}"`, 'info');
        }
        
        return { ...task, comments: updatedComments };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const importTasks = (importedTasks) => {
    const errors = [];
    const validTasks = [];

    importedTasks.forEach((task, index) => {
      const validationErrors = validateTask(task, tasks);
      if (validationErrors.length > 0) {
        errors.push({ row: index + 1, errors: validationErrors });
      } else {
        validTasks.push({ ...task, id: Date.now() + index });
      }
    });

    if (validTasks.length > 0) {
      setTasks(prevTasks => [...prevTasks, ...validTasks]);
    }

    return { success: validTasks.length, errors };
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask,
      addBulkTasks, 
      updateTask, 
      deleteTask, 
      getUserTasks, 
      getAllTasks, 
      canModifyTask,
      addComment,
      importTasks 
    }}>
      {children}
    </TaskContext.Provider>
  );
};