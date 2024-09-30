import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import UserList from './UserList';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const { getAllTasks, addTask, updateTask, deleteTask } = useTasks();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  const tasks = getAllTasks();

  const filteredTasks = tasks.filter(task => 
    (selectedCategory === 'all' || task.category === selectedCategory) &&
    (selectedUser === 'all' || task.userId === selectedUser)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
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
      <TaskForm addTask={addTask} isAdmin={true} />
      <div className="mb-4 flex space-x-4">
        <div>
          <label htmlFor="category" className="mr-2">Filter by category:</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border border-secondary rounded-md"
          >
            <option value="all">All</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="user" className="mr-2">Filter by user:</label>
          <select
            id="user"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 border border-secondary rounded-md"
          >
            <option value="all">All Users</option>
            {/* Add options for each user */}
          </select>
        </div>
      </div>
      <TaskList tasks={filteredTasks} updateTask={updateTask} deleteTask={deleteTask} isAdmin={true} />
      <UserList />
    </div>
  );
}

export default AdminDashboard;