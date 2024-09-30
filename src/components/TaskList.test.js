import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from './TaskList';
import { AuthProvider } from '../contexts/AuthContext';
import { TaskProvider } from '../contexts/TaskContext';
import { NotificationProvider } from '../contexts/NotificationContext';

const mockTasks = [
  { id: 1, description: 'Test Task 1', category: 'work', completed: false, assignedTo: 'user@example.com', dueDate: '2023-05-01T00:00:00.000Z' },
  { id: 2, description: 'Test Task 2', category: 'personal', completed: true, assignedTo: 'user@example.com', dueDate: '2023-05-02T00:00:00.000Z' },
];

const renderTaskList = () => {
  render(
    <AuthProvider>
      <NotificationProvider>
        <TaskProvider>
          <TaskList tasks={mockTasks} />
        </TaskProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

describe('TaskList', () => {
  test('renders tasks correctly', () => {
    renderTaskList();
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  test('toggles task completion', () => {
    renderTaskList();
    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  test('expands and collapses comment section', () => {
    renderTaskList();
    const showCommentsButton = screen.getAllByText('Show Comments')[0];
    fireEvent.click(showCommentsButton);
    expect(screen.getByText('Comments')).toBeInTheDocument();
    const hideCommentsButton = screen.getByText('Hide Comments');
    fireEvent.click(hideCommentsButton);
    expect(screen.queryByText('Comments')).not.toBeInTheDocument();
  });
});