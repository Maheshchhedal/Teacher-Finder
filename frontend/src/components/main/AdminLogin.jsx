import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from './../utils/Loader';

const AdminLogin = () => {
  const [admin, setAdmin] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const navigate = useNavigate();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setAdmin({ ...admin, [name]: value });
  };

  // Automatically hide the alert after 3 seconds
  useEffect(() => {
    if (alert.message) {
      const timeoutId = setTimeout(() => setAlert({ type: '', message: '' }), 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [alert.message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', admin);

      if (res.status === 200) {
        const { token } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('admin', true);
        setLoading(false);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setLoading(false);
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Something went wrong. Please try again later.',
      });
    }
  };

  return (
    <div className="flex h-screen">
      {alert.message && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-500 text-white py-2 px-4 rounded-md shadow-lg transition-opacity duration-500 ease-in-out">
          {alert.message}
        </div>
      )}

      {loading && <Loader />} {/* Display loader when loading */}
      
      <div className="hidden md:block w-1/3 bg-blue-500"></div> {/* Side image on medium and larger screens */}
      
      <div className="w-full md:w-2/3 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded shadow-md space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="text-gray-600 mb-4">Welcome Admin! Please log in to access your account.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={admin.email}
                  onChange={handleChangeInput}
                  placeholder="Enter email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={admin.password}
                  onChange={handleChangeInput}
                  placeholder="Password"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
