import React, { useState, useEffect, useRef } from 'react';

const SearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    level: '',
    subject: '',
    minPrice: '',
    maxPrice: '',
    latitude: '27.7172',
    longitude: '85.324',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [locationName, setLocationName] = useState('');
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'minPrice' || name === 'maxPrice' ? value.replace(/[^0-9.]/g, '') : value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true); // Set loading to true

    const validationError = validateFormData(formData);
    if (validationError) {
      setErrorMessage(validationError);
      setLoading(false); // Set loading to false
      return;
    }

    try {
      await onSearch(formData);
    } catch (error) {
      setErrorMessage(`Search failed: ${error.message}`);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const validateFormData = ({ level, subject, minPrice, maxPrice, latitude, longitude }) => {
    if (!level && !subject && !minPrice && !maxPrice) {
      return 'Please fill at least one field to search (class level or subject).';
    }
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      return 'Min Price cannot be greater than Max Price.';
    }
    if (!latitude || !longitude) {
      return 'Student location is required.';
    }
    return null;
  };

  const handleReset = () => {
    setFormData({
      level: '',
      subject: '',
      minPrice: '',
      maxPrice: '',
      latitude: '27.7172',
      longitude: '85.324',
    });
    setLocationName('');
    setErrorMessage('');
    if (marker) {
      marker.setLatLng([27.7172, 85.324]);
    }
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://unpkg.com/leaflet/dist/leaflet.js`;
    script.onload = () => setMapLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      const map = L.map(mapRef.current).setView([27.7172, 85.324], 13);
      L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        maxZoom: 19,
      }).addTo(map);

      const initialMarker = L.marker([27.7172, 85.324]).addTo(map);
      setMarker(initialMarker);

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        handleMarkerMove(initialMarker, lat, lng);
      });

      return () => {
        map.off();
        map.remove();
      };
    }
  }, [mapLoaded]);

  const handleMarkerMove = (marker, lat, lng) => {
    marker.setLatLng([lat, lng]);
    setFormData(prev => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
    setLocationName(`Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}`);
  };

  return (
    <div className="w-[60rem] ml-32">
      <form onSubmit={handleSearch} className="space-y-6">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
            <input
              type="text"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="mt-1 block w-full h-12 rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="  Class Level"
            />
          </div>



          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="mt-1 block w-full h-12 rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="  Subject Name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price</label>
            <input
              type="text"
              id="minPrice"
              name="minPrice"
              value={formData.minPrice}
              onChange={handleInputChange}
              className="mt-1 block w-full h-12 rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="  Minimum Price"
            />
          </div>

          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price</label>
            <input
              type="text"
              id="maxPrice"
              name="maxPrice"
              value={formData.maxPrice}
              onChange={handleInputChange}
              className="mt-1 block w-full h-12 rounded-md border-2 border-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              placeholder="  Maximum Price"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <div ref={mapRef} style={{ height: '350px', width: '100%' }} className="mt-1 rounded-md overflow-hidden border border-gray-300 shadow-sm"></div>
          <p className="mt-1 text-sm text-gray-500">{locationName}</p>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className={`px-4 py-2 ${loading ? 'bg-blue-300' : 'bg-blue-500'} text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
