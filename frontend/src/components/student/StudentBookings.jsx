import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TeacherForm from '../../../../backend/src/model/teacherFormSchema';

const StudentBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:5000/bookings/student', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log("Fetched bookings data:", response.data.bookings); // Log the fetched data here
                setBookings(response.data.bookings);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.message);
                    console.error('Error fetching bookings:', error.response.data.message);
                } else {
                    setError(error.message);
                    console.error('Error fetching bookings:', error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Your Bookings</h1>
            {loading ? (
                <div className="flex justify-center items-center">
                    <p className="text-lg">Loading...</p>
                    <div className="loader"></div> {/* You can add a spinner here */}
                </div>
            ) : error ? (
                <p className="text-red-500 font-semibold text-lg">{error}</p>
            ) : bookings.length === 0 ? (
                <p className="text-lg">No bookings found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {bookings.map(({ _id, teacher, startTime, endTime, startDate, endDate, status, subjectsOffered }) => (
                        <div key={_id} className="bg-gray-100 shadow-md rounded-lg p-4 transition-transform transform hover:scale-105">
                            <div className="flex items-center mb-2">
                                <img
                                    src={teacher.profilePicture ? `http://localhost:5000/teacher/${teacher.profilePicture}` : 'OIP.jpg'}
                                    alt="Profile"
                                    className="w-36 h-32 rounded-3xl mr-3 border-2 border-black"
                                />
                                <div>
                                    <p className="text-xl font-bold">{teacher.fullName}</p>
                                    <p className="text-gray-600 text-lg">{status}</p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-lg"><strong>Phone Number:</strong> {teacher.phoneNumber || 'N/A'}</p>
                                <p className="text-lg"><strong>Degree:</strong> {teacher.degree || 'N/A'}</p>

                                <p className="font-bold">Level: {subjectsOffered.map(subject => subject.level).join(', ') || 'N/A'}</p>
                                <p className="font-bold">Subject: {subjectsOffered.map(subject => subject.subject).join(', ') || 'N/A'}</p>
                                <p className="font-bold">Price: Rs {subjectsOffered.map(subject => subject.price).join(', ') || 'N/A'}</p>

                                <p className="text-lg"><strong>Start Time:</strong> {startTime}</p>
                                <p className="text-lg"><strong>End Time:</strong> {endTime}</p>
                                <p className="text-lg"><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}</p>
                                <p className="text-lg"><strong>End Date:</strong> {new Date(endDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentBookings;
