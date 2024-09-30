import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';

function CommentSection({ task }) {
  const [comment, setComment] = useState('');
  const { user } = useAuth();
  const { addComment } = useTasks();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      addComment(task.id, comment);
      setComment('');
    }
  };

  useEffect(() => {
    // Simulate real-time updates by checking for changes every second
    const interval = setInterval(() => {
      // In a real application, you would fetch updates from the server here
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <ul className="space-y-2 mb-4">
        {task.comments && task.comments.map(comment => (
          <li key={comment.id} className="bg-gray-100 p-2 rounded">
            <p className="text-sm text-gray-600">{comment.userId === user.id ? 'You' : comment.userId}</p>
            <p className='my-2'>{comment.content}</p>
            <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Comment
        </button>
      </form>
    </div>
  );
}

export default CommentSection;