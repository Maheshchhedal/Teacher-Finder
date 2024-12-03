import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './../../assets/css/home.css';
import axios from 'axios';
import Loader from '../utils/Loader';
import Alert from '../utils/Alert';
import Joi from 'joi';

function Login() {
  const { role } = useParams();
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const [user, setUser] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });

  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu', 'pk'] } })
      .required()
      .messages({ 'string.email': 'Email must be a valid email.', 'string.empty': 'Email is required.' }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({ 'string.empty': 'Password is required.', 'string.min': 'Password must be at least 6 characters.' }),
  });

  const validate = () => {
    const { error } = schema.validate(user, { abortEarly: false });
    if (error) {
      const newErrors = {};
      error.details.forEach(({ path, message }) => {
        newErrors[path[0]] = message;
      });
      setError(newErrors);
      return false;
    }
    setError({ email: '', password: '' });
    return true;
  };

  const handleChangeInput = e => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setError({ ...error, [name]: '' }); // Clear field-specific error on input change
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await axios.post(`/api/${role}/login`, user);
      if (res.status === 200) {
        const { token } = res.data;
        localStorage.setItem('token', token);
        navigate(`/${role}/dashboard`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'An error occurred during login. Please try again.';
      setAlert({ type: 'danger', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {loading && <Loader loading={loading} />}
      <div className="hidden md:flex md:flex-1 bg-gradient-to-r from-blue-500 to-blue-600">
        {/* Left side with only color */}
      </div>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">{role.charAt(0).toUpperCase() + role.slice(1)} Login</h3>

          {alert.message && <Alert type={alert.type} message={alert.message} />}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleChangeInput}
                className={`mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 ${error.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter email"
                aria-invalid={!!error.email}
                aria-describedby="email-error"
              />
              {error.email && <p id="email-error" className="text-red-500 text-sm mt-1">{error.email}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={user.password}
                onChange={handleChangeInput}
                className={`mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 ${error.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Password"
                aria-invalid={!!error.password}
                aria-describedby="password-error"
              />
              {error.password && <p id="password-error" className="text-red-500 text-sm mt-1">{error.password}</p>}
            </div>

            <button
              type="submit"
              className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center text-gray-600 mt-4">
              <p>Don't have an account? <Link to={`/signup/${role}`} className="text-blue-500 hover:underline">Signup</Link></p>
              <p><Link to="/" className="text-blue-500 hover:underline">Back to Home</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
