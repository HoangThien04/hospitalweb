import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import {signOut} from 'firebase/auth';
import { useAuthValue } from '../../../context/AuthContext';
import user from '../../images/user.png';
import { auth } from '../../services/firebase-config';

const PatientNavbar = () => {
    const { currentUser } = useAuthValue(); // Get the current user
    const history = useHistory(); // Access history object
    const location = history.location.pathname; // Get the current location

    const isPatient = location === "/patient"; // Check if the user is on the patient page

    const handleSigin = () => {
        history.push("/signin"); // Navigate to the signin page
    };

    const handleSignUp = () => {
        history.push("/signup"); // Navigate to the registration page
    };

    const handleScrollToSection = (sectionId) => {
        const section = document.getElementsByClassName(sectionId)[0]; // Get the section by class name
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth' // Scroll smoothly to the section
            });
        }
    };

    const handleAppointment = () => {
        history.push("/pappointment"); // Navigate to the appointment page
    };

    const handelProfile = () => {
        history.push("/patientProfile"); // Navigate to the profile page
    };

    const handleSignOut = () => {
        signOut(auth); // Sign out the user
        history.push("/"); // Navigate to the home page
    };

    const handelPatient = () => {
        history.push("/patient"); // Navigate to the patient page
    };

    return (
        <div className='header'>
            <div className="container">
                <nav>
                    
                    <div className="menu-icon">
                        <h2 className="logo" onClick={() => handleScrollToSection("home")}>HCMUT</h2>
                        <div className='menu-icon-control'>
                            <p  onClick={isPatient ? () => handleScrollToSection("home") : handelPatient }>Home</p>
                            <p  onClick={isPatient ? () => handleScrollToSection("services") : handelPatient}>Services</p>
                            <p  onClick={isPatient ? () => handleScrollToSection("about") : handelPatient}>About</p>
                            <p  onClick={isPatient ? () => handleScrollToSection("doctors") : handelPatient}>Doctors</p>
                            <p onClick={handleAppointment}>Appointment</p>
                        </div>
                        <div className='user'>
                            <img className='user-icon' src={user} alt="user" />
                                <div className='dropdown'>
                                    <p onClick={handelProfile}>Profile</p>
                                    <p onClick={handleSignOut}>Sign Out</p>
                                </div>
                            
                        </div>
                        
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default PatientNavbar;
