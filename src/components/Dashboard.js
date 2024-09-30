import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import CSVImportExport from './CSVImportExport';

function Dashboard() {
  const { user, logout } = useAuth();
  const { getUserTasks, addTask } = useTasks();
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const tasks = getUserTasks();

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = statusFilter === 'all' || task.status === statusFilter;
      const priorityMatch = priorityFilter === 'all' || task.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });
  }, [tasks, statusFilter, priorityFilter]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Task Management</h1>
        <div>
          <span className="mr-4 text-primary">Welcome, {user.email}</span>
          <button
            onClick={logout}
            className="bg-secondary text-white py-2 px-4 rounded-md hover:bg-primary transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      <TaskForm addTask={addTask} />
      <CSVImportExport />
      <div className="my-4 flex space-x-4">
        <div>
          <label htmlFor="status" className="mr-2">Filter by status:</label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-secondary rounded-md"
          >
            <option value="all">All</option>
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="mr-2">Filter by priority:</label>
          <select
            id="priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 border border-secondary rounded-md"
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <TaskList tasks={filteredTasks} />
    </div>
  );
}

export default Dashboard;