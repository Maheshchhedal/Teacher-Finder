import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ profilePicture }) {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    // Define a default profile image path
    const defaultProfilePicture = '/path/to/default/image.jpg'; // Make sure this path is correct

    // Determine the profile image URL
    const profileImageUrl = profilePicture 
        ? `http://localhost:5000/${profilePicture.replace('src\\public\\', '')}` 
        : defaultProfilePicture;

    return (
        <nav className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex flex-wrap items-center justify-between px-4">
                <Link to="student/dashboard" className="text-xl font-bold cursor-pointer">
                    Student Dashboard
                </Link>

                {/* Right-aligned Menu */}
                <div className="flex ml-auto space-x-2">
                    <Link to="search" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                        Find Teacher
                    </Link>
                    <Link to="student-bookings" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                        Booking Details
                    </Link>
                </div>

                {/* Profile Picture Button */}
                <div className="flex items-center relative ml-1">
                    <button
                        onClick={toggleMenu}
                        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none"
                    >
                        <img 
                            src={profileImageUrl} 
                            alt="Profile" 
                            className="w-full h-full object-cover rounded-full" 
                        />
                    </button>

                    {menuOpen && (
                        <div className="absolute w-44 bg-gray-700 rounded-md shadow-lg z-10" style={{ marginTop: '9rem' }}>
                            <Link
                                to="edit-profile"
                                className="block px-4 py-2 text-sm hover:bg-gray-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                Edit Profile
                            </Link>
                            <Link
                                to="view-profile"
                                className="block px-4 py-2 text-sm hover:bg-gray-600"
                                onClick={() => setMenuOpen(false)}
                            >
                                View Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-sm hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="lg:hidden ml-4">
                    <button
                        onClick={toggleMenu}
                        className="text-white focus:outline-none"
                    >
                        {menuOpen ? 'Close' : 'Menu'}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="lg:hidden bg-gray-700 rounded-md shadow-lg z-10 mt-2">
                    <Link
                        to="search"
                        className="block px-4 py-2 text-sm hover:bg-gray-600"
                        onClick={() => setMenuOpen(false)}
                    >
                        Find Teacher
                    </Link>
                    <Link
                        to="edit-profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-600"
                        onClick={() => setMenuOpen(false)}
                    >
                        Edit Profile
                    </Link>
                    <Link
                        to="view-profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-600"
                        onClick={() => setMenuOpen(false)}
                    >
                        View Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
