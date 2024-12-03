import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [activeTab, setActiveTab] = useState('students'); // Default active tab
    const navigate = useNavigate();

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/admin/dashboard/${tab}`); // Navigate to the appropriate route
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    return (
        <nav className="bg-gray-800">
            <div className="container mx-auto flex justify-between items-center py-5 px-6">
                <Link to="/admin/dashboard" className="text-white text-lg font-semibold">
                    Admin Dashboard
                </Link>
                {/* Desktop Menu */}
                <div className="hidden lg:flex lg:space-x-8">
                    <Link
                        to="students"
                        className={`text-white hover:text-gray-400 ${activeTab === 'students' ? 'font-bold' : ''}`}
                        onClick={() => handleTabClick('students')}
                    >
                        Students
                    </Link>
                    <Link
                        to="teachers"
                        className={`text-white hover:text-gray-400 ${activeTab === 'teachers' ? 'font-bold' : ''}`}
                        onClick={() => handleTabClick('teachers')}
                    >
                        Teachers
                    </Link>
                    <button className="text-white hover:text-gray-400" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
