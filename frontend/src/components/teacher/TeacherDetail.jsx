import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TeacherDetail = () => {
    const teacherformId = '672373d182c5532faa4b4a5a'; // Default value if not present
    console.log("Extracted Teacher Form ID:", teacherformId); // Log to confirm

    const [teacherDetail, setTeacherDetail] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacherDetail = async () => {
            try {
                console.log("Fetching teacher details with ID:", teacherformId);
                const response = await fetch(`http://localhost:5000/teacher-form/${teacherformId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    const errorResponse = await response.json(); // Get more info from the response
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorResponse.message || 'Unknown error'}`);
                }

                const data = await response.json();
                setTeacherDetail(data);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message || 'An error occurred while fetching teacher details.');
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherDetail();
    }, [teacherformId]);

    // Loading and error handling
    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Teacher Detail</h1>
            {teacherDetail && (
                <>
                    <div className="flex flex-col items-center mb-4">
                        {teacherDetail.profilePicture ? (
                            <img
                                src={`http://localhost:5000/teacher/${teacherDetail.profilePicture}`}
                                alt="Profile"
                                className="w-36 h-32 rounded-3xl border-2 border-black"
                            />
                        ) : (
                            <img
                                src="OIP.jpg" // Placeholder image
                                alt="Profile"
                                className="w-36 h-32 rounded-3xl border-2 border-black"
                            />
                        )}
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2">Field</th>
                                    <th className="border border-gray-300 px-4 py-2">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2"><strong>Full Name:</strong></td>
                                    <td className="border border-gray-300 px-4 py-2">{teacherDetail.fullname || 'N/A'}</td>
                                </tr>
                                {/* <tr>
                                    <td className="border border-gray-300 px-4 py-2"><strong>Location:</strong></td>
                                    <td className="border border-gray-300 px-4 py-2">{Array.isArray(teacherDetail.location) ? teacherDetail.location.join(', ') : 'N/A'}</td>
                                </tr> */}
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2"><strong>Degree:</strong></td>
                                    <td className="border border-gray-300 px-4 py-2">{teacherDetail.degree || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2"><strong>Phone Number:</strong></td>
                                    <td className="border border-gray-300 px-4 py-2">{teacherDetail.phoneNumber || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2"><strong>About Me:</strong></td>
                                    <td className="border border-gray-300 px-4 py-2">{teacherDetail.aboutMe || 'N/A'}</td>
                                </tr>
                                {/* <tr>
                                    <td className="border border-gray-300 px-4 py-2"><strong>Education Information:</strong></td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {teacherDetail.educationInformation && teacherDetail.educationInformation.length > 0
                                            ? teacherDetail.educationInformation.map((edu, index) => (
                                                <span key={index}>
                                                    {edu.board} ({edu.qualification})
                                                    {index < teacherDetail.educationInformation.length - 1 && ', '}
                                                </span>
                                            ))
                                            : 'N/A'}
                                    </td>
                                </tr> */}

                                <tr>
                                    <td className="border border-gray-300 px-4 py-2"><strong>Subjects Offered:</strong></td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {teacherDetail.subjectsOffered && teacherDetail.subjectsOffered.length > 0
                                            ? teacherDetail.subjectsOffered.map((subject, index) => (
                                                <span key={index}>
                                                    {subject.level} - {subject.subject} (RS{subject.price})
                                                    {index < teacherDetail.subjectsOffered.length - 1 && ', '}
                                                </span>
                                            ))
                                            : 'N/A'}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2"><strong>General Availability:</strong></td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {teacherDetail.generalAvailability && teacherDetail.generalAvailability.length > 0
                                            ? teacherDetail.generalAvailability.map((availability, index) => (
                                                <span key={index}>
                                                    {availability.day}: {availability.startTime} - {availability.endTime}
                                                    {index < teacherDetail.generalAvailability.length - 1 && ', '}
                                                </span>
                                            ))
                                            : 'N/A'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeacherDetail;
