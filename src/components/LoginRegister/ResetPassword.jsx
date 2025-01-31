import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { v4 as uuidv4 } from 'uuid';

function ResetPassword() {
    const navigate = useNavigate();
    
    // States for form inputs and verification process
    const [startVerify, setStartVerify] = useState(false);
    const [verifySuccess, setVerifySuccess] = useState(false);
    const [secPW, setSecPW] = useState("");
    const [verifyCode, setVerifyCode] = useState("");
    const [inputVerify, setInputVerify] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
    const [processing, setProcessing] = useState(false);     // Track system processing state

    // Generate verification code on component mount
    useEffect(() => { 
        setVerifyCode(uuidv4()); 
    }, []);

    // Handle new user password submission
    const submitNewPassword = async () => {
        try {
            setProcessing(true);  // Show "Please wait... System Processing" message
            await axios.post(`${import.meta.env.VITE_BACKEND_API}/newusers/reset-password-verify`, {
                newPassword,
                username: email,
            });
            alert('Password reset successful');
            navigate('/login');  // Redirect to login after successful reset
        } catch (error) {
            console.error("Error resetting password", error);
            alert('Failed to reset password. Please try again.');
        } finally {
            setProcessing(false);  // Stop processing message
        }
    };

    // Handle email verification code matching
    useEffect(() => {
        if (verifyCode === inputVerify && inputVerify) {
            setVerifySuccess(true);
            submitNewPassword();  // Trigger password update on successful verification
        }
    }, [inputVerify, verifyCode]);

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        if (secPW !== newPassword) {
            alert("Passwords do not match. Please check your password entries.");
            return;
        }

        setIsSubmitting(true);   // Hide submit button after it's clicked
        setStartVerify(true);    // Start verification process
        sendVerificationCode();
    };

    // Send verification code via email using EmailJS
    const sendVerificationCode = () => {
        emailjs.init(import.meta.env.VITE_PUBLIC_KEY_EMAILJS);
        
        const templateParams = {
            user_email: email,
            to_name: email,
            from_name: 'HHP Admin',
            message: verifyCode,
        };

        emailjs.send(import.meta.env.VITE_SERVICE_ID_EMAILJS, import.meta.env.VITE_TEMPLATE_EMAILJS, templateParams)
            .then(response => {
                console.log('Email sent successfully!', response.status, response.text);
            })
            .catch(error => {
                console.error('Failed to send email verification', error);
                alert('Failed to send verification code. Please try again.');
            });
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        className="form-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-input"
                        value={secPW}
                        onChange={(e) => setSecPW(e.target.value)}
                        required
                    />
                </div>
    
                {!isSubmitting && (
                    <button type="submit" className="btn-primary">Reset Password</button>
                )}
            </form>
    
            {startVerify && !verifySuccess && (
                <div className="form-group">
                    <label htmlFor="verificationCode" className="form-label">Verification Code:</label>
                    <input
                        type="text"
                        id="verificationCode"
                        className="form-input"
                        value={inputVerify}
                        onChange={(e) => setInputVerify(e.target.value)}
                        required
                    />
                </div>
            )}
    
            {verifySuccess && (
                <div className="processing-message">
                    <p>Please wait... System Processing</p>
                </div>
            )}
        </>
    );
    
}

export default ResetPassword;
