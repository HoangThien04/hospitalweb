import React, { useState, useEffect } from "react";
import { db } from '../../../../services/firebase-config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import "./ManageDevice.css";
import AdminNavbar from '../../AdminNavbar';

function ManageDevice() {
  const [showDeviceForm, setShowDeviceForm] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState({
    deviceName: "",
    deviceType: "",
    deviceID: "",
    deviceStatus: "",
    manufactureDate: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const fetchDevices = async () => {
      const data = await getDocs(collection(db, "devices"));
      const devices = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setDeviceList(devices);
      setFilteredDevices(devices);
    };
    fetchDevices();
  }, []);

  const handleInputChange = (e) => {
    setDeviceInfo({ ...deviceInfo, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCloseForm = () => {
    // Xử lý khi người dùng nhấp vào nút "x"
    setShowDeviceForm(false);
  };

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredDevices(deviceList);
      return;
    }
    const filtered = deviceList.filter((device) =>
      device.deviceName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDevices(filtered);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedDevice;
      if (deviceInfo.id) {
        await updateDoc(doc(db, "devices", deviceInfo.id), deviceInfo);
        updatedDevice = { ...deviceInfo };
        setDeviceList((prevList) =>
          prevList.map((device) =>
            device.id === deviceInfo.id ? updatedDevice : device
          )
        );
        setFilteredDevices((prevFiltered) =>
          prevFiltered.map((device) =>
            device.id === deviceInfo.id ? updatedDevice : device
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "devices"), deviceInfo);
        updatedDevice = { ...deviceInfo, id: docRef.id };
        setDeviceList((prevList) => [...prevList, updatedDevice]);
        setFilteredDevices((prevFiltered) => [...prevFiltered, updatedDevice]);
      }
      // Cập nhật giao diện ngay lập tức
      // Đóng form sau khi lưu
      setShowDeviceForm(false);
    } catch (error) {
      console.error("Lỗi khi thêm hoặc cập nhật thiết bị:", error);
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    await deleteDoc(doc(db, "devices", deviceId));
    setDeviceList((prevList) =>
      prevList.filter((device) => device.id !== deviceId)
    );
    setFilteredDevices((prevFiltered) =>
      prevFiltered.filter((device) => device.id !== deviceId)
    );
  };

  return (
    <div className="manangerDevice">
      <AdminNavbar />
      <h1>Quản Lý Thiết Bị Bệnh Viện</h1>
      <input
        type="text"
        placeholder="Tìm kiếm thiết bị"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <button onClick={handleSearch}>Tìm Kiếm</button>
      <button onClick={() => setShowDeviceForm(true)}>Thêm Thiết Bị</button>
      {showDeviceForm && (
        <div className="modal">
          <div className="modal-content">
            <form onSubmit={handleFormSubmit} className="device-form">
              <input
                name="deviceName"
                placeholder="Tên thiết bị"
                value={deviceInfo.deviceName}
                onChange={handleInputChange}
              />
              <input
                name="deviceType"
                placeholder="Loại thiết bị"
                value={deviceInfo.deviceType}
                onChange={handleInputChange}
              />
              <input
                name="deviceID"
                placeholder="Số hiệu thiết bị"
                value={deviceInfo.deviceID}
                onChange={handleInputChange}
              />
              <input
                name="deviceStatus"
                placeholder="Trạng thái thiết bị"
                value={deviceInfo.deviceStatus}
                onChange={handleInputChange}
              />
              <input
                type="date"
                name="manufactureDate"
                value={deviceInfo.manufactureDate}
                onChange={handleInputChange}
              />
              <button type="submit">Lưu Thiết Bị</button>
            </form>
            <span className="close" onClick={handleCloseForm}>
              &times;
            </span>
          </div>
        </div>
      )}
      <div className="device-list">
        {filteredDevices.map((device) => (
          <div key={device.id} className="device-item">
            <div className="device-details">
              <h2>{device.deviceName}</h2>
              <p>Loại: {device.deviceType}</p>
              <p>Số hiệu: {device.deviceID}</p>
              <p>Trạng thái: {device.deviceStatus}</p>
              <p>Ngày sản xuất: {device.manufactureDate}</p>
            </div>
            <div className="button-device">
              <button
                onClick={() => {
                  setDeviceInfo(device);
                  setShowDeviceForm(true);
                }}
              >
                Chỉnh Sửa
              </button>
              <button onClick={() => handleDeleteDevice(device.id)}>Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default ManageDevice;
