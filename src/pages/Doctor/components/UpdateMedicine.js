// src/components/AppointmentForm.js
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase-config';
import { getDoc, updateDoc, doc } from "firebase/firestore"; // Import các biến và hàm từ Firebase Firestore
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthValue } from '../../../context/AuthContext';
import DoctorNavbar from './DoctorNavbar';


const UpdateMedicine = () => {
  const [medicine, setMedicine] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn chặn hành động mặc định của form

        try {
            // Truy vấn cơ sở dữ liệu để lấy thông tin về thuốc
            const medicineQuery = query(collection(db, 'medicines'), where('name', '==', medicine));
            const medicineSnapshot = await getDocs(medicineQuery);
            const medicineDoc = medicineSnapshot.docs[0];

            // Kiểm tra nếu không tìm thấy thuốc
            if (!medicineDoc) {
                setError('Medicine not found!');
                return;
            }

            const medicineData = medicineDoc.data();
            const currentQuantity = medicineData.quantity;

            // Kiểm tra số lượng thuốc còn lại
            if (currentQuantity < quantity) {
                setError('Not enough medicine!');
                console.error('Error updating quantity:', error);
                alert('Not enough medicine!');
                return;
            }

            // Cập nhật số lượng thuốc
            const medicineRef = doc(db, 'medicines', medicineDoc.id); // Lấy reference của document cần cập nhật
            const updatedQuantity = currentQuantity - parseInt(quantity);
            await updateDoc(medicineRef, { quantity: updatedQuantity });

            // Thực hiện các hành động cần thiết sau khi cập nhật thành công
            console.log('Quantity updated successfully!');
            setError('');
        } catch (error) {
            console.error('Error updating quantity:', error);
            setError('Error updating quantity!');
        }
    };

  return (
    <div>
      <DoctorNavbar />
      
      <div className="doctor">
          <div className="appointment-form">
              <h2>Update Medicine</h2>
              <form id="update-medicine" onSubmit={handleSubmit}>
                  <div className='appoi-form'>
                      <div className='form'>
                              <p>
                                  <label htmlFor='medicine-name'>Medicine: </label>
                              </p>
                              <br />
                              <p>
                                  <label htmlFor='quantity'>Quantity: </label>
                              </p>
                      </div>
                      <div className='form-ingr'>
                          <p>
                              <input
                                  type='text'
                                  className="medicine-name" name='medicine-name'
                                  required
                                  value={medicine}
                                  onChange={(e) => setMedicine(e.target.value)}
                              />
                          </p>
                          <br />
                          <p>
                              <input
                                  type='number'
                                  className="quantity" name='quantity'
                                  required
                                  value={quantity}
                                  onChange={(e) => setQuantity(e.target.value)}
                              />
                          </p>
                      </div>
                      <p></p>
                  </div>
                  <br />
                  <button type="submit" className="button">Submit</button>
              </form>
          </div>
      </div>
  </div>
    );
}

export default UpdateMedicine;
