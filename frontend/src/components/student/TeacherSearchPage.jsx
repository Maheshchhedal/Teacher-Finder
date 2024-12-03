// TeacherSearchPage.jsx
import React, { useState, useRef } from 'react';
import SearchForm from './SearchForm';
import TeacherCard from './TeacherCard';

const TeacherSearchPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const teachersRef = useRef(null);
  const firstTeacherRef = useRef(null);

  const fetchTeachers = async (formData) => {
    setLoading(true);
    const { level, subject, minPrice, maxPrice, latitude, longitude } = formData;
    const studentLocation = JSON.stringify({ latitude, longitude });

    const queryParams = new URLSearchParams({
      level,
      subject,
      minPrice,
      maxPrice,
      studentLocation,
    });

    const url = `http://localhost:5000/teachers/search?${queryParams.toString()}`;
    console.log('Fetching from URL:', url);

    try {
      const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setTeachers(data.teachers || []);
        setError('');

        if (data.teachers.length > 0 && firstTeacherRef.current) {
          firstTeacherRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        setShowDialog(true);
        setError('No teachers found. Please try different criteria.');
        setTeachers([]);
        setTimeout(() => setShowDialog(false), 2000);
      }
    } catch (error) {
      setError(`Error fetching teachers: ${error.message}`);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="flex justify-center text-2xl font-bold mb-4">Search for Teachers</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {showDialog && <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"><div className="bg-white rounded-lg shadow-lg p-6 text-center"><h2 className="text-lg font-semibold">Teacher not found</h2></div></div>}

      <SearchForm onSearch={fetchTeachers} loading={loading} />

      <div ref={teachersRef} className="mt-8">
        {teachers.length > 0 && (
          <div className="w-[60rem] ml-32">
            <h2 className="text-xl font-semibold mb-2">Found Teachers:</h2>
            <div className="bg-gray-300">
              {teachers.map((teacher, index) => (
                <div key={teacher._id} ref={index === 0 ? firstTeacherRef : null}>
                  <TeacherCard teacher={teacher} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherSearchPage;
