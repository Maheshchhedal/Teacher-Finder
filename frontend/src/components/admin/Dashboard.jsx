import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Students from './Students.jsx';
import Teachers from './Teachers.jsx';
import Navbar from './Navbar';

const AdminDashboard = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const getAdmin = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/admin/login');
            }
        };
        
        getAdmin();
    }, [navigate]);
    
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto py-6">
                <Routes>
                    <Route path="/students" element={<Students />} />
                    <Route path="/teachers" element={<Teachers />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;