import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeacherBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const teacherId = '672373d182c5532faa4b4a5a'; // Replace with dynamic ID if needed

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/bookings/${teacherId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setBookings(response.data.bookings || []);
                console.log('Fetched bookings:', response.data.bookings);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.message || 'Error fetching bookings.');
                    console.error('Error fetching bookings:', error.response.data.message);
                } else {
                    setError('Network error. Please try again later.');
                    console.error('Error fetching bookings:', error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [teacherId]);

    const handleBookingAction = async (bookingId, action) => {
        try {
            const endpoint = `http://localhost:5000/bookings/${action}/${bookingId}`;
            await axios.put(endpoint, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            // Update state to remove the accepted/rejected booking
            setBookings(prevBookings => prevBookings.filter(booking => booking._id !== bookingId));
            console.log(`${action === 'accept' ? 'Accepted' : 'Rejected'} booking with ID: ${bookingId}`);
        } catch (error) {
            setError(`Error ${action === 'accept' ? 'accepting' : 'rejecting'} booking. Please try again.`);
            console.error(`Error ${action === 'accept' ? 'accepting' : 'rejecting'} booking:`, error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Your Booking Requests</h1>
            {loading ? (
                <p className="text-lg">Loading bookings...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : bookings.length === 0 ? (
                <p>No new booking requests.</p>
            ) : (
                <ul>
                    {bookings.map(booking => (
                        <li key={booking._id} className="border-b py-4">
                            <p className="font-bold">Student: {booking.student?.fullname || 'Unknown Student'}</p>
                            <p className="font-bold">Email: {booking.student?.email || 'Unknown Email'}</p>
                            <p className="font-bold">Address: {booking.student?.address || 'Unknown Address'}</p>
                            <p className="font-bold">Level: {booking.subjectsOffered?.map(subject => subject.level).join(', ') || 'N/A'}</p>
                            <p className="font-bold">Subject: {booking.subjectsOffered?.map(subject => subject.subject).join(', ') || 'N/A'}</p>
                            <p className="font-bold">Price: ${booking.subjectsOffered?.map(subject => subject.price).join(', ') || 'N/A'}</p>
                            <p>Date: {booking.startDate || 'N/A'}</p>
                            <p>Time: {booking.startTime || 'N/A'}</p>
                            <p>Status: {booking.status}</p>
                            {booking.status === 'pending' && (
                                <div className="mt-2">
                                    <button
                                        onClick={() => handleBookingAction(booking._id, 'accept')}
                                        className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleBookingAction(booking._id, 'reject')}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TeacherBookings;
