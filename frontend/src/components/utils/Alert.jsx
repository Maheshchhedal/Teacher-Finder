import React, { useState } from 'react';

const Alert = ({ type, message }) => {
  const [visible, setVisible] = useState(true);

  const alertClasses = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
  };

  if (!visible || !message) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 p-4 mb-4 border rounded shadow-lg ${alertClasses[type] || 'bg-gray-100 text-gray-800'}`}
      style={{ zIndex: 1000 }}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={() => setVisible(false)}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
