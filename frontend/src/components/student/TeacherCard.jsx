import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaBookOpen, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

const TeacherCard = ({ teacher }) => {
  const [showMore, setShowMore] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');

  const {
    fullname,
    subjectsOffered = [],
    distance,
    degree,
    phoneNumber,
    educationInformation = [],
    generalAvailability = [],
    aboutMe,
    booked,
    profilePicture,
  } = teacher || {};

  const level = subjectsOffered.length > 0 ? subjectsOffered[0].level : null;

  const handleBooking = async () => {
    if (!startDate || !endDate || !startTime || !endTime) {
      setErrorMessage('Please select date and time for the booking.');
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (startDateTime >= endDateTime) {
      setErrorMessage('End date and time must be after start date and time.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const checkResponse = await axios.get(
        `http://localhost:5000/bookings/check?teacherId=${teacher._id}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (checkResponse.data.success && checkResponse.data.isBooked) {
        setErrorMessage(`${fullname} is already booked by you.`);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/bookings/book',
        {
          teacherId: teacher._id,
          startDate,
          endDate,
          startTime,
          endTime,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (response.data.success) {
        alert('Booking request sent successfully!');
        setBookingSent(true);
      } else {
        setErrorMessage(response.data.message || 'Error sending booking request.');
      }
    } catch (error) {
      console.error('Error booking:', error);
      setErrorMessage('An error occurred while sending the booking request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-6 pb-6 pl-6 mb-6 border border-gray-300 rounded-lg shadow-lg bg-white transition-shadow duration-300 hover:shadow-xl">
      <div className="flex items-center gap-4">
        <div className="text-center mb-4">
          <img
            src={profilePicture ? `http://localhost:5000/teacher/${profilePicture}` : '/path/to/default.jpg'}
            alt="Profile"
            className="w-36 h-32 rounded-3xl mr-3 border-2 border-black"
          />
        </div>

        <div className="flex justify-between gap-3 items-center">
          <div>
            <p className="font-bold text-2xl mb-2">{fullname || 'N/A'}</p>
            <p className="text-lg font-semibold">
              <FaGraduationCap className="inline mr-1 text-blue-600" />
              Level: <span className="font-normal">{level ? `Level: ${level}` : 'N/A'}</span>
            </p>
          </div>

          <div>
            <p className="text-lg font-semibold">
              <FaBookOpen className="inline mr-1 text-blue-600" />
              Subjects: <span className="font-normal">{subjectsOffered.length ? subjectsOffered.map(subject => subject.subject).join(', ') : 'N/A'}</span>
            </p>
            <p className="text-lg font-semibold">
              <span className="inline mr-1 text-blue-600">रु</span>
              Price: <span className="font-normal">
                {subjectsOffered.length
                  ? subjectsOffered.map(subject => `${subject.subject}: रु ${subject.price}`).join(', ')
                  : 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-lg font-semibold">
          <FaMapMarkerAlt className="inline mr-1 text-blue-600" />
          Distance: <span className="font-normal">{distance !== undefined ? `${distance.toFixed(2)} km` : 'N/A'}</span>
        </p>
      </div>

      {showMore && (
        <div className="mt-4 text-sm leading-6 text-gray-700">
          <div className="mb-2 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-4 border-b border-gray-300">Degree</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-300">{degree || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-2 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-4 border-b border-gray-300">Phone Number</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-300">{phoneNumber?.trim() || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-2 overflow-x-auto">
            <strong className="font-semibold text-2xl">Education:</strong>
            <table className="min-w-full bg-white border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-4 border-b border-gray-300">Board</th>
                  <th className="text-left py-2 px-4 border-b border-gray-300">Qualification</th>
                </tr>
              </thead>
              <tbody>
                {educationInformation.length ? (
                  educationInformation.map((edu, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b border-gray-300">{edu.board}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{edu.qualification}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-2 px-4 text-center border-b border-gray-300">N/A</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mb-2 overflow-x-auto">
            <div className="flex items-center">
              <span><strong className="font-semibold">General Availability:</strong></span>
            </div>
            <table className="min-w-full bg-white border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-4 border-b border-gray-300">Day</th>
                  <th className="text-left py-2 px-4 border-b border-gray-300">Time</th>
                </tr>
              </thead>
              <tbody>
                {generalAvailability.length ? (
                  generalAvailability.map((availability, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b border-gray-300">{availability.day}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{`${availability.startTime} - ${availability.endTime}`}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-2 px-4 text-center border-b border-gray-300">N/A</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>




          <div className="overflow-x-auto">
            <strong className="font-semibold text-2xl">Subjects Offered:</strong>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-4 border-b border-gray-300">
                    <FaGraduationCap className="inline mr-1 text-blue-600" />
                    Level
                  </th>
                  <th className="text-left py-2 px-4 border-b border-gray-300">
                    <FaBookOpen className="inline mr-1 text-blue-600" />
                    Subjects
                  </th>
                  <th className="text-left py-2 px-4 border-b border-gray-300">
                    <span className="inline mr-1 text-blue-600">रु</span>
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjectsOffered.length ? (
                  subjectsOffered.map((subject, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b border-gray-300">{subject.level}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{subject.subject}</td>
                      <td className="py-2 px-4 border-b border-gray-300">रु {subject.price}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-2 px-4 text-center border-b border-gray-300">N/A</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mb-2 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-2 px-4 border-b border-gray-300">About Me</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b border-gray-300">{aboutMe?.trim() || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      )}

      <div className="mt-4">
        <button
          className="text-blue-600"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {isLoggedIn && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Booking:</h2>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 p-2 rounded mr-2"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 p-2 rounded mr-2"
            placeholder="End Date"
          />
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border border-gray-300 p-2 rounded mr-2"
            placeholder="Start Time"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border border-gray-300 p-2 rounded mr-2"
            placeholder="End Time"
          />
          <button
            onClick={handleBooking}
            className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
            disabled={loading || bookingSent}
          >
            {loading ? 'Sending...' : 'Send Booking Request'}
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default TeacherCard;
