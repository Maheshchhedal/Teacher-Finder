import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import './../../assets/css/home.css';
import Footer from './Footer';
import Nav from './../utils/Nav';
import CTA from './CTA';
import Loader from '../utils/Loader';


function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

  return (
    <>
      {!isLoaded && <Loader />}
      <Nav />
      <CTA />
      <Routes> {/* Define routes directly here */}
      </Routes>
      <Footer />
    </>
  );
}

export default Home;
