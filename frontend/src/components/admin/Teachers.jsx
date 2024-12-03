import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './../utils/Loader';
import Alert from './../utils/Alert';

const Teachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: '', message: '' });

    const fetchTeachers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/teachers'); // Ensure this route is correct
            setTeachers(res.data);
            setFilteredTeachers(res.data);
            console.log('Fetched Teachers data:', res.data); // Debugging log to check data
        } catch (error) {
            console.error('Error fetching Teachers:', error); // Log the error details
            setAlert({ type: 'error', message: 'Failed to fetch Teachers' });
        } finally {
            setLoading(false);
        }
    };

    const deleteTeacher = async (teacherId) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/teachers/${teacherId}`);
            const updatedTeachers = teachers.filter(teacher => teacher._id !== teacherId);
            setTeachers(updatedTeachers);
            setFilteredTeachers(updatedTeachers);
            setAlert({ type: 'success', message: 'Teacher deleted successfully' });
        } catch (error) {
            console.error('Error deleting teacher:', error); // Log the error details
            setAlert({ type: 'error', message: 'Failed to delete teacher' });
        } finally {
            setLoading(false);
            setTimeout(() => setAlert({ type: '', message: '' }), 5000);
        }
    };

    const searchTeacher = (e) => {
        const { value } = e.target;
        if (value.length > 0) {
            const results = teachers.filter(teacher =>
                teacher.fullName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTeachers(results);
        } else {
            setFilteredTeachers(teachers);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    return (
        <div className="p-1">
            <h1 className="text-4xl font-semibold text-center mb-1">Teachers</h1>
            <div className="flex justify-end mb-4">
                <form className="flex space-x-2">
                    <input
                        className="form-input border-gray-300 rounded-md shadow-sm"
                        type="search"
                        placeholder="Search Teacher name"
                        onChange={searchTeacher}
                    />
                    <button
                        className="bg-gray-800 text-white rounded-md px-4 py-2 hover:bg-gray-700"
                        type="button"
                    >
                        Search
                    </button>
                </form>
            </div>
            <hr className="mb-4" />
            <table className="min-w-full bg-white border border-gray-300 rounded-md">
                <thead>
                    <tr className="bg-gray-800 text-white text-center">
                        <th className="py-2 px-4">#</th>
                        <th className="py-2 px-4">Profile Image</th>
                        <th className="py-2 px-4">Full Name</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Address</th>
                        <th className="py-2 px-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && <tr><td colSpan="6" className="py-2 px-4"><Loader /></td></tr>}
                    {filteredTeachers.length > 0 ? filteredTeachers.map((teacher, index) => (
                        <tr key={teacher._id} className="text-center border-b border-gray-200">
                            <td className="py-2 px-4">{index + 1}</td>
                            <td className="py-2 px-4">
                                <img
                                    src={teacher.profilePicture || 'default-avatar.png'} // Fallback image
                                    alt={teacher.fullName}
                                    className="w-16 h-16 object-cover rounded-full"
                                />
                            </td>
                            <td className="py-2 px-4">{teacher.fullName}</td>
                            <td className="py-2 px-4">{teacher.email}</td>
                            <td className="py-2 px-4">{teacher.address}</td>
                            <td className="py-2 px-4">
                                <button
                                    className="mx-2 bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-500"
                                    onClick={() => deleteTeacher(teacher._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )) : !loading && (
                        <tr className="text-center border-b border-gray-200">
                            <td colSpan="6" className="py-2 px-4">No teachers found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {alert.message && <Alert type={alert.type} message={alert.message} />}
        </div>
    );
};

export default Teachers;
