import React from 'react';
import { useAuthValue } from '../../../context/AuthContext';
import PatientNavbar from './PatientNavbar';
import Form from './Form';
import List from './List';

const Appointment = () => {
    const { currentUser } = useAuthValue(); // Get the current user
    return (
        
        <div className="appointment">
            <PatientNavbar />
            <Form />
            <List />
            
        </div>
    );
};

export default Appointment;