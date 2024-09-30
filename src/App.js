import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Notifications from './components/Notifications';
import TaskForm from './components/TaskForm';
import ImportTasks from './components/ImportTasks';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <TaskProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={
                <div className="min-h-screen bg-background">
                  <div className="max-w-4xl mx-auto p-8">
                    <Notifications />
                    <Routes>
                      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                      <Route path="/admin" element={
                        <PrivateRoute>
                          {({ user }) => user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" replace />}
                        </PrivateRoute>
                      } />
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/task-form" element={<TaskForm />} />
                      <Route path="/import-tasks" element={<PrivateRoute><ImportTasks /></PrivateRoute>} />
                    </Routes>
                  </div>
                </div>
              } />
            </Routes>
          </Router>
        </TaskProvider>
      </NotificationProvider>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;