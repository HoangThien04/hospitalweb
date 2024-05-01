import React from 'react';
import '../HomePage/HomePage.css'; // Importing CSS file
import './Patient.css'
import Home from '../HomePage/components/Home'; // Importing component
import Doctors from '../HomePage/components/Doctors'; // Importing component
import About from '../HomePage/components/About'; // Importing component  
import Footer from '../HomePage/components/Footer'; // Importing component
import Services from '../HomePage/components/Services';
import PatientNavbar from './components/PatientNavbar';



function Patient() {  
  return (
    
    <div className="home-page-container">
      <PatientNavbar />
      <Home />
      <Services />
      <About />
      <Doctors />
      <Footer />
    </div>
  );
}

export default Patient;
