import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

const EditProfile = () => {
    const [profile, setProfile] = useState({
        fullName: '',
        address: '',
        email: '',
        profileImage: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserId(decodedToken.id);
            } catch (err) {
                console.error('Error decoding token:', err);
                setError('Failed to decode token.');
            }
        } else {
            setError('No token found.');
        }
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;

            try {
                const response = await axios.get(`http://localhost:5000/teacher/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(response.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Error fetching profile: ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('fullName', profile.fullName);
        formData.append('address', profile.address);
        formData.append('email', profile.email);
        if (file) {
            formData.append('profileImage', file);
        }

        try {
            const url = `http://localhost:5000/teacher/update/${userId}`;
            const response = await axios.put(url, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 2000);
        } catch (err) {
            setError('Failed to update profile: ' + (err.response?.data?.msg || err.message));
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className=" bg-gray-50 container mx-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-4 text-center">Edit Profile</h1>
                {successMessage && (
                    <div className="bg-green-500 text-white p-2 rounded-md text-center mb-4">
                        {successMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="fullName">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="address">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="profileImage">
                            Profile Image
                        </label>
                        <input
                            type="file"
                            id="profileImage"
                            name="profileImage"
                            onChange={handleFileChange}
                            className="mt-1 block w-1/4 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-1/6 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
