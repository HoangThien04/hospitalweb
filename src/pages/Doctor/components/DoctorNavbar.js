import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {signOut} from 'firebase/auth';
import { useAuthValue } from '../../../context/AuthContext';
import user from '../../images/user.png';
import { auth } from '../../services/firebase-config';


const PatientNavbar = () => {
    const { currentUser } = useAuthValue(); // Get the current user
    const history = useHistory(); // Access history object

    const handleAppointment = () => {
        history.push("/dappointment"); // Navigate to the appointment page
    };

    const handelProfile = () => {
        history.push("/doctorProfile"); // Navigate to the profile page
    };

    const handleSignOut = () => {
        signOut(auth); // Sign out the user
        history.push("/"); // Navigate to the home page
    };

    const handelUdateMedicine = () => {
        history.push("/updatemedicine"); // Navigate to the update medicine page
    };

    const handelUpdatePatient = () => {
        history.push("/updatepatient"); // Navigate to the update patient page
    };

    const handelMyPatient = () => {
        history.push("/mypatient"); // Navigate to the my patient page
    };

    return (
        <div className='header'>
            <div className="container">
                <nav>
                    
                    <div className="menu-icon">
                        <h2 className="logo" >HCMUT</h2>
                        <div className='menu-icon-control'>
                            <p  onClick={handelMyPatient}>MyPatient</p>
                            <p  onClick={handelUdateMedicine}>UpdateMedicine</p>
                            <p  onClick={handelUpdatePatient}>UpdatePatient</p>
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
