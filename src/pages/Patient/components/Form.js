import { useEffect, useState } from 'react';
import { db } from '../../services/firebase-config';
import { getDoc, updateDoc, doc } from "firebase/firestore"; // Import các biến và hàm từ Firebase Firestore
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthValue } from '../../../context/AuthContext';
import cancel from '../../images/cancel.jpg'; 




const AppointmentA = () => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const { currentUser } = useAuthValue();
    const [reason, setReason] = useState('');

    

    const isValid = (e, u, date, time) => {
        if (e == null) {
            console.log('Appointment this time is not valid');
            return false;
        }
        
        // Check if there are existing appointments that match the provided date and time
        const conflictingAppointment = u.appointments.find(appointment => appointment.date === date && appointment.time === time);
        
        if (!conflictingAppointment) {
            console.log('Appointment is valid');
            return true;
        }
    
        // If there is a conflicting appointment, it's invalid
        console.log('Appointment is not valid');
        return false;
    };

    const bookAppointment = async (e) => {
        e.preventDefault();
        console.log('currentUser: ',currentUser);
        try {
            // Lấy tài liệu người dùng từ Firestore
            const userRef = doc(db, 'users', currentUser.uid);
            console.log('userRef: ',userRef);
            const userDoc = await getDoc(userRef);
            console.log('userDoc: ',userDoc);
            const userData = userDoc.data(); // Dữ liệu hiện tại của người dùng

            console.log('userData: ',userData);

            const qDoctor = query(collection(db, 'doctor'));
            const doctorsQuerySnapshot = await getDocs(qDoctor);
            const doctorsFilter = doctorsQuerySnapshot.docs.filter(doc => doc.data().appointments.date !== date && doc.data().appointments.time !== time);
            
            let minAppointmentsDoctor;
            console.log('Doctors: ', doctorsFilter);

            // Loop through doctors to find the one with the fewest appointments
            doctorsFilter.forEach(doc => {
                const doctorData = doc.data();
                if (!minAppointmentsDoctor || doctorData.appointments.length < minAppointmentsDoctor.appointments.length) {
                    minAppointmentsDoctor = {
                        ...doctorData
                    };
                }
            });

            console.log('Min appointments doctor: ', minAppointmentsDoctor);

            if (isValid(minAppointmentsDoctor, userData, date, time)) {
                const newAppointment = {
                    patientName: userData.username,
                    date: date,
                    time: time,
                    reason: reason, // Make sure 'reason' is not undefined
                    status: 'pending',
                    patientId: currentUser.uid
                };
                minAppointmentsDoctor.appointments.push(newAppointment);
                
                const docRef = doc(db, 'doctor', minAppointmentsDoctor.uid);
                console.log('docRef: ', docRef);
                await updateDoc(docRef, minAppointmentsDoctor);
            } else {
                console.log('Appointment is not valid');
                return;
            }

            

            

            // Cập nhật hoặc thêm các trường mới vào tài liệu người dùng
            const updatedUserData = {
                ...userData,
                appointments: [
                    ...userData.appointments,
                ]
            };
            
            
                // Nếu mảng cuộc hẹn không rỗng, thêm cuộc hẹn mới vào cuối mảng
                updatedUserData.appointments.push({
                    date: date,
                    time: time,
                    reason: reason, // Make sure 'reason' is not undefined
                    status: 'pending',
                    doctorId: minAppointmentsDoctor.uid
                });
            

            // Cập nhật tài liệu người dùng với dữ liệu mới
            await updateDoc(userRef, updatedUserData);

            console.log('Appointment updated successfully!');
        } catch (error) {
            console.error('Error updating appointment: ', error);
        }
    };

    const openForm = () => {
        document.querySelector('.form-wrapper').style.display = 'block';
    };

    const closeForm = () => {
        document.querySelector('.form-wrapper').style.display = 'none';
    };

    return (
        <div className='form'>
            <button className='new-appointment' onClick={openForm}>+ New Appointment</button>
            <div className='form-wrapper'>
                
                <form className='form-appointment' onSubmit={bookAppointment}>
                    <img src={cancel} alt='cancel' className='cancel' onClick={closeForm}/>
                    <h2>Book an Appointment</h2>
                    <input
                        type='date'
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <input
                        type='time'
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                    <input 
                        type='text'
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder='Reason for appointment'
                        required
                    />
                    <button type='submit'>Book</button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentA;
