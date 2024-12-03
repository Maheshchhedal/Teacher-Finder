import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from './../utils/Loader';
import Alert from './../utils/Alert';
const Students = () => {
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ type: '', message: '' });

    const fetchStudents = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/students'); // Ensure this route is correct
            setStudents(res.data);
            setFilteredStudents(res.data);
            console.log('Fetched students data:', res.data);
        } catch (error) {
            console.error('Error fetching students:', error); // Log the error details
            setAlert({ type: 'error', message: 'Failed to fetch students' });
        } finally {
            setLoading(false);
        }
    };

    const deleteStudent = async (studentId) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/students/${studentId}`);
            const updatedStudents = students.filter(student => student._id !== studentId);
            setStudents(updatedStudents);
            setFilteredStudents(updatedStudents);
            setAlert({ type: 'success', message: 'Student deleted successfully' });
        } catch (error) {
            console.error('Error deleting student:', error); // Log the error details
            setAlert({ type: 'error', message: 'Failed to delete student' });
        } finally {
            setLoading(false);
            setTimeout(() => setAlert({ type: '', message: '' }), 5000);
        }
    };

    const searchStudent = (e) => {
        const { value } = e.target;
        if (value.length > 0) {
            const results = students.filter(student =>
                student.fullName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredStudents(results);
        } else {
            setFilteredStudents(students);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="p-1">
            <h1 className="text-4xl font-semibold text-center mb-1">Students</h1>
            <div className="flex justify-end mb-4">
                <form className="flex space-x-2">
                    <input
                        className="form-input border-gray-300 rounded-md shadow-sm"
                        type="search"
                        placeholder="Search student name"
                        onChange={searchStudent}
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
                    {filteredStudents.length > 0 ? filteredStudents.map((student, index) => (
                        <tr key={student._id} className="text-center border-b border-gray-200">
                            <td className="py-2 px-4">{index + 1}</td>
                            <td className="py-2 px-4">
                                <img src={student.profilePicture} alt={student.fullName} className="w-16 h-16 object-cover rounded-full" />
                            </td>
                            <td className="py-2 px-4">{student.fullName}</td>
                            <td className="py-2 px-4">{student.email}</td>
                            <td className="py-2 px-4">{student.address}</td>
                            <td className="py-2 px-4">
                                <button
                                    className="mx-2 bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-500"
                                    onClick={() => deleteStudent(student._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )) : !loading && (
                        <tr className="text-center border-b border-gray-200">
                            <td colSpan="6" className="py-2 px-4">No students found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {alert.message && <Alert type={alert.type} message={alert.message} />}
        </div>
    );
};

export default Students;
