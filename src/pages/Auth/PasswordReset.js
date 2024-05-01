import React, { useState } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../services/firebase-config'; // Đường dẫn cần được kiểm tra cho đúng
import { toast, ToastContainer } from 'react-toastify';
import './PasswordReset.scss';
const PasswordReset = () => {
    const [email, setEmail] = useState('');

    const isEmailValid = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !isEmailValid(email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("A password reset email has been sent to your email address.");
        } catch (error) {
            console.error("Failed to send password reset email: ", error);
            toast.error("Failed to send password reset email. Please try again.");
        }
    };

    return (
        <div className='password-reset-background'>
            <div className="password-reset-container">
                <ToastContainer position="top-center" autoClose={5000} />
                {/* <form onSubmit={handleSubmit}>
                    <div className="col-12 form-group change-password-input">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            className="form-control"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Send Reset Email</button>
                </form> */}
                <div className='password-reset-content row'>
                    <div className="col-12 text-change-password">Reset Password</div>
                    <div className="col-12 form-group password-reset-input">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            className="form-control"
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="col-12">
                        <button class="button-change-password" onClick={handleSubmit}>Send Reset Password</button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default PasswordReset;
