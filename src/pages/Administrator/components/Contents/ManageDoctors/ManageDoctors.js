import React, { useState, useEffect } from 'react';
import './ManageDoctors.css';
import { collection, onSnapshot, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../services/firebase-config'; 
import { CiTrash } from "react-icons/ci";
import AdminNavbar from '../../AdminNavbar';
import { useHistory } from 'react-router-dom';

const ManageDoctors = () => {
    const [title, setTitle] = useState(['Order', 'Name', 'Email', 'Phone Number', 'Gender', 'Day Of Birth', 'Major', 'Status', 'UID']);
    const [doctors, setDoctors] = useState([]);
    const [searchField, setSearchField] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('Name'); // Mặc định chọn tìm kiếm theo tên
    const [statistics, setStatistics] = useState({ totalDoctors: 0, maleDoctors: 0, femaleDoctors: 0 });
    const [selectedOption, setSelectedOption] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ref = collection(db, 'doctor');
                const querySnapshot = await getDocs(ref);
                const doctorList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDoctors(doctorList);

                // Update statistics
                const totalDoctors = doctorList.length;
                const maleDoctors = doctorList.filter(doctor => doctor.gender === true).length;
                const femaleDoctors = totalDoctors - maleDoctors;
                setStatistics({ totalDoctors, maleDoctors, femaleDoctors });
            } catch (error) {
                console.error("Error getting documents:", error);
            }
        };

        fetchData();

        const unsubscribe = onSnapshot(collection(db, 'doctor'), (snapshot) => {
            const updatedDoctors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setDoctors(updatedDoctors);

            // Update statistics
            const totalDoctors = updatedDoctors.length;
            const maleDoctors = updatedDoctors.filter(doctor => doctor.gender === true).length;
            const femaleDoctors = totalDoctors - maleDoctors;
            setStatistics({ totalDoctors, maleDoctors, femaleDoctors });
        });

        return () => unsubscribe();
    }, []);

    const handleDeleteDoctor = async (doctorId) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này không?");
        if (isConfirmed) {
            try {
                await deleteDoc(doc(db, 'doctor', doctorId));
                setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
                console.log("Doctor deleted successfully!");
            } catch (error) {
                console.error("Error deleting doctor:", error);
            }
        }
    };

    const formatDate = (dateString) => {
        const [day, month, year] = dateString.split('/');
        return `${day}/${month}/${year}`;
    };

    const handleAddDoctor = () => {
        history.push('/signupdoc');
    };

    const filteredDoctors = doctors.filter(doctor => {
        if (!searchField) return true; // Nếu không có giá trị tìm kiếm, hiển thị tất cả bác sĩ
        const fieldValue = doctor[selectedProperty];
        if (selectedProperty === 'gender') {
            const genderValue = fieldValue ? 'male' : 'female';
            return genderValue.toLowerCase().includes(searchField.toLowerCase());
        }
        if (selectedProperty === 'status') {
            const statusValue = fieldValue ? 'ready' : 'busy';
            return statusValue.toLowerCase().includes(searchField.toLowerCase());
        }
        if (!fieldValue) return false; // Nếu thuộc tính không tồn tại, loại bỏ bác sĩ này khỏi danh sách
        const fieldValueLowerCase = fieldValue.toString().toLowerCase();
        return fieldValueLowerCase.includes(searchField.toLowerCase());
    });

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleGenderStatistic = () => {
        // Tính toán số lượng bác sĩ nam và nữ
        const maleDoctors = doctors.filter(doctor => doctor.gender === true).length;
        const femaleDoctors = doctors.length - maleDoctors;
        // Cập nhật state cho thống kê
        setStatistics({ totalDoctors: doctors.length, maleDoctors, femaleDoctors });
    };

    const handleStatusStatistic = () => {
        // Tính toán số lượng bác sĩ sẵn sàng và bận rộn
        const readyDoctors = doctors.filter(doctor => doctor.status === true).length;
        const busyDoctors = doctors.length - readyDoctors;
        // Cập nhật state cho thống kê
        setStatistics({ totalDoctors: doctors.length, readyDoctors, busyDoctors });
    };

    const handleStatistic = () => {
        if (selectedOption === 'gender') {
            handleGenderStatistic();
        } else if (selectedOption === 'status') {
            handleStatusStatistic();
        }
    };

    return (
        <div className='body'>
            <div className='AdminNavbar'>
                < AdminNavbar />
            </div>
            <div className='ContainerAdminDoctor'>
                <h1>MANAGE DOCTOR</h1>
                <div className="Newdoctor">
                    <button onClick={handleAddDoctor}>Add Doctor</button>
                </div>
                <div className='Searching'>
                    <label htmlFor="propertySelect">Select Properties:</label>
                    <select id="propertySelect" value={selectedProperty} onChange={(e) => setSelectedProperty(e.target.value)}>
                        <option value="name">Name</option>
                        <option value="gender">Gender</option>
                        <option value="major">Major</option>
                        <option value="status">Status</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Searching..."
                        value={searchField}
                        onChange={(e) => setSearchField(e.target.value)}
                    />
                </div>
                <div className='Showinfor'>
                    <table>
                        <thead>
                            <tr>
                                {title.map((t, index) => (
                                    <th key={index}>{t}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDoctors.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.phonenumber}</td>
                                    <td>{item.gender === true ? "Male" : "Female"}</td>
                                    <td>{formatDate(item.birth)}</td>
                                    <td>{item.major}</td>
                                    <td>{item.status === true ? "Ready" : "Busy"}</td>
                                    <td>{item.uid}</td>
                                    <td>
                                        <CiTrash
                                            style={{ fontSize: '24px', color: 'red', cursor: 'pointer' }}
                                            onClick={() => handleDeleteDoctor(item.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className='Statistics'>
                    <h2 className='Statistics-heading'>STATISTICS</h2>
                    <select value={selectedOption} onChange={handleOptionChange}>
                        <option value="">Select an option</option>
                        <option value="gender">Gender</option>
                        <option value="status">Status</option>
                    </select>
                    <button onClick={handleStatistic}>Statistics</button>
                    {selectedOption === 'gender' && (
                        <p>Total Doctors: {statistics.totalDoctors}, Male Doctors: {statistics.maleDoctors}, Female Doctors: {statistics.femaleDoctors}</p>
                    )}
                    {selectedOption === 'status' && (
                        <p>Total Doctors: {statistics.totalDoctors}, Ready Doctors: {statistics.readyDoctors}, Busy Doctors: {statistics.busyDoctors}</p>
                    )}
                </div>
            </div>
            <footer className="Footer">
                <p>© 2024. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ManageDoctors;
