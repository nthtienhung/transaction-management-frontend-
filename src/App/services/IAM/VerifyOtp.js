import React, { useState, useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { verifyOtp, generateOtp } from "../api/authService";
import Toast from "./Toast";

const VerifyOtp = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: location.state?.email || "",
        otp: "",
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [countdown, setCountdown] = useState(120);
    const [isOtpExpired, setIsOtpExpired] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await verifyOtp(formData);
            setMessage(response.data.message);
            setMessageType("success");
            navigate("/");
        } catch (error) {
            setMessage(error.response?.data?.message || "An error occurred.");
            setMessageType("error");
        }
    };

    const handleGenerateOtp = async () => {
        try {
            await generateOtp(formData.email);
            setMessage("A new OTP has been sent to your email.");
            setMessageType("success");
            setCountdown(120);
            setIsOtpExpired(false);
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to generate OTP.");
            setMessageType("error");
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
            setMessage("Email is missing. Please register again.");
            setMessageType("error");
        }
    }, [formData.email]);

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
                            disabled={isOtpExpired}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={isOtpExpired}>
                        Verify
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
                {message && (
                    <Toast
                        message={message}
                        type={messageType}
                        onClose={() => setMessage("")}
                    />
                )}
            </div>
        </div>
    );
};

export default VerifyOtp;
