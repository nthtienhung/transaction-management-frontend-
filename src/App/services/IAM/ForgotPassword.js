
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { BiHide, BiShow } from "react-icons/bi";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { generateOTP, resetPassword, verifyMail, verifyOTP } from "../api/ApiRequest";

function ForgotPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [otpGenerated, setOtpGenerated] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpExpired, setOtpExpired] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
    const navigate = useNavigate();

    // Timer logic for OTP expiration
    useEffect(() => {
        if (otpGenerated && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setOtpExpired(true); // Mark OTP as expired
        }
    }, [timeLeft, otpGenerated]);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        otp: emailSent && otpGenerated
            ? Yup.string().required("OTP is required")
            : Yup.string(),
        newPassword: otpVerified
            ? Yup.string().min(6, "Password must be at least 6 characters").required("New password is required")
            : Yup.string(),
        confirmPassword: otpVerified
            ? Yup.string()
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
                .required("Confirm your password")
            : Yup.string(),
    });

    const userFormData = useFormik({
        initialValues: {
            email: "",
            otp: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                if (!emailSent) {
                    const response = await verifyMail(values.email);
                    if (response.status === 200) {
                        toast.success("Verification email sent. Please check your inbox!", {
                            position: "top-right",
                            autoClose: 3000,
                        });
                        setEmailSent(true);
                    }
                } else if (!otpGenerated) {
                    const response = await generateOTP(values.email);
                    if (response.status === 200) {
                        toast.success("OTP sent successfully to your email.", {
                            position: "top-right",
                            autoClose: 3000,
                        });
                        setOtpGenerated(true);
                        setOtpExpired(false); // Reset expired status
                        setTimeLeft(60); // Restart countdown
                    }
                } else if (!otpVerified) {
                    const response = await verifyOTP({ email: values.email, otp: values.otp });
                    if (response.status === 200) {
                        toast.success("OTP verified successfully!", {
                            position: "top-right",
                            autoClose: 3000,
                        });
                        setOtpVerified(true);
                    }
                } else {
                    const response = await resetPassword({
                        email: values.email,
                        newPassword: values.newPassword,
                        confirmPassword: values.confirmPassword,
                    });
                    if (response.status === 200) {
                        toast.success("Password reset successfully!", {
                            position: "top-right",
                            autoClose: 3000,
                        });
                        navigate("/"); // Redirect to login after successful reset
                    }
                }
            } catch (error) {
                const message =
                    error.response?.data?.message || "An error occurred. Please try again.";
                if (message.includes("expired")) {
                    setOtpExpired(true);
                    toast.error("OTP has expired. Please re-send OTP.", {
                        position: "top-right",
                        autoClose: 3000,
                    });
                } else {
                    toast.error(message, {
                        position: "top-right",
                        autoClose: 3000,
                    });
                }
            }
        },
    });

    const handleResendOTP = async () => {
        try {
            const response = await generateOTP(userFormData.values.email);
            if (response.status === 200) {
                toast.success("OTP sent successfully to your email.", {
                    position: "top-right",
                    autoClose: 3000,
                });
                setOtpGenerated(true);
                setOtpExpired(false); // Reset OTP expiration status
                setTimeLeft(60); // Restart countdown
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "An error occurred while re-sending OTP.",
                {
                    position: "top-right",
                    autoClose: 3000,
                }
            );
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="container-xxl backgroundLayout">
                <div className="authentication-wrapper authentication-basic container-p-y">
                    <div className="authentication-inner">
                        <div className="card px-sm-6 px-0">
                            <div className="card-body">
                                <h4 className="mb-1">Forgot Password</h4>
                                <p className="mb-6">Enter your email to receive a verification link and reset your password.</p>

                                <form id="formForgotPassword" onSubmit={userFormData.handleSubmit}>
                                    <div className="mb-6 formInputValue">
                                        <label htmlFor="email" className="form-label">
                                            <FaUser className="iconUser" />
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control formInput"
                                            id="email"
                                            name="email"
                                            onChange={userFormData.handleChange}
                                            value={userFormData.values.email}
                                            placeholder="Enter your email"
                                            onBlur={userFormData.handleBlur}
                                        />
                                    </div>
                                    {userFormData.touched.email && userFormData.errors.email ? (
                                        <div style={{ color: "red", fontSize: "10px" }}>
                                            {userFormData.errors.email}
                                        </div>
                                    ) : null}
                                    {emailSent && otpGenerated && !otpVerified && (
                                        <>
                                            <div className="mb-6 formInputValue">
                                                <label htmlFor="otp" className="form-label">
                                                    OTP
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control formInput"
                                                    id="otp"
                                                    name="otp"
                                                    onChange={userFormData.handleChange}
                                                    value={userFormData.values.otp}
                                                    placeholder="Enter the OTP sent to your email"
                                                    onBlur={userFormData.handleBlur}
                                                />
                                            </div>
                                            {userFormData.touched.otp && userFormData.errors.otp ? (
                                                <div style={{ color: "red", fontSize: "10px" }}>
                                                    {userFormData.errors.otp}
                                                </div>
                                            ) : null}
                                            {otpExpired ? (
                                                <div className="mb-6">
                                                    <button
                                                        className="btn btn-secondary d-grid w-100"
                                                        type="button"
                                                        onClick={handleResendOTP}
                                                    >
                                                        Re-send OTP
                                                    </button>
                                                </div>
                                            ) : (
                                                <p style={{ fontSize: "12px", color: "grey" }}>
                                                    OTP will expire in {timeLeft} seconds.
                                                </p>
                                            )}
                                        </>
                                    )}
                                    {otpVerified && (
                                        <>
                                            <div className="mb-6 formInputValue">
                                                <label htmlFor="newPassword" className="form-label">New Password</label>
                                                <div className="input-group input-group-merge">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="newPassword"
                                                        name="newPassword"
                                                        className="form-control"
                                                        onChange={userFormData.handleChange}
                                                        value={userFormData.values.newPassword}
                                                        placeholder="Enter new password"
                                                        onBlur={userFormData.handleBlur}
                                                    />
                                                    <span
                                                        className="input-group-text cursor-pointer"
                                                        onClick={togglePasswordVisibility}
                                                    >
                            {showPassword ? <BiShow /> : <BiHide />}
                          </span>
                                                </div>
                                            </div>
                                            {userFormData.touched.newPassword && userFormData.errors.newPassword ? (
                                                <div style={{ color: "red", fontSize: "10px" }}>
                                                    {userFormData.errors.newPassword}
                                                </div>
                                            ) : null}
                                            <div className="mb-6 formInputValue">
                                                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                                <div className="input-group input-group-merge">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        className="form-control"
                                                        onChange={userFormData.handleChange}
                                                        value={userFormData.values.confirmPassword}
                                                        placeholder="Confirm your password"
                                                        onBlur={userFormData.handleBlur}
                                                    />
                                                    <span
                                                        className="input-group-text cursor-pointer"
                                                        onClick={togglePasswordVisibility}
                                                    >
                            {showPassword ? <BiShow /> : <BiHide />}
                          </span>
                                                </div>
                                            </div>
                                            {userFormData.touched.confirmPassword && userFormData.errors.confirmPassword ? (
                                                <div style={{ color: "red", fontSize: "10px" }}>
                                                    {userFormData.errors.confirmPassword}
                                                </div>
                                            ) : null}
                                        </>
                                    )}
                                    <div className="mb-6">
                                        <button
                                            className="btn btn-primary d-grid w-100"
                                            type="submit"
                                        >
                                            {otpVerified ? "Reset Password" : emailSent ? "Verify OTP" : "Send Email"}
                                        </button>
                                    </div>
                                </form>
                                <p className="text-center">
                                    <a href="/">Back to Login</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;
