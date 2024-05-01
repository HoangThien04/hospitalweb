// src/components/AppointmentForm.js
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase-config';
import { getDoc, updateDoc, doc } from "firebase/firestore"; // Import các biến và hàm từ Firebase Firestore
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthValue } from '../../../context/AuthContext';
import DoctorNavbar from './DoctorNavbar';

const isValid = (e, name, mail) => {
  if (e.history == null) {
      console.log('Patient is valid');
      return true;
  }
  
  // Check if there are existing appointments that match the provided date and time
  const conflictingPatient = e.history.find(his => his.patientName === name && his.patientMail === mail);
  
  if (!conflictingPatient) {
      console.log('Patient is valid');
      return true;
  }

  // If there is a conflicting patient, it's invalid
  console.log('Patient is not valid');
  return false;
};

const UpdatePatient = () => {
  const [patient, setPatient] = useState('');
  const [mail, setMail] = useState('');
  const [date, setDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [health, setHealth] = useState('');
  const [treatments, setTreatments] = useState('');
  const { currentUser } = useAuthValue();

    const resetForm = () => {
    setDate('');
    setDiagnosis('');
    setHealth('');
    setMail('');
    setPatient('');
    setTreatments('');
  };

  const updatePatient = async (e) => {
    e.preventDefault();
    console.log('currentUser: ',currentUser);
    try {
        // Lấy tài liệu người dùng từ Firestore
        //currentUser.uid
        const userRef = doc(db, 'doctor', currentUser.uid);
        console.log('userRef: ',userRef);
        const userDoc = await getDoc(userRef);
        console.log('userDoc: ',userDoc);
        const userData = userDoc.data(); // Dữ liệu hiện tại của người dùng

        console.log('userData: ',userData);

        try{
            const qPatient = query(collection(db, 'patient'), where('name', '==', patient), where('email', '==', mail));
            const patientsQuerySnapshot = await getDocs(qPatient);
            const patientsDoc = patientsQuerySnapshot.docs[0];
            const patientsData = patientsDoc.data();

            if (!patientsData.hasOwnProperty('history')) {
              // Nếu trường "appointments" chưa tồn tại, tạo một trường mới với mảng rỗng
              patientsData.history = [];
          }

            const updatedPatientData = {
              ...patientsData,
              history: [
                  ...patientsData.history,
              ]
           };
          
          
            // Nếu mảng cuộc hẹn không rỗng, thêm cuộc hẹn mới vào cuối mảng
            updatedPatientData.history.push({
                Day_start: date,
                DoctorName: userData.name,
                Diagnosis: diagnosis,
                Health_status: health,
                Treatments: treatments
            }); 
          
            await updateDoc(patientsDoc.ref, updatedPatientData);
            
            alert('Update successfull!');
            resetForm();
          }
        catch(error){
            console.error('Error getting patient: ', error);
        }

        if(isValid(userData, patient, mail)) {
          if (!userData.hasOwnProperty('history')) {
            // Nếu trường "history" chưa tồn tại, tạo một trường mới với mảng rỗng
            userData.history = [];
          }

          const updatedUserData = {
            ...userData,
            history: [
                ...userData.history,
            ]
          };

          updatedUserData.history.push({
            patientName: patient,
            patientMail: mail
          });

          await updateDoc(userRef, updatedUserData);
          console.log('update successfull!')
          console.log('Updated Patient successfully!');
        }
    } catch (error) {
        console.error('Error Updated Patient: ', error);
    }
};




  return (
    <div>
      <DoctorNavbar />

      <div className='doctor'>

        
        <div className="containerd">
          <div className="appointment-form">
            <h2>Update Patient</h2>
                <form id="update-patient" onSubmit={updatePatient}>
              

                  <div className='appoi-form'>
                    <div  className='form'>
                      <strong>
                      <p className='uppatient-name1'>
                          <label htmlFor="patient-time" >Patient: </label>
                      </p>
                      <p  className='patient-mail1'>
                      <label htmlFor="patient-mail"  >Patient's Mail: </label>
                      </p>
                      <p className='start-day1'>
                          <label htmlFor='start-day'>Start day: </label>
                      </p>
                      <p className='diagnosis1'>
                          <label htmlFor='diagnosis'>Diagnosis: </label>
                      </p>
                      <p className='health1'>
                          <label htmlFor='health'>Health status: </label>
                      </p>
                      <p className='treatments1'>
                          <label htmlFor='treatments'>Treatments: </label>
                      </p>
                      </strong>
                    </div>

                    <div className='form-ingr'>
                      <p>
                        <input
                          type='text'
                          className="uppatient-name" name='patient-name'
                          value={patient}
                          onChange={(e) => setPatient(e.target.value)}
                          required
                        />
                      </p>
                      <p>
                        <input
                            type="text"
                            className="patient-mail" name="patient-mail"
                            value={mail}
                            onChange={(e) => setMail(e.target.value)}
                            required
                        />
                      </p>
                      <p>
                        <input
                          type='date'
                          className="start-day" name='start-day'
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </p>
                      <p>
                        <input
                          type='text'
                          className="diagnosis" name='diagnosis'
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          required
                        />
                      </p>
                      <p>
                        <input
                          type='text'
                          className="health" name='health'
                          value={health}
                          onChange={(e) => setHealth(e.target.value)}
                          required
                        />
                      </p>
                      <p>
                        <input 
                          type='text'
                          className='treatments' name='treatments'
                          value={treatments}
                          onChange={(e) => setTreatments(e.target.value)}
                          required
                        />
                      </p>
                    </div>
                    <p></p>
                    </div>
                  <button type="submit" className="button">Submit</button>
                </form>
                
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdatePatient;

