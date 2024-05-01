import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth, db } from '../../../services/firebase-config';
import { collection, query, where, getDocs, doc, addDoc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthValue } from '../../../../context/AuthContext';

const ListPatient = ({ onPersonClick }) => {
    const { currentUser } = useAuthValue();
    const [userData, setUserData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRef = doc(db, 'doctor', currentUser.uid);
                const userDoc = await getDoc(userRef);
                const data = userDoc.data();
                console.log('userDoc:', data);
                
                setUserData(data);
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchData();
    }, [currentUser]);

    return (
        <div className='doctor'>
        <div className="containerd">
            <div className="appointment-list">
                <h2>List Patient</h2>
                <div className='list-patient'>
                {userData && userData.history ? (
                        userData.history.map((his, index) => (
                            <ul key={index} onClick={() => onPersonClick(his)}>
                                <div className="list-item">
                                    <p className="patient-name">{his.patientName}</p>
                                    <p className="patient-mail">{his.patientMail}</p>
                                </div>
                            </ul>
                        ))
                    ) : (
                        <ul>No patient found</ul>
                    )}
                </div>
            </div>
        </div>
      </div>
    )

}

export default ListPatient;