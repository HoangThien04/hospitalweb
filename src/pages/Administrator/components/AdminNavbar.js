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

    const handleDeviceManagement = () => {
        history.push("/managedevice"); // Navigate to the Manage Device page
    };
    const handleDoctorManagement = () => {
        history.push("/managedoctors"); // Navigate to the Manage Doctor page
    };
    const handleMedicineManagement = () => {
        history.push("/managemedicine"); // Navigate to the Manage Medicine page
    };
    const handleSignOut = () => {
        signOut(auth); // Sign out the user
        history.push("/"); // Navigate to the home page
    };


    return (
        <div className='header'>
            <div className="container">
                <nav>
                    
                    <div className="menu-icon">
                        <h2 className="logo" >HCMUT</h2>
                        <div className='menu-icon-control'>
                            <p onClick={handleDoctorManagement}>Doctor Management</p>
                            <p onClick={handleDeviceManagement}>Device Management</p>
                            <p onClick={handleMedicineManagement}>Medicine Management</p>
                        </div>
                        <div className='user'>
                            <img className='user-icon' src={user} alt="user" />
                                <div className='dropdown'>
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
