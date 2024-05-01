import { Link } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../../services/firebase-config';
import { getDoc, updateDoc, doc } from "firebase/firestore"; // Import các biến và hàm từ Firebase Firestore
import InformationDetail from "./InformationDetail";
import { useAuthValue } from '../../../context/AuthContext';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const isDefine = (e, name, age, gender, insurance, email) => {
    if (e.information == null){
        console.log('Patient is undefine');
        return true;
    }
    //check if there are existing patient that match the provided information
    const conflictPatient = e.information.find(information => information.name===name 
                                                                    && information.age===age
                                                                    && information.gender===gender
                                                                    && information.insurance===insurance
                                                                    && information.email===email);
    if(!conflictPatient){
        console.log('Patient is undefine');
        return true;
    }   
    console.log('Patient is define');
    return false; 
};

const UpdatePatientInformation =  () => {
    const[name,setName]=useState('');
    const [age,setAge ]= useState('');
    const[gender,setGender]=useState('');
    const[insurance,setInsurance]=useState('');
    const[email,setEmail]=useState('');
    const[address,setAddress]=useState('');
    const {currentUser}=useAuthValue();
    const history = useHistory(); 
    const setInformationDetail = async(e) =>{
        e.preventDefault();
        console.log('currentUser: ',currentUser);
        try{
            //Lấy dữ liệu từ firestore
            const userRef = doc(db, 'users', currentUser.uid);
            console.log('userRef:',userRef);
            const userDoc = await getDoc(userRef);
            console.log('userDoc:',userDoc);
            const userData=userDoc.data(); // lấy dữ liệu hiện tại

            console.log('userData:',userData);
            if(isDefine(userDoc,name,age,gender,insurance,email)){
                const updatedUserData={
                    ...userData,
                        username: name,
                        age: age,
                        gender: gender,
                        insurance: insurance,
                        email: email,
                        address:address
                    };
                    
                await updateDoc(userRef,updatedUserData);
                alert('Patient Information Updated Successfully');
            }}
            catch( error){
                console.error('Error updating Patient Information:',error);
            }
        };
        const handlePatientInformation = () => {
    
            history.push("/InformationDetail"); 
          };

        return (
            <div className='updatePatient'>
            <h1><strong>Update Information</strong></h1>
            <form onSubmit={setInformationDetail}>
                <div className='row'>
                <div className='columnl'>
                <p> Name: </p>
                <input
                type='string'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
                
                <br/>
                <p> Age:</p>
                <input
                type='number'
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                />
                
                <br/>
                <p> Gender</p>
                <input
                type='string'
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                />
                </div>
                <div className='columnr'>
             
                <p> Insurance Code:</p>
                <input
                type='string'
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
                required
                />
                <br/>
                <p> Address:</p>
                <input
                type='string'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                />
                <br/>
                <p>Email:</p>
                <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                </div>
                </div>
                <br/>
                <button type='submit'  >Update Information</button>
            </form>
            </div>
        );


};
export default UpdatePatientInformation;