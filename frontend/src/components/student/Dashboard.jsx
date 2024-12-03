import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './Navbar';
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';
import TeacherSearchPage from './TeacherSearchPage';
import StudentBookings from './StudentBookings'; // Import the StudentBookings component

function StudentDashboard() {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getStudent = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:5000/student/profile', {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            setStudent(response.data);
        } catch (err) {
            console.error('Error fetching student profile:', err);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudent();
    }, []);

    if (loading) return <p>Loading...</p>;

    if (!student) {
        return <p className="text-red-500">Failed to load student data. Please try again.</p>;
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 pt-16">
                <Routes>
                    <Route path="edit-profile" element={<EditProfile student={student} />} />
                    <Route path="view-profile" element={<ViewProfile student={student} />} />
                    <Route path="search" element={<TeacherSearchPage />} /> {/* Update the route to use TeacherSearchPage */}
                    <Route path="/student-bookings" element={<StudentBookings />} />
                </Routes>
            </div>
        </>
    );
}

export default StudentDashboard;
