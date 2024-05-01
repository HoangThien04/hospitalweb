import React from 'react';
import { useAuthValue } from '../../../context/AuthContext';
import { useState, useEffect } from 'react';
import { collection, query, doc, getDoc, updateDoc, onSnapshot, getDocs } from "firebase/firestore";
import { db } from '../../services/firebase-config';
import cancel from '../../images/cancel.jpg'; 
import DoctorNavbar from './DoctorNavbar';


const Appointment = () => {
    const { currentUser } = useAuthValue(); // Get the current user
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [patientTaget, setPatientTaget] = useState({
        patientId: '',
        date: '',
        time: ''
    });


    
    useEffect(() => {
        const fetchAppointments = async () => {
          try {
            if (currentUser) {
              const doctorDocRef = doc(db, 'doctor', currentUser.uid);
              const unsubscribe = onSnapshot(doctorDocRef, (doc) => {
                if (doc.exists()) {
                  const doctorData = doc.data();
                  if (doctorData.appointments) {
                    setAppointments(doctorData.appointments);
                    console.log('Appointments:', doctorData.appointments);
                  } else {
                    // Xử lý trường hợp không có trường 'appointments'
                    console.log('Không có dữ liệu cuộc hẹn nào.');
                  }
                } else {
                  // Xử lý trường hợp tài liệu không tồn tại
                  console.log('Tài liệu người dùng không tồn tại.');
                }
                setLoading(false);
              });
              return () => unsubscribe();
            }
          } catch (error) {
            console.error('Lỗi khi tải danh sách cuộc hẹn:', error);
            setLoading(false);
          }
        };
      
        fetchAppointments();
      }, [currentUser]);
      

    const deleteUserAppointments = async (appointment, doctorId) => {
        try {
            const userRef = doc(db, 'users', appointment.patientId);
            const userDoc = await getDoc(userRef);
            const userAppointments = userDoc.data().appointments || [];
            const updatedAppointments = userAppointments.filter(appt => 
                appt.date !== appointment.date || 
                appt.time !== appointment.time || 
                appt.doctorId !== doctorId
            );

            await updateDoc(userRef, { appointments: updatedAppointments });
            console.log('user appointments deleted successfully!');
        } catch (error) {
            console.error('Error deleting user appointments:', error);
        }
    };

    const deleteAppointment = async (appointment) => {
        try {
            const doctorRef = doc(db, 'doctor', currentUser.uid);
            const doctorDoc = await getDoc(doctorRef);
            const doctorAppointments = doctorDoc.data().appointments || [];
            const updatedAppointments = doctorAppointments.filter(appt => 
                appt.date !== appointment.date || 
                appt.time !== appointment.time || 
                appt.doctorName !== appointment.doctorName
            );

            await updateDoc(doctorRef, { appointments: updatedAppointments });
            setAppointments(updatedAppointments); // Cập nhật danh sách cuộc hẹn cục bộ
            console.log('Appointment deleted successfully!');
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approve':
              return 'green';
            case 'pending':
              return 'orange';
            case 'reject':
              return 'red';
            default:
              return 'black'; // Màu mặc định nếu trạng thái không được nhận diện
          }
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    //
    const isValid = (u, date, time) => {
       
        
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

    const bookAppointment = async (e, date, time) => {
        e.preventDefault();
        console.log('date: ',date);
        console.log('time: ',time);
        console.log('patientTaget: ',patientTaget);
        console.log('currentUser: ',currentUser);
        try {
            // Lấy tài liệu người dùng từ Firestore
            const doctorRef = doc(db, 'doctor', currentUser.uid);
            console.log('doctorRef: ',doctorRef);
            const doctorDoc = await getDoc(doctorRef);
            console.log('doctorDoc: ',doctorDoc);
            const doctorData = doctorDoc.data(); // Dữ liệu hiện tại của người dùng

            console.log('doctorData: ',doctorData);
//
            const patientRef = doc(db, 'users', patientTaget.patientId);
            const patientDoc = await getDoc(patientRef);
            const patientData = patientDoc.data(); // Dữ liệu hiện tại của người dùng
            console.log('patientData: ',patientData);

            // Cập nhật hoặc thêm các trường mới vào tài liệu người dùng
            const updatedDoctorAppointments = appointments.map(appointment => {
                if (appointment.date === patientTaget.date && appointment.time === patientTaget.time) {
                    return {
                        ...appointment,
                        date: date,
                        time: time,
                        reason: 're-examination',
                    };
                }
                return appointment;
            });
            
            
            // Cập nhật tài liệu người dùng với dữ liệu mới
            await updateDoc(doctorRef, {appointments: updatedDoctorAppointments});

            if (isValid( patientData, date, time)) {
                const updatedPatientAppointments = patientData.appointments.map(appointment => {
                    if (appointment.date === patientTaget.date && appointment.time === patientTaget.time) {
                        return {
                            ...appointment,
                            date: date,
                            time: time,
                            reason: 're-examination',
                        };
                    }
                    console.log('appointment: ',appointment);
                    return appointment;
                });
                console.log('updatedPatientAppointments: ',updatedPatientAppointments);

                await updateDoc(patientRef, {appointments: updatedPatientAppointments});
            } else {
                console.log('Appointment is not valid');
                return;
            }

            

            

            
            setAppointments(updatedDoctorAppointments); // Cập nhật danh sách cuộc hẹn cục bộ

            console.log('Appointment updated successfully!');
        } catch (error) {
            console.error('Error updating appointment: ', error);
        }
    };

    const openForm = (e) => {
        setPatientTaget({patientId: e.patientId,
            date: e.date,
            time: e.time
        });
        document.querySelector('.form-wrapper').style.display = 'block';
    };

    const closeForm = () => {
        setPatientTaget({patientId: '',
        date: '',
        time: ''});
        document.querySelector('.form-wrapper').style.display = 'none';
    };
    //



    const setStatus = async (apt, status) => {
        console.log('currentUser: ',currentUser);
        console.log('status: ',status);
        console.log('apt: ',apt);
        try {
            // Lấy tài liệu người dùng từ Firestore
            const doctorRef = doc(db, 'doctor', currentUser.uid);
            console.log('doctorRef: ',doctorRef);
            const doctorDoc = await getDoc(doctorRef);
            console.log('doctorDoc: ',doctorDoc);
            const doctorData = doctorDoc.data(); // Dữ liệu hiện tại của người dùng

            console.log('doctorData: ',doctorData);
//
            const patientRef = doc(db, 'users', apt.patientId);
            const patientDoc = await getDoc(patientRef);
            const patientData = patientDoc.data(); // Dữ liệu hiện tại của người dùng
            console.log('patientData: ',patientData);

            const updatedPatientAppointments = patientData.appointments.map(appointment => {
                if (appointment.date === apt.date && appointment.time === apt.time) {
                    return {
                        ...appointment,
                        status: status
                    };
                }
                console.log('appointment: ',appointment);
                return appointment;
            });
            console.log('updatedPatientAppointments: ',updatedPatientAppointments);

            await updateDoc(patientRef, {appointments: updatedPatientAppointments});
           

            

            

            // Cập nhật hoặc thêm các trường mới vào tài liệu người dùng
            const updatedDoctorAppointments = appointments.map(appointment => {
                if (appointment.date === apt.date && appointment.time === apt.time) {
                    return {
                        ...appointment,
                        status: status
                    };
                }
                return appointment;
            });
            
            
            setAppointments(updatedDoctorAppointments); // Cập nhật danh sách cuộc hẹn cục bộ
            // Cập nhật tài liệu người dùng với dữ liệu mới
            await updateDoc(doctorRef, {appointments: updatedDoctorAppointments});
            console.log('Appointment updated successfully!');
        } catch (error) {
            console.error('Error updating appointment: ', error);
        }
    };



    return (
        
        <div className="appointment">
            <DoctorNavbar />
            <div className='form'>
            <div className='form-wrapper'>
                
            <form className='form-appointment' onSubmit={(e) => bookAppointment(e, date, time)}>
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
                <button type='submit'>Book</button>
            </form>

            </div>
        </div>

        <div className='list'>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Patient</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((appointment, index) => (
                            <tr key={index} >
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td className='patientName' onClick={() => openForm(appointment)}>{appointment.patientName}</td>
                                <td>{appointment.reason}</td>
                                <td className='status' >
                                    <select value={appointment.status} onChange={(e) => setStatus(appointment, e.target.value)} style={{ color: getStatusColor(appointment.status) }}>
                                        <option value="pending">pending</option>
                                        <option value="approve">approve</option>
                                        <option value="reject">reject</option>
                                    </select>
                                </td>

                                <td>
                                    <button 
                                        onClick={() => {
                                            deleteAppointment(appointment);
                                            deleteUserAppointments(appointment, currentUser.uid);
                                        }}
                                        disabled={appointment.status === 'approve'}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No appointments found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
            
        </div>
    );
};

export default Appointment;