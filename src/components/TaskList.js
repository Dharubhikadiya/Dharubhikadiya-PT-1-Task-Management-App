import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import CommentSection from './CommentSection';

function TaskList({ tasks }) {
  const { user } = useAuth();
  const { updateTask, deleteTask, canModifyTask } = useTasks();
  const [expandedTask, setExpandedTask] = useState(null);

  const handleToggleComplete = (task) => {
    if (canModifyTask(task)) {
      updateTask({ ...task, completed: !task.completed });
    }
  };

  const handleDeleteTask = (task) => {
    if (canModifyTask(task)) {
      deleteTask(task.id);
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return 'No due date';
    const date = new Date(dueDate);
    return date.toLocaleString();
  };

  const toggleTaskExpansion = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task.id} className="bg-white p-4 rounded-md shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-2 md:mb-0">
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.title}
              </span>
              <span className="ml-2 text-sm text-gray-500">{task.category}</span>
              <div className="text-sm text-gray-500">
                <div className='my-3'>Assigned to: {task.assignedTo === user.id ? 'You' : task.assignedTo}</div>
                <div>Due: {formatDueDate(task.dueDate)}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {canModifyTask(task) && (
                <>
                  <button
                    onClick={() => handleToggleComplete(task)}
                    className="text-accent hover:text-primary transition-colors"
                  >
                    {task.completed ? 'Undo' : 'Complete'}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                onClick={() => toggleTaskExpansion(task.id)}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                {expandedTask === task.id ? 'Hide Comments' : 'Show Comments'}
              </button>
            </div>
          </div>
          {expandedTask === task.id && (
            <CommentSection task={task} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;