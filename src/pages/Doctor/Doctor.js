import React from 'react';
import '../HomePage/HomePage.css'; // Importing CSS file
import './Doctor.css'
import DoctorNavbar from './components/DoctorNavbar';
import Appointment from './components/Appointment';



function Patient() {  
  return (
    
    <div className="home-page-container">
      <Appointment />
    </div>
  );
}

export default Patient;
