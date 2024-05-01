//Các thứ liên quan đến React
import React, { useState } from 'react';
//import { connect } from 'react-redux';
//import { push } from "connected-react-router";


import { auth, db } from '../services/firebase-config'; // Đường dẫn tới file cấu hình Firebase
//import { db } from '../../services/firebase-config';
//đăng nhập và gửi email reset password
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; //Đăng nhập và quên pass

//Lấy thông tin user từ filestore
import { getFirestore, getDoc, doc } from "firebase/firestore";


// import * as actions from "../store/actions";
// import * as actions from "../../store/actions";
import './SignIn.scss';
//import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    // const dispatch = useDispatch();
    const handleOnChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const handleOnChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            const role = ['admin', 'users', 'doctor']
            //Lấy thông in vai trò từ Firestore

            for (let r of role) {
                const userDoc = await getDoc(doc(db, r, userId));
                if (userDoc.exists()) {
                    alert(r + ' logged in successfully');
                    if (r === 'admin') {
                        history.push('/administrator');
                    } else if (r === 'doctor') {
                        history.push('/doctor');
                    } else {
                        history.push('/patient');
                    }
                    return; // Exit the loop if the user role is found
                }
            }
            alert("User does not exist");
            
        } catch (error) {
            console.error("Error logging in: ", error);
            alert("Login failed: " + error.message);
        }
    };

    // console.log(formError);
    return (
        <div className="login-background">
            <div className="login-container">
                <div className="login-content">
                    <h1 className="text-login">Sign In</h1>
                    <div className="form-group login-input">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={handleOnChangeEmail}
                        />
                        <i class='bx bxs-user'></i>
                    </div>
                    <div className="form-group login-input">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={handleOnChangePassword}
                        />
                        <i class='bx bxs-lock-alt' ></i>
                    </div>
                    <div className="remember-forgot">
                        <div className="login-remember">
                            <input type="checkbox" id="remember-me" />
                            <label htmlFor="remember-me">Remember me</label>
                        </div>
                        <div className="login-forgot">
                            <Link to="/password-reset" className="forgot-password">Forgot password?</Link>
                        </div>
                    </div>
                    <button className="button-login" onClick={handleSignIn}>Login</button>
                    <div className="login-register">
                        Don't have an account? <Link to="/signup" className="register-link">Sign Up</Link>
                    </div>
                    {/* <div className="text-other-login">Or Login with:</div> */}
                    <div className="social">
                        <div className="google"><i className="fab fa-google"></i>Google</div>
                        <div className="facebook"><i className="fab fa-facebook"></i>Facebook</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn;
