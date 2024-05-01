import React, { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
import { db } from '../../../../services/firebase-config';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import './ManageMedicine.scss';
import Modal from './Modal/Modal';
import AdminNavbar from '../../AdminNavbar';

const ManageMedicine = () => {
  const [medicines, setMedicines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMedicineDetails, setNewMedicineDetails] = useState({
    name: '',
    producer: '',
    quantity: 0,
    importDate: new Date().toISOString().split('T')[0], 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const medicinesCollectionRef = collection(db, 'medicines');
  const [showDeleteAmountModal, setShowDeleteAmountModal] = useState(false);
  const [deleteAmount, setDeleteAmount] = useState(0);
  const [medicineToDelete, setMedicineToDelete] = useState(null);

  useEffect(() => {
    const getMedicines = async () => {
      const data = await getDocs(medicinesCollectionRef);
      setMedicines(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getMedicines();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedicineDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddNewMedicine = async (e) => {
    e.preventDefault();
    e.preventDefault();
    
    const inputQuantity = parseInt(newMedicineDetails.quantity, 10);
    if (isNaN(inputQuantity)) {
      alert('Please enter a valid number for the quantity.');
      return;
    }
  
    const existingMedicineIndex = medicines.findIndex((medicine) => 
      medicine.name === newMedicineDetails.name && 
      medicine.producer === newMedicineDetails.producer && 
      medicine.importDate === newMedicineDetails.importDate
    );
  
    if (existingMedicineIndex !== -1) {
      const existingMedicine = medicines[existingMedicineIndex];
      const updatedQuantity = existingMedicine.quantity + inputQuantity;
      
      try {
        await updateDoc(doc(db, 'medicines', existingMedicine.id), {
          quantity: updatedQuantity,
        });

        const updatedMedicines = [...medicines];
        updatedMedicines[existingMedicineIndex] = {
          ...existingMedicine,
          quantity: updatedQuantity
        };
        setMedicines(updatedMedicines);
      } catch (error) {
        console.error('Error updating medicine quantity: ', error);
      }
    } else {
      try {
        const docRef = await addDoc(medicinesCollectionRef, {
          ...newMedicineDetails,
          quantity: inputQuantity
        });
        setMedicines([...medicines, { ...newMedicineDetails, id: docRef.id, quantity: inputQuantity }]);
      } catch (error) {
        console.error('Error adding new medicine: ', error);
      }
    }
  
    setNewMedicineDetails({ name: '', producer: '', quantity: 0, importDate: new Date().toISOString().split('T')[0] });
    setShowModal(false);
  };

  const deleteOneMedicine = async (id) => {
    const medicine = medicines.find((m) => m.id === id);
    if (medicine.quantity > 1) {
      await updateDoc(doc(db, 'medicines', id), {
        quantity: medicine.quantity - 1,
      });
      setMedicines(medicines.map((m) => 
        m.id === id ? { ...m, quantity: m.quantity - 1 } : m
      ));
    } else {
      await deleteDoc(doc(db, 'medicines', id));
      setMedicines(medicines.filter((m) => m.id !== id));
    }
  };

  const deleteMedicineAmount = async (id, amount) => {
    const amountToDelete = prompt('Enter the amount to delete:');
    const amountNumber = Number(amountToDelete);
  
    if (isNaN(amountNumber) || amountNumber <= 0) {
      alert('Please enter a valid number greater than zero.');
      return;
    }
  
    const medicineIndex = medicines.findIndex((m) => m.id === id);
    if (medicineIndex === -1) return; 
  
    const medicine = medicines[medicineIndex];
  
    if (medicine.quantity > amountNumber) {
      await updateDoc(doc(db, 'medicines', id), {
        quantity: medicine.quantity - amountNumber,
      });
      setMedicines(medicines.map((m) => 
        m.id === id ? { ...m, quantity: m.quantity - amountNumber } : m
      ));
    } else if (medicine.quantity === amountNumber) {
      await deleteDoc(doc(db, 'medicines', id));
      setMedicines(medicines.filter((m) => m.id !== id));
    } else {
      alert(`Cannot delete ${amountNumber}. Only ${medicine.quantity} available.`);
    }
  };

  const deleteAllMedicines = async (id) => {
    await deleteDoc(doc(db, 'medicines', id));
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMedicines = searchTerm.trim()
    ? medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    : medicines;
  
  const handleDeleteAmount = (medicineId) => {
    setMedicineToDelete(medicineId);
    setShowDeleteAmountModal(true);
  };
  
  const submitDeleteAmount = async () => {
    const amountNumber = parseInt(deleteAmount, 10);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      alert('Please enter a valid number greater than zero.');
      return;
    }
  
    if (!medicineToDelete) {
      alert('No medicine selected to delete from.');
      return;
    }
  
    const medicineIndex = medicines.findIndex((medicine) => medicine.id === medicineToDelete);
    if (medicineIndex === -1) {
      alert('Medicine not found.');
      return;
    }
  
    const medicine = medicines[medicineIndex];
    if (medicine.quantity >= amountNumber) {
      try {
        await updateDoc(doc(db, 'medicines', medicineToDelete), {
          quantity: medicine.quantity - amountNumber
        });
  
        const updatedMedicines = [...medicines];
        updatedMedicines[medicineIndex] = {
          ...medicine,
          quantity: medicine.quantity - amountNumber
        };
        setMedicines(updatedMedicines);
      } catch (error) {
        console.error('Error updating medicine quantity: ', error);
      }
    } else {
      alert(`Cannot delete ${amountNumber}. Only ${medicine.quantity} available.`);
    }
  
    setShowDeleteAmountModal(false);
    setDeleteAmount(0);
    setMedicineToDelete(null);
  };
  
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="medicine-container">
      <AdminNavbar />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Medicine"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <button onClick={() => setShowModal(true)}>Add New Medicine</button>

      {showModal && (
         <Modal onClose={closeModal} additionalClass="add-medicine-modal">
         <form onSubmit={handleAddNewMedicine} className="medicine-form">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name of the Medicine"
            value={newMedicineDetails.name}
            onChange={handleInputChange}
          />
      
          <label htmlFor="producer">Producer</label>
          <input
            type="text"
            id="producer"
            name="producer"
            placeholder="Producer"
            value={newMedicineDetails.producer}
            onChange={handleInputChange}
          />
      
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Quantity"
            value={newMedicineDetails.quantity}
            onChange={handleInputChange}
          />
      
          <label htmlFor="importDate">Import Date</label>
          <input
            type="date"
            id="importDate"
            name="importDate"
            value={newMedicineDetails.importDate}
            onChange={handleInputChange}
          />
      
          <button type="submit" className="submit-button">Submit</button>
          </form>
      </Modal>
      )}
      
      {showDeleteAmountModal && (
  <Modal onClose={() => setShowDeleteAmountModal(false)} additionalClass="delete-amount-modal">
    <form onSubmit={(e) => {
      e.preventDefault();
      submitDeleteAmount();
    }} className="medicine-form">
      <span className="modal-title">Delete Medicine Amount</span>
      <input
        type="number"
        className="input-field"
        placeholder="Enter amount to delete"
        value={deleteAmount}
        onChange={(e) => setDeleteAmount(e.target.value)}
      />
      <div className="modal-actions">
        <button type="button" className="cancel-button" onClick={() => setShowDeleteAmountModal(false)}>Cancel</button>
        <button type="submit" className="submit-button">Confirm Delete</button>
      </div>
    </form>
  </Modal>
)}


      <div className="medicine-list">
        {filteredMedicines.map((medicine) => (
          <div key={medicine.id} className="medicine-item">
            <div className="medicine-info">
              <span className="medicine-name">{medicine.name}</span>
              <span className="medicine-producer">
                Producer: {medicine.producer}
              </span>
              <span className="medicine-quantity">
                Quantity: {medicine.quantity}
              </span>
              <span className="medicine-import-date">
                Import Date: {formatDate(medicine.importDate)}
              </span>
            </div>
            <div className="medicine-actions">
              <button
                className="delete-one"
                onClick={() => deleteOneMedicine(medicine.id)}
              >
                Delete One
              </button>
              <button className="delete-amount" onClick={() => handleDeleteAmount(medicine.id)}>
                Delete Amount
              </button>
              <button
                className="delete-all"
                onClick={() => deleteAllMedicines(medicine.id)}
              >
                Delete All
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageMedicine;
