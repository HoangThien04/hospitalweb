import { useState, useEffect } from "react";
import { db } from "../../services/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useAuthValue } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import UpdatePatientInformation from "./UpdatePatientInformation";

const InformationDetail = () => {
  const { currentUser } = useAuthValue();
  const [userData, setUserData] = useState();
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        console.log(currentUser.uid);
        const userDoc = await getDoc(userRef);
        const data = userDoc.data();
        console.log("userDoc: ", data);

        setUserData(data);
      } catch (error) {
        console.error("Error fetching information:", error);
      }
    };
    fetchData();
  }, [currentUser]);

  return (
    <div>
      <h1>Information Detail</h1>

      {userData? (
        
          <div >
            <p>Name: {userData.username} </p>
            <p>Age: {userData.age} </p>
            <p>Gender: {userData.gender}</p>
            <p>Insurance code: {userData.insurance}</p>
            <p>Address: {userData.address}</p>
            <p>Email: {userData.email}</p>
            
          </div>
      ) : (
        <div>
          <div>
            <p> Name: </p>
            <p> Age: </p>
            <p> Gender: </p>
            <p> InsuranceCode: </p>
            <p> Email: </p>
            {/* <button onClick={() => (deleteAppointment(appointment), deleteDoctorAppointments(appointment, userData.name))}>Cancel Appointment</button> */}
          </div>
        </div>
      ) }
    </div>
  );
};
export default InformationDetail;