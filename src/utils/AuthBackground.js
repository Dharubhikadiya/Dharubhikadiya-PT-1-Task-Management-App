import React from 'react';

function AuthBackground({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

export default AuthBackground;