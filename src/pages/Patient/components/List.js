import { useState, useEffect } from 'react';
import { db } from '../../services/firebase-config';
import { collection, query, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { useAuthValue } from '../../../context/AuthContext';

const AppointmentB = () => {
    const { currentUser } = useAuthValue();
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
          try {
            if (currentUser) {
              const userDocRef = doc(db, 'users', currentUser.uid);
              const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                  const userData = doc.data();
                  if (userData.appointments) {
                    setAppointments(userData.appointments);
                    console.log('Appointments:', userData.appointments);
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
      

    const deleteDoctorAppointments = async (appointment, patientId) => {
        try {
            const doctorRef = doc(db, 'doctor', appointment.doctorId);
            const doctorDoc = await getDoc(doctorRef);
            const doctorAppointments = doctorDoc.data().appointments || [];
            const updatedAppointments = doctorAppointments.filter(appt => 
                appt.date !== appointment.date || 
                appt.time !== appointment.time || 
                appt.patientId !== patientId
            );

            await updateDoc(doctorRef, { appointments: updatedAppointments });
            console.log('Doctor appointments deleted successfully!');
        } catch (error) {
            console.error('Error deleting doctor appointments:', error);
        }
    };

    const deleteAppointment = async (appointment) => {
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userRef);
            const userAppointments = userDoc.data().appointments || [];
            const updatedAppointments = userAppointments.filter(appt => 
                appt.date !== appointment.date || 
                appt.time !== appointment.time || 
                appt.doctorName !== appointment.doctorName
            );

            await updateDoc(userRef, { appointments: updatedAppointments });
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

    return (
        <div className='list'>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.length > 0 ? (
                        appointments.map((appointment, index) => (
                            <tr key={index}>
                                <td>{appointment.date}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.reason}</td>
                                <td className='status' style={{ color: getStatusColor(appointment.status) }}>{appointment.status}</td>
                                <td>
                                    <button 
                                        onClick={() => {
                                            deleteAppointment(appointment);
                                            deleteDoctorAppointments(appointment, currentUser.uid);
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
    );
};

export default AppointmentB;
