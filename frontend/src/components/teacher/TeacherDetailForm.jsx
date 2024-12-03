import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TeacherDetailForm = () => {
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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [marker, setMarker] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://unpkg.com/leaflet/dist/leaflet.js`;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      const map = L.map('map').setView([27.7172, 85.324], 13);
      L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        maxZoom: 19,
      }).addTo(map);

      const initialMarker = L.marker([27.7172, 85.324]).addTo(map);
      setMarker(initialMarker);

      map.on('click', function (e) {
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
  }, [mapLoaded]);

  const getLocationName = async (lat, lng) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      setLocationName(response.data.display_name);
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname || formData.fullname.length < 3) {
      newErrors.fullname = 'Full Name is required and must be at least 3 characters long.';
    }
    if (formData.degree.length > 50) {
      newErrors.degree = 'Degree cannot exceed 50 characters.';
    }
    const phonePattern = /^[0-9]{10}$/;
    if (!formData.phoneNumber || !phonePattern.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone Number is required and must be 10 digits.';
    }
    if (!formData.aboutMe || formData.aboutMe.length < 10) {
      newErrors.aboutMe = 'About Me is required and must be at least 10 characters long.';
    }
    if (formData.educationInformation.every(edu => !edu.board && !edu.qualification)) {
      newErrors.educationInformation = 'At least one education entry is required.';
    }
    if (formData.subjectsOffered.every(subject => !subject.level && !subject.subject && !subject.price)) {
      newErrors.subjectsOffered = 'At least one subject entry is required.';
    }
    if (formData.generalAvailability.every(availability => !availability.day && !availability.startTime && !availability.endTime)) {
      newErrors.generalAvailability = 'At least one availability entry is required.';
    }
    if (!formData.profilePicture) {
      newErrors.profilePicture = 'Profile Picture is required.';
    }
    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Location is required.';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const newEducationInformation = [...formData.educationInformation];
    newEducationInformation[index][name] = value;
    setFormData((prev) => ({ ...prev, educationInformation: newEducationInformation }));
  };

  const addEducationEntry = () => {
    setFormData((prev) => ({
      ...prev,
      educationInformation: [...prev.educationInformation, { board: '', qualification: '' }],
    }));
  };

  const removeEducationEntry = (index) => {
    const newEducationInformation = formData.educationInformation.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, educationInformation: newEducationInformation }));
  };

  const handleSubjectChange = (index, e) => {
    const { name, value } = e.target;
    const newSubjectsOffered = [...formData.subjectsOffered];
    newSubjectsOffered[index][name] = value;
    setFormData((prev) => ({ ...prev, subjectsOffered: newSubjectsOffered }));
  };

  const addSubjectEntry = () => {
    setFormData((prev) => ({
      ...prev,
      subjectsOffered: [...prev.subjectsOffered, { level: '', subject: '', price: '' }],
    }));
  };

  const removeSubjectEntry = (index) => {
    const newSubjectsOffered = formData.subjectsOffered.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, subjectsOffered: newSubjectsOffered }));
  };

  const handleAvailabilityChange = (index, e) => {
    const { name, value } = e.target;
    const newGeneralAvailability = [...formData.generalAvailability];
    newGeneralAvailability[index][name] = value;
    setFormData((prev) => ({ ...prev, generalAvailability: newGeneralAvailability }));
  };

  const addAvailabilityEntry = () => {
    setFormData((prev) => ({
      ...prev,
      generalAvailability: [...prev.generalAvailability, { day: '', startTime: '', endTime: '' }],
    }));
  };

  const removeAvailabilityEntry = (index) => {
    const newGeneralAvailability = formData.generalAvailability.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, generalAvailability: newGeneralAvailability }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePicture: file }));
    setProfilePicturePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('fullname', formData.fullname);
    formDataToSubmit.append('degree', formData.degree);
    formDataToSubmit.append('phoneNumber', formData.phoneNumber);
    formDataToSubmit.append('aboutMe', formData.aboutMe);
    formDataToSubmit.append('educationInformation', JSON.stringify(formData.educationInformation));
    formDataToSubmit.append('subjectsOffered', JSON.stringify(formData.subjectsOffered));
    formDataToSubmit.append('generalAvailability', JSON.stringify(formData.generalAvailability));
    formDataToSubmit.append('latitude', formData.latitude.toString());
    formDataToSubmit.append('longitude', formData.longitude.toString());
    if (formData.profilePicture instanceof File) {
      formDataToSubmit.append('profilePicture', formData.profilePicture);
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/teacher-form/create', formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Success:', response.data);
      window.alert('Teacher profile created successfully!');
      setError({});
      setFormData({
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
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      setError({ submit: 'Failed to create teacher profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6">Teacher Detail Form</h2>

      {error.submit && <p className="text-red-600 mb-4">{error.submit}</p>}

      <div className="mb-4">
        <label className="block text-gray-700">Full Name:</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleInputChange}
          className={`border p-2 w-full ${error.fullname ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error.fullname && <p className="text-red-600">{error.fullname}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Degree:</label>
        <input
          type="text"
          name="degree"
          value={formData.degree}
          onChange={handleInputChange}
          className={`border p-2 w-full ${error.degree ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error.degree && <p className="text-red-600">{error.degree}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className={`border p-2 w-full ${error.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error.phoneNumber && <p className="text-red-600">{error.phoneNumber}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">About Me:</label>
        <textarea
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleInputChange}
          className={`border p-2 w-full ${error.aboutMe ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error.aboutMe && <p className="text-red-600">{error.aboutMe}</p>}
      </div>

      <h3 className="text-lg font-bold mb-2">Education Information</h3>
      {formData.educationInformation.map((edu, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          <div className="flex">
            <input
              type="text"
              name="board"
              placeholder="Board"
              value={edu.board}
              onChange={(e) => handleEducationChange(index, e)}
              className="border p-2 w-full mr-2"
            />
            <input
              type="text"
              name="qualification"
              placeholder="Qualification"
              value={edu.qualification}
              onChange={(e) => handleEducationChange(index, e)}
              className="border p-2 w-full"
            />
          </div>
          <button type="button" onClick={() => removeEducationEntry(index)} className="text-red-500 mt-2">Remove</button>
        </div>
      ))}
      <button type="button" onClick={addEducationEntry} className="bg-blue-500 text-white px-4 py-2 rounded">Add Education</button>

      <h3 className="text-lg font-bold mb-2">Subjects Offered</h3>
      {formData.subjectsOffered.map((subject, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          <div className="flex">
            <input
              type="text"
              name="level"
              placeholder="Level"
              value={subject.level}
              onChange={(e) => handleSubjectChange(index, e)}
              className="border p-2 w-full mr-2"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={subject.subject}
              onChange={(e) => handleSubjectChange(index, e)}
              className="border p-2 w-full mr-2"
            />
            <input
              type="text"
              name="price"
              placeholder="Price"
              value={subject.price}
              onChange={(e) => handleSubjectChange(index, e)}
              className="border p-2 w-full"
            />
          </div>
          <button type="button" onClick={() => removeSubjectEntry(index)} className="text-red-500 mt-2">Remove</button>
        </div>
      ))}
      <button type="button" onClick={addSubjectEntry} className="bg-blue-500 text-white px-4 py-2 rounded">Add Subject</button>

      <h3 className="text-lg font-bold mb-2">General Availability</h3>
      {formData.generalAvailability.map((availability, index) => (
        <div key={index} className="mb-4 border p-4 rounded">
          <div className="flex">
            <input
              type="text"
              name="day"
              placeholder="Day"
              value={availability.day}
              onChange={(e) => handleAvailabilityChange(index, e)}
              className="border p-2 w-full mr-2"
            />
            <input
              type="time"
              name="startTime"
              value={availability.startTime}
              onChange={(e) => handleAvailabilityChange(index, e)}
              className="border p-2 w-full mr-2"
            />
            <input
              type="time"
              name="endTime"
              value={availability.endTime}
              onChange={(e) => handleAvailabilityChange(index, e)}
              className="border p-2 w-full"
            />
          </div>
          <button type="button" onClick={() => removeAvailabilityEntry(index)} className="text-red-500 mt-2">Remove</button>
        </div>
      ))}
      <button type="button" onClick={addAvailabilityEntry} className="bg-blue-500 text-white px-4 py-2 rounded">Add Availability</button>

      {/* Profile Picture */}
      <div className="mb-4">
        <label className="block text-gray-700">Profile Picture</label>
        <input
          type="file"
          // accept="image/*"
          onChange={handleProfilePictureChange}
          className={`border rounded p-2 w-full ${error.profilePicture ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error.profilePicture && <p className="text-red-500">{error.profilePicture}</p>}
        {profilePicturePreview && (
          <img src={profilePicturePreview} alt="Profile Preview" className="mt-2 w-32 h-32 object-cover rounded" />
        )}
      </div>

       {/* Location Map */}
       <div className="mb-4">
        <label className="block text-gray-700">Location</label>
        <div id="map" style={{ height: '300px' }} className="mb-2"></div>
        <p>Latitude: {formData.latitude}</p>
        <p>Longitude: {formData.longitude}</p>
        {locationName && <p className="text-gray-600">Selected Location: {locationName}</p>}
        {error.location && <p className="text-red-500">{error.location}</p>}
      </div>

      <button type="submit" className={`bg-blue-500 text-white px-4 py-2 rounded ${loading ? 'opacity-50' : ''}`} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default TeacherDetailForm;
