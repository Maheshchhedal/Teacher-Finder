import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Nav() {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
    setShowSignUpModal(false);
    setShowLoginModal(false);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-500 to-blue-600 fixed w-full top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4">
          <Link className="text-white text-2xl font-bold" to="/">Home Tuition</Link>

          {/* Mobile menu toggle button */}
          <button
            className="block lg:hidden text-white focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {/* Mobile menu icon */}
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          

          {/* Desktop menu */}
          <div className={`hidden lg:flex lg:items-center lg:space-x-6 ${isMobileMenuOpen ? 'block' : 'hidden'}`} id="navbarColor01">
          <li className="nav-item list-none"> {/* Added list-none to remove default list style */}
  <button
    className="text-white hover:underline focus:outline-none"
    onClick={() => navigateTo('/teacher-search')}
  >
    Find Teacher
  </button>
</li>


            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
              onClick={() => setShowSignUpModal(true)}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="flex flex-col lg:hidden bg-white text-gray-800 py-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mb-2"
              onClick={() => {
                setShowLoginModal(true);
                setIsMobileMenuOpen(false); // Close menu after opening modal
              }}
            >
              Login
            </button>
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
              onClick={() => {
                setShowSignUpModal(true);
                setIsMobileMenuOpen(false); // Close menu after opening modal
              }}
            >
              Sign Up
            </button>
          </div>
        )}
      </nav>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <Modal title="Role" onClose={() => setShowSignUpModal(false)}>
          <div className="flex justify-center mt-4">
            <ModalButton label="Student" onClick={() => navigateTo('/signup/student')} />
            <ModalButton label="Teacher" onClick={() => navigateTo('/signup/teacher')} />
          </div>
        </Modal>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <Modal title="Role" onClose={() => setShowLoginModal(false)}>
          <div className="flex justify-center mt-4">
            <ModalButton label="Student" onClick={() => navigateTo('/login/student')} />
            <ModalButton label="Teacher" onClick={() => navigateTo('/login/teacher')} />
          </div>
        </Modal>
      )}
    </>
  );
}

const Modal = ({ title, onClose, children }) => (
  <div className="modal fixed z-10 inset-0 overflow-y-auto" role="dialog" aria-hidden="true">
    <div className="modal-dialog mx-auto mt-32 max-w-md" role="document">
      <div className="modal-content bg-gray-500 rounded-lg shadow-lg"> {/* Updated color here */}
        <div className="modal-header flex justify-between items-center border-b border-gray-200 px-4 py-2">
          <h5 className="text-xl font-semibold text-white">{title}</h5> {/* Change text color to white for contrast */}
          <button className="text-gray-300 hover:text-blue-300" onClick={onClose} aria-label="Close">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="modal-body px-4 py-6">{children}</div>
      </div>
    </div>
  </div>
);

const ModalButton = ({ label, onClick }) => (
  <button
    className="bg-gray-200 text-gray-800 px-4 py-2 rounded mx-3 hover:bg-blue-500 transition hover:text-white"
    onClick={onClick}
  >
    {label}
  </button>
);

export default Nav;
