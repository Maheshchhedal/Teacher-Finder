import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TeacherUpdateForm = ({ teacherId, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    degree: '',
    phoneNumber: '',
    aboutMe: '',
    educationInformation: [{ board: '', qualification: '' }],
    subjectsOffered: [{ level: '', subject: '', price: '' }],
    generalAvailability: [{ day: '', startTime: '', endTime: '' }],
    profilePicture: null,
    latitude: '',
    longitude: '',
  });

  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [error, setError] = useState({});
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingProfilePicture, setExistingProfilePicture] = useState(null);

  // Initialize map
  useEffect(() => {
    if (!map) {
      const mapInstance = L.map('map').setView([27.7172, 85.324], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(mapInstance);

      const initialMarker = L.marker([27.7172, 85.324]).addTo(mapInstance);
      setMap(mapInstance);
      setMarker(initialMarker);

      mapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        initialMarker.setLatLng([lat, lng]);
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        getLocationName(lat, lng);
      });
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []); // Empty dependency array as we only want to initialize once

  // Fetch teacher data if in edit mode
  useEffect(() => {
    if (isEditMode && teacherId) {
      fetchTeacherData();
    }
  }, [isEditMode, teacherId]);

  const fetchTeacherData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/teacher-form/${teacherId}`);
      const teacherData = response.data;

      setFormData({
        ...teacherData,
        profilePicture: null,
      });

      if (teacherData.profilePictureUrl) {
        setExistingProfilePicture(teacherData.profilePictureUrl);
        setProfilePicturePreview(teacherData.profilePictureUrl);
      }

      if (teacherData.latitude && teacherData.longitude && marker && map) {
        marker.setLatLng([teacherData.latitude, teacherData.longitude]);
        map.setView([teacherData.latitude, teacherData.longitude]);
        getLocationName(teacherData.latitude, teacherData.longitude);
      }
    } catch (error) {
      console.error('Error fetching teacher data:', error);
      setError({ fetch: 'Failed to fetch teacher data. Please try again.' });
    }
  };

  const getLocationName = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      setLocationName(response.data.display_name);
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validation rules
    if (!formData.fullname?.trim() || formData.fullname.length < 3) {
      newErrors.fullname = 'Full Name is required and must be at least 3 characters long.';
    }
    
    if (formData.degree?.length > 50) {
      newErrors.degree = 'Degree cannot exceed 50 characters.';
    }
    
    const phonePattern = /^[0-9]{10}$/;
    if (!formData.phoneNumber || !phonePattern.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number is required and must be 10 digits.';
    }
    
    if (!formData.aboutMe?.trim() || formData.aboutMe.length < 10) {
      newErrors.aboutMe = 'About Me is required and must be at least 10 characters long.';
    }

    // Validate arrays have at least one valid entry
    if (!formData.educationInformation?.some(edu => edu.board.trim() && edu.qualification.trim())) {
      newErrors.educationInformation = 'At least one complete education entry is required.';
    }

    if (!formData.subjectsOffered?.some(subject => 
      subject.level.trim() && subject.subject.trim() && subject.price.trim()
    )) {
      newErrors.subjectsOffered = 'At least one complete subject entry is required.';
    }

    if (!formData.generalAvailability?.some(availability => 
      availability.day.trim() && availability.startTime && availability.endTime
    )) {
      newErrors.generalAvailability = 'At least one complete availability entry is required.';
    }

    if (!isEditMode && !formData.profilePicture) {
      newErrors.profilePicture = 'Profile Picture is required.';
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Location is required. Please click on the map.';
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, name, value) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = { ...newArray[index], [name]: value };
      return { ...prev, [field]: newArray };
    });
  };

  const handleAddEntry = (field, defaultValue) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const handleRemoveEntry = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError((prev) => ({ ...prev, profilePicture: 'File size must be less than 5MB' }));
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setError((prev) => ({ ...prev, profilePicture: 'File must be an image (JPEG, PNG, or GIF)' }));
        return;
      }
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'profilePicture') {
        if (value) formDataToSubmit.append(key, value);
      } else if (['educationInformation', 'subjectsOffered', 'generalAvailability'].includes(key)) {
        formDataToSubmit.append(key, JSON.stringify(value));
      } else {
        formDataToSubmit.append(key, value);
      }
    });

    setLoading(true);
    try {
      const url = isEditMode 
        ? `http://localhost:5000/teacher-form/${teacherId}`
        : 'http://localhost:5000/teacher-form';
      
      const response = isEditMode
        ? await axios.put(url, formDataToSubmit)
        : await axios.post(url, formDataToSubmit);

      console.log('Form submitted successfully:', response.data);
      // Add success notification or redirect logic here
    } catch (error) {
      console.error('Error submitting form:', error);
      setError({ submit: 'Failed to submit the form. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-5 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Teacher Details' : 'Add Teacher Details'}</h1>
      
      {error.fetch && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error.fetch}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <section className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="fullname">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              className="w-full border rounded p-2"
              required
            />
            {error.fullname && (
              <p className="mt-1 text-sm text-red-600">{error.fullname}</p>
            )}
          </div>

          {/* Add other basic fields similarly */}
        </section>

        {/* Education Information */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Education Information</h2>
          {formData.educationInformation.map((edu, index) => (
            <div key={index} className="border rounded p-4 mb-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1" htmlFor={`board_${index}`}>
                    Board <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`board_${index}`}
                    value={edu.board}
                    onChange={(e) => handleArrayChange(index, 'educationInformation', 'board', e.target.value)}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1" htmlFor={`qualification_${index}`}>
                    Qualification <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`qualification_${index}`}
                    value={edu.qualification}
                    onChange={(e) => handleArrayChange(index, 'educationInformation', 'qualification', e.target.value)}
                    className="w-full border rounded p-2"
                    required
                  />
                </div>
              </div>
              {formData.educationInformation.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEntry('educationInformation', index)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  Remove Education
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddEntry('educationInformation', { board: '', qualification: '' })}
            className="text-blue-500 hover:text-blue-700"
          >
            Add Education
          </button>
          {error.educationInformation && (
            <p className="mt-1 text-sm text-red-600">{error.educationInformation}</p>
          )}
        </section>

        {/* Map Section */}
        <section>
          <h2 className="text-lg font-semibold mb-2">Location</h2>
          <div id="map" className="h-64 rounded mb-2" />
          {locationName && (
            <p className="text-sm text-gray-600">Selected location: {locationName}</p>
          )}
          {error.location && (
            <p className="mt-1 text-sm text-red-600">{error.location}</p>
          )}
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded font-bold text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Submitting...' : isEditMode ? 'Update Details' : 'Submit Details'}
        </button>
      </form>
    </div>
  );
};

export default TeacherUpdateForm;