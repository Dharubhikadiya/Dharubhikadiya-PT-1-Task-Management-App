import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function UserList() {
  const { users, updateUserRole } = useAuth();

  const handleRoleChange = (userId, newRole) => {
    updateUserRole(userId, newRole);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="bg-white p-4 rounded-md shadow-md flex items-center justify-between">
            <span>{user.email}</span>
            <div>
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                className="p-2 border border-secondary rounded-md"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;