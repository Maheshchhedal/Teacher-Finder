import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './Navbar';
import EditProfile from './EditProfile';
import ViewProfile from './ViewProfile';
import TeacherDetailForm from './TeacherDetailForm'; // Existing import
import TeacherDetail from './TeacherDetail'; // New import
import TeacherUpdateForm from './TeacherUpdateForm'; // New import
import TeacherBookings from './TeacherBookings'; // Import the TeacherBookings component

function TeacherDashboard() {
    const [teacher, setTeacher] = useState(null);
    const navigate = useNavigate();

    const getTeacher = async () => {
        try {
            const storedToken = localStorage.getItem('token');
            if (!storedToken) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:5000/teacher/profile', {
                headers: {
                    Authorization: `Bearer ${storedToken}`,
                },
            });

            setTeacher(response.data);
        } catch (err) {
            console.error('Error fetching teacher profile:', err);
            navigate('/login');
        }
    };

    useEffect(() => {
        getTeacher();
    }, []);

    return (
        <>
            <Navbar profilePicture={teacher?.profilePicture} /> {/* Pass profilePicture prop to Navbar */}
            <div className="container mx-auto px-4 pt-16">
                <Routes>
                    <Route path="edit-profile" element={<EditProfile teacher={teacher} />} />
                    <Route path="view-profile" element={<ViewProfile teacher={teacher} />} />
                    <Route path="teacher-detail" element={<TeacherDetailForm />} />

                    <Route path="teacher-detail/:teacherformId" element={<TeacherDetail/>} />

                    <Route path="teacher-update" element={<TeacherUpdateForm teacherId={teacher?._id} />} />
                    <Route path="bookings" element={<TeacherBookings />} /> {/* Add the new bookings route */}
                </Routes>
            </div>
        </>
    );
}

export default TeacherDashboard;
