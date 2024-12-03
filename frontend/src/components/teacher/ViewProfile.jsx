import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/teacher/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log('Profile Data:', response.data); // Log the profile data
                setProfile(response.data);
            } catch (err) {
                console.error('Error fetching profile:', err); // Log the error
                setError('Error fetching profile: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    const profileImageUrl = profile?.profileImage
        ? `http://localhost:5000/${profile.profileImage.replace('src\\public\\', '')}` // Adjust this based on your setup
        : '/path/to/default/image.jpg'; // Set a default image if none exists

    return (
        <div className="container mx-auto p-4 flex flex-col items-center">
            {profile ? (
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-4 text-center">teacher Profile</h1>
                    <div className="mb-4 flex flex-col items-center text-center">
                        {profile.profileImage ? (
                            <img 
                                src={profileImageUrl} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full mb-4 object-cover" 
                                style={{ display: 'block' }} // Ensure the image is displayed as a block element
                            />
                        ) : (
                            <p>No profile image available</p>
                        )}
                        <h2 className="text-xl font-semibold mb-2">Full Name: {profile.fullName}</h2>
                        <p className="text-gray-700 mb-2">Email: {profile.email}</p>
                        <p className="text-gray-700">Address: {profile.address}</p>
                    </div>
                </div>
            ) : (
                <p>No profile data available</p>
            )}
        </div>
    );
};

export default ViewProfile;
