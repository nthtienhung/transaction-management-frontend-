import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, generateOtp } from "../api/authService";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyOtp = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: location.state?.email || "",
        otp: "",
    });
    const [countdown, setCountdown] = useState(120);
    const [isOtpExpired, setIsOtpExpired] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await verifyOtp(formData);
            toast.success("OTP verified successfully!", {
                position: "top-right",
                autoClose: 3000,
            });
            setTimeout(() => navigate("/"), 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || "OTP verification failed. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
            setIsSubmitting(false);
        }
    };

    const handleGenerateOtp = async () => {
        try {
            await generateOtp(formData.email);
            toast.success("A new OTP has been sent to your email.", {
                position: "top-right",
                autoClose: 3000,
            });
            setCountdown(120);
            setIsOtpExpired(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else {
            setIsOtpExpired(true);
        }
    }, [countdown]);

    useEffect(() => {
        if (!formData.email) {
            toast.error("No email found. Please return to the registration page.", {
                position: "top-right",
                autoClose: 5000,
            });
            setTimeout(() => navigate("/"), 5000);
        }
    }, [formData.email, navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{ width: "400px" }}>
                <h2 className="text-center">Verify OTP</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            name="otp"
                            className="form-control"
                            placeholder="OTP"
                            onChange={handleChange}
                            required
                            disabled={isOtpExpired || isSubmitting}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isOtpExpired || isSubmitting}
                    >
                        {isSubmitting ? "Verifying..." : "Verify"}
                    </button>
                </form>
                <div className="text-center mt-2">
                    {isOtpExpired ? (
                        <button className="btn btn-link" onClick={handleGenerateOtp}>
                            Resend OTP
                        </button>
                    ) : (
                        <p>Time left: {countdown}s</p>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default VerifyOtp;
