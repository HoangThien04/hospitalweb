import React, { useState } from 'react';
import { auth, db } from '../../../../services/firebase-config'; // Đảm bảo đường dẫn đúng
import './SignIn.scss';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FirebaseError } from 'firebase/app';
import { Link } from 'react-router-dom';
import { useAuthValue } from '../../../../../context/AuthContext';
import { useHistory } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [mail, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [formError, setFormError] = useState('');
    const { setTimeActive } = useAuthValue();
    const history = useHistory();



    const isEmptyValue = (value) => {
        return !value || value.trim().length < 1;
    }
    const isEmailValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    const validateForm = () => {
        const error = {};
        if (isEmptyValue(mail)) {
            error["mail"] = "Email is required";
        }
        else {
            if (!isEmailValid(mail)) {
                error["mail"] = "Email is invalid";
            }
        }
        if (isEmptyValue(username)) {
            error["username"] = "Username is required";
        }
        if (isEmptyValue(password)) {
            error["password"] = "Password is required";
        }
        if (isEmptyValue(confirmpassword)) {
            error["confirmpassword"] = "Confirm Password is required";
        }
        else if (password !== confirmpassword) {
            error["confirmpassword"] = "Confirm Password is not match";
        }

        setFormError(error);

        return Object.keys(error).length === 0;
    }

    const handleOnChangeUsername = (event) => {
        setUsername(event.target.value);
    }

    const handleOnChangePassword = (event) => {
        setPassword(event.target.value);
    };
    const handleOnChangeConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
    };
    const handleOnChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    // const handleForgotPassword = async () => {
    //     if (!isEmailValid(username)) {
    //         toast.error("Please enter a valid email address.");
    //         return;
    //     }
    //     try {
    //         await sendPasswordResetEmail(auth, username);
    //         alert("A password reset email has been sent to your email address.");
    //     } catch (error) {
    //         console.error("Failed to send password reset email: ", error);
    //         alert("Failed to send password reset email. Please try again.");
    //     }
    // };


    const handleSignUp = async (event) => {
        event.preventDefault(); // ngăn trang reload khi nhấn nút submit

        console.log('Username: ', username);
        console.log('Password: ', password);
        console.log('Confirm Password: ', confirmpassword);

        if (validateForm()) {
            console.log('Form is valid');
            try {

                // Sử dụng Firebase Auth để tạo tài khoản mới
                const userCredential = await createUserWithEmailAndPassword(auth, mail, password);
                console.log("User created: ", userCredential.user);
                //setTimeActive(true);

                // const firstname = "Test";
                // const lastname = "Thu thoi";
                // Tùy chọn: Lưu thông tin người dùng vào Firestore
                // const docRef = await addDoc(collection(db, "Accounts"), {
                //     username: username,
                //     // Bạn có thể thêm thêm thông tin tại đây
                //     firstname: firstname,
                //     lastname: lastname,
                // });
                // console.log("Document written with ID: ", docRef.id);
                const userRef = doc(db, "doctor", userCredential.user.uid); // Lấy uid làm ID document
                await setDoc(userRef, {
                    uid: userCredential.user.uid,
                    appointments: [],
                    username: username,
                    email: mail,
                    history: [],
                    // Bạn có thể thêm thêm thông tin tại đây
                });
                alert('User added successfully');
                history.push('/signin');

            } catch (error) {
                // Hiển thị thông tin lỗi trong console
                const errorMessage = error.message.replace('Firebase: ', ''); // Loại bỏ "Firebase: "
                console.error(errorMessage); // Hiển thị thông điệp lỗi đã được chỉnh sửa
                alert(errorMessage);
            }
        }
        else {
            console.log('Form is invalid');
            alert('Error adding user');
        }


    };
    console.log(formError);
    return (
        <div className="login-background">
            <div className="login-container">
                <div className="login-content">
                    <h1 className="text-login">Sign Up</h1> {/* Chỉ cần thay đổi text từ Login thành Sign Up */}
                    <div className="form-group login-input">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username"
                            value={username}
                            onChange={handleOnChangeUsername}
                        />
                        {formError.username && <div className="error-message">{formError.username}</div>}
                    </div>
                    <div className="form-group login-input">
                        <input
                            type="mail"
                            className="form-control"
                            placeholder="Email"
                            value={mail}
                            onChange={handleOnChangeEmail}
                        />
                        {formError.mail && <div className="error-message">{formError.mail}</div>}
                    </div>
                    <div className="form-group login-input">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={handleOnChangePassword}
                        />
                        {formError.password && <div className="error-message">{formError.password}</div>}
                    </div>
                    <div className="form-group login-input">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Confirm Password"
                            value={confirmpassword}
                            onChange={handleOnChangeConfirmPassword}
                        />
                        {formError.confirmpassword && <div className="error-message">{formError.confirmpassword}</div>}
                    </div>
                    <button className="button-login" onClick={handleSignUp}>Sign Up</button>
                    <div className="login-register">
                        Already have an account? <Link to="/signin" className="register-link">Sign In</Link>
                    </div>
                    {/* Tạm thời comment phần đăng nhập bằng mạng xã hội
            <div className="text-other-login">Or Login with:</div>
            <div className="social-login">
                <i className="fab fa-google-plus-g google"></i>
                <i className="fab fa-facebook-f facebook"></i>
            </div>
            */}
                </div>
            </div>
        </div>

    )
}
// Trong file SignUp.js
export default SignUp;
