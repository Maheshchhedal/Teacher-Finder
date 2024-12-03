import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600">
      <section className="flex flex-col lg:flex-row justify-between items-center p-4 border-b border-gray-300">
        <div className="hidden lg:block">
          <span>Get connected with us on social networks:</span>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="text-blue-600 hover:text-blue-700"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="text-blue-400 hover:text-blue-500"><i className="fab fa-twitter"></i></a>
          <a href="#" className="text-pink-600 hover:text-pink-700"><i className="fab fa-instagram"></i></a>
          <a href="#" className="text-blue-800 hover:text-blue-900"><i className="fab fa-linkedin"></i></a>
          <a href="#" className="text-gray-800 hover:text-gray-900"><i className="fab fa-github"></i></a>
        </div>
      </section>

      <section className="container mx-auto py-8">
        <div className="flex flex-col lg:flex-row lg:space-x-12">
          <div className="mb-8 lg:w-1/4">
            <h6 className="text-lg font-bold mb-4">Home Tuition.</h6>
            <p>
            Home Tuition is an online platform designed to connect students with highly qualified 
            and experienced tutors who offer personalized one-on-one instruction across a wide range of subjects.
            </p>
          </div>

          <div className="mb-8 lg:w-1/4">
            <h6 className="text-lg font-bold mb-4">Services</h6>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Find Tutor</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Create Account</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">FAQs</a></li>
            </ul>
          </div>

          <div className="mb-8 lg:w-1/4">
            <h6 className="text-lg font-bold mb-4">Useful links</h6>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-gray-800">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Help</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="mb-8 lg:w-1/4">
            <h6 className="text-lg font-bold mb-4">Contact</h6>
            <ul className="space-y-2">
              <li><i className="fas fa-home mr-2"></i> abcd</li>
              <li><i className="fas fa-envelope mr-2"></i> hometuition@gmail.com</li>
              <li><i className="fas fa-phone mr-2"></i> 977 98xxxxxxxx</li>
              <li><i className="fas fa-print mr-2"></i> 977 97xxxxxxxx</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="bg-blue-500 text-white text-center py-4">
        © 2023 Copyright: <a href="#" className="font-bold text-white">Home Tuition</a>
      </div>
    </footer>
  );
}

export default Footer;
