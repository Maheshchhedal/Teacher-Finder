// CTA.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import homeImage from './homeImage.jpg';

const CTA = () => {
  const navigate = useNavigate();

  const handleSearchClick = (event) => {
    event.preventDefault();
    console.log('Navigating to Teacher Search Page...');
    navigate('/teacher-search');
  };

  return (
    <section className="h-screen w-full">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left - Text Section */}
        <div className="flex flex-col justify-center items-start w-full md:w-1/2 px-6 md:px-20 bg-gradient-to-r from-blue-100 to-white">
          <h1 className="text-4xl md:text-6xl font-extrabold text-blue-600 mb-4 leading-tight mt-8">
            Nepal's Best <br /> Private Tutors
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-4 md:mb-6 leading-relaxed">
            Welcome to <span className="text-blue-500 font-bold">Teacher Finder</span>, 
            a platform dedicated to connecting students with top-tier tutors who meet their 
            unique educational needs.
          </p>
          
          <button 
            type="button"
            onClick={handleSearchClick}
            className="text-lg px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg 
                       hover:bg-blue-600 transition-all duration-300">
            Find a Teacher Near You
          </button>
        </div>

        {/* Right - Image Section */}
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <img
            src={homeImage}
            alt="Home"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default CTA;
