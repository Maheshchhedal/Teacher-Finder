import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../utils/Loader';
import Alert from '../utils/Alert';
import Joi from 'joi';

function Signup() {
  const { role } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [error, setError] = useState({});
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    profileImage: null
  });

  const schema = Joi.object({
    fullName: Joi.string().min(3).max(20).required().messages({
      'string.base': 'Full Name must be a string.',
      'string.empty': 'Full Name is required.',
      'string.min': 'Full Name must be at least 3 characters long.',
      'string.max': 'Full Name cannot be longer than 20 characters.',
      'any.required': 'Full Name is a required field.'
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'edu', 'pk'] } }).required().messages({
      'string.base': 'Email must be a string.',
      'string.email': 'Email must be a valid email address.',
      'string.empty': 'Email is required.',
      'any.required': 'Email is a required field.'
    }),
    password: Joi.string().min(6).max(20).required().pattern(/(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/).messages({
      'string.base': 'Password must be a string.',
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 6 characters long.',
      'string.max': 'Password cannot be longer than 20 characters.',
      'string.pattern.base': 'Password must include at least one character, one number, and one symbol.',
      'any.required': 'Password is a required field.'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
      'string.base': 'Confirm Password must be a string.',
      'string.empty': 'Confirm Password is required.',
      'any.only': 'Passwords do not match.',
      'any.required': 'Confirm Password is a required field.'
    }),
    address: Joi.string().required().messages({
      'string.base': 'Address must be a string.',
      'string.empty': 'Address is required.',
      'any.required': 'Address is a required field.'
    }),
    profileImage: Joi.any().required().messages({
      'any.required': 'Profile picture is required'
    }),
  });

  const validateField = (formData) => {
    const { error } = schema.validate(formData, { abortEarly: false });
    if (error) {
      const formattedErrors = error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setError(formattedErrors);
    } else {
      setError({});
    }
  };

  const handleChangeInput = (e) => {
    const { name, value, type, files } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: type === 'file' ? files[0] : value
    }));

    // Validate entire form after field change
    validateField({
      ...user,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate the entire form
    const { error: validationError } = schema.validate(user, { abortEarly: false });
    if (validationError) {
      const formattedErrors = validationError.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
      setError(formattedErrors);
      setLoading(false);
      return;
    }

    if (!user.profileImage) {
      setError(prevError => ({
        ...prevError,
        profileImage: 'Profile Image is required.'
      }));
      setLoading(false);
      return;
    }

    const formData = new FormData();
    for (const key in user) {
      formData.append(key, user[key]);
    }
    formData.append('role', role);

    try {
      const res = await axios.post(`http://localhost:5000/${role}/signup`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.status === 201) {
        setAlert({ type: 'success', message: 'Registration successful! Redirecting...' });

        // Redirect after 3 seconds
        setTimeout(() => navigate(`/login/${role}`), 3000);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError(prevError => ({
          ...prevError,
          email: 'Email is already in use. Please choose another one.'
        }));
      } else {
        setAlert({ type: 'error', message: err.response?.data?.message || 'An error occurred.' });
      }

      // Clear profileImage
      setUser(prevUser => ({ ...prevUser, profileImage: null }));

      // Reset the file input
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => setAlert({ type: '', message: '' }), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: '', message: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert.message]);

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {alert.message && <Alert type={alert.type} message={alert.message} />}
      {loading && <Loader loading={loading} />}
      <div className="md:w-1/2 bg-blue-500 hidden md:block"></div>
      <div className="flex-1 p-8">
        <div className="max-w-md mx-auto">
          <h3 className="text-3xl font-bold">{role === 'teacher' ? 'Teacher Registration' : 'Student Registration'}</h3>
          <p className="mb-4 text-gray-600">Please complete the form to create an account.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter Full Name"
                value={user.fullName || ''}
                onChange={handleChangeInput}
                className={`w-full p-2 border rounded ${error.fullName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {error.fullName && <div className="text-red-500 text-sm mt-1">{error.fullName}</div>}
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email"
                value={user.email || ''}
                onChange={handleChangeInput}
                className={`w-full p-2 border rounded ${error.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {error.email && <div className="text-red-500 text-sm mt-1">{error.email}</div>}
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={user.password || ''}
                onChange={handleChangeInput}
                className={`w-full p-2 border rounded ${error.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {error.password && <div className="text-red-500 text-sm mt-1">{error.password}</div>}
            </div>
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={user.confirmPassword || ''}
                onChange={handleChangeInput}
                className={`w-full p-2 border rounded ${error.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
              />
              {error.confirmPassword && <div className="text-red-500 text-sm mt-1">{error.confirmPassword}</div>}
            </div>
            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter Address"
                value={user.address || ''}
                onChange={handleChangeInput}
                className={`w-full p-2 border rounded ${error.address ? 'border-red-500' : 'border-gray-300'}`}
              />
              {error.address && <div className="text-red-500 text-sm mt-1">{error.address}</div>}
            </div>
            {/* Profile Image */}
            <div>
              <label htmlFor="profileImage" className="block text-gray-700">Profile Image</label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleChangeInput}
                ref={fileInputRef}
                className={`w-full p-2 border rounded ${error.profileImage ? 'border-red-500' : 'border-gray-300'}`}
              />
              {error.profileImage && <div className="text-red-500 text-sm mt-1">{error.profileImage}</div>}
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>
          <p className="mt-4 text-center">
            Already have an account? <Link to={`/login/${role}`} className="text-blue-600">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
