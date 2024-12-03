import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';

import Home from './components/main/Home';
import Login from './components/main/Login';
import AdminLogin from './components/main/AdminLogin';
import Signup from './components/main/Signup';
import StudentDashboard from './components/student/Dashboard';
import TeacherDashboard from './components/teacher/Dashboard';
import AdminDashboard from './components/admin/Dashboard';

// import TeacherSearch from './components/main/TeacherSearch';
import TeacherSearchPage from './components/student/TeacherSearchPage';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const student = localStorage.getItem('student');
    const teacher = localStorage.getItem('teacher');
    const admin = localStorage.getItem('admin');

    if (token) {
      if (student) {
        navigate('/student/dashboard');
      } else if (teacher) {
        navigate('/teacher/dashboard');
      } 
      // else if (admin) {
      //   navigate('/admin/dashboard');
      // }
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup/:role" element={<Signup />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/login/admin" element={<AdminLogin />} />

        <Route path="/student/dashboard/*" element={<StudentDashboard />} />
        <Route path="/teacher/dashboard/*" element={<TeacherDashboard />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />

        {/* <Route path="/teacher-search" element={<TeacherSearch />} /> */}
        <Route path="/teacher-search" element={<TeacherSearchPage />} />


        {/* Add other routes as needed */}
        <Route path="/*" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
