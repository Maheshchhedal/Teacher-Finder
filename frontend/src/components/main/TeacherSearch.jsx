// TeacherSearch.js
import React from 'react';
import Nav from './../utils/Nav';
import CTA from './CTA';

const TeacherSearch = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <Nav />

      {/* Page Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-100">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Teacher Search Page</h1>
        <CTA />
      </div>
    </div>
  );
};

export default TeacherSearch;
