import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Placeholder profile icon

function Navbar() {
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const profileImage = localStorage.getItem('profilePictureUrl'); // Updated variable name

    // Log the profile image URL for debugging
    useEffect(() => {
        // console.log('Profile image URL:', profileImage);
    }, [profileImage]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('teacher');
        localStorage.removeItem('profilePictureUrl'); // Update this as well
        navigate('/login');
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    // Close dropdown if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
                <h1 className="text-xl font-bold">Teacher Dashboard</h1>
                <div className="flex items-center relative" ref={dropdownRef}>
                    <Link
                        to="teacher-detail"
                        className="hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-2"
                    >
                        Teacher Form
                    </Link>
                    <Link
                        to="teacher-detail/:teacherformId"
                        className="hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-2"
                    >
                        Teacher Detail
                    </Link>
                    <Link
                        to="teacher-update"
                        className="hover:bg-gray-700 px-4 py-2 rounded-md text-sm font-medium mr-2"
                    >
                        Update Form
                    </Link>

                    <button
                        onClick={toggleDropdown}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 focus:outline-none overflow-hidden"
                    >
                        {profileImage ? (
                            <img
                                src={`http://localhost:5000/${profileImage.replace(/^src[\\\/]public[\\\/]/, '')}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = '/path/to/fallback-image.jpg'; }} // Adjust this path
                            />
                        ) : (
                            <FaUserCircle size={32} className="text-white" />
                        )}
                    </button>

                    <div
                        className={`absolute right-0 mt-[10rem] w-48 bg-gray-200 rounded-md shadow-lg z-10 transition-opacity duration-300 ${
                            dropdownOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                    >
                        <div className="py-2">
                            <Link
                                to="view-profile"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-500"
                                onClick={() => setDropdownOpen(false)}
                            >
                                View Profile
                            </Link>
                            <Link
                                to="edit-profile"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-500"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Edit Profile
                            </Link>
                            <Link
                                to="bookings"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-500"
                                onClick={() => setDropdownOpen(false)}
                            >
                                Booking
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-500"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
