import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from '../../../services/firebase-config';
import { collection, query, where, getDocs, doc, addDoc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthValue } from '../../../../context/AuthContext';
import DoctorNavbar from '../DoctorNavbar';
import  ListPatient from './ListPatient.js';
import PatientDetail from './PatientDetail.js';

function MyPatient() {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [userData, setUserData] = useState('')



  const handlePersonClick = (patient) => {
    setSelectedPatient(patient);

};


return (
    <div>
    <div className="home-page-container">
        <DoctorNavbar />
      </div>
        <div className='doctor'>

            <div className='containerd'>
                <div className="flex-container">
                    <div className="left-column">
                        <ListPatient onPersonClick={handlePersonClick} />
                    </div>
                    <div className="right-column">
                        {setSelectedPatient && <PatientDetail patient={selectedPatient} />}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )

};

export default MyPatient;