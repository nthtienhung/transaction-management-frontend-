import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { GrKey } from "react-icons/gr";
import { BiHide, BiShow } from "react-icons/bi";
import * as Yup from "yup";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgotPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [otpGenerated, setOtpGenerated] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const validationSchema = Yup.object({
        email: Yup.string().email("Invalid email address").required("Email is required"),
        otp: emailSent && otpGenerated ? Yup.string().required("OTP is required") : Yup.string(),
        newPassword: otpVerified ? Yup.string().min(6, "Password must be at least 6 characters").required("New password is required") : Yup.string(),
        confirmPassword: otpVerified && Yup.string()
            .oneOf([Yup.ref('newPassword'), null], "Passwords must match")
            .required("Confirm your password"),
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
                    // Send email verification request
                    const response = await axios.post("http://localhost:8081/auth/forgot-password/verify-mail", { email: values.email });
                    if (response.status === 200) {
                        toast.success("Verification email sent. Please check your inbox!", {
                            position: "top-right",
                            autoClose: 3000,
                        });
                        setEmailSent(true);
                    }
                } else if (!otpGenerated) {
                    // Generate OTP after email verification
                    const response = await axios.post(`http://localhost:8081/auth/forgot-password/generate?email=${values.email}`);
                    if (response.status === 200) {
                        toast.success("OTP sent successfully to your email.", {
                            position: "top-right",
                            autoClose: 3000,
                        });
                        setOtpGenerated(true);
                    }
                } else if (!otpVerified) {
                    // Verify OTP
                    const response = await axios.post("http://localhost:8081/auth/forgot-password/verify-otp", { email: values.email, otp: values.otp });
                    if (response.status === 200) {
                        toast.success("OTP verified successfully!", {
                            position: "top-right",
                            autoClose: 3000,
                        });
                        setOtpVerified(true);
                    }
                } else {
                    // Reset password
                    const response = await axios.post("http://localhost:8081/auth/forgot-password/reset", {
                        email: values.email,
                        newPassword: values.newPassword,
                        confirmPassword: values.confirmPassword,
                    });
                    if (response.status === 200) {
                        toast.success("Password reset successfully!", {
                            position: "top-right",
                            autoClose: 3000,
                        });
                        navigate("/login");  // Redirect to login after password reset
                    }
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "An error occurred. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        },
    });

    return (
        <>
            <ToastContainer />
            <div className="container-xxl backgroundLayout">
                <div className="authentication-wrapper authentication-basic container-p-y">
                    <div className="authentication-inner">
                        <div className="card px-sm-6 px-0">
                            <div className="card-body">
                                <h4 className="mb-1">Forgot Password</h4>
                                <p className="mb-6">
                                    Enter your email to receive a verification link and reset your password.
                                </p>

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

                                    {emailSent && !otpGenerated && (
                                        <div className="mb-6 formInputValue">
                                            <button
                                                type="button"
                                                className="btn btn-secondary d-grid w-100"
                                                onClick={userFormData.submitForm} // Trigger OTP generation
                                            >
                                                Generate OTP
                                            </button>
                                        </div>
                                    )}

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
                                        </>
                                    )}

                                    {otpVerified && (
                                        <>
                                            <div className="mb-6 form-password-toggle formInputValue">
                                                <label htmlFor="newPassword" className="form-label">
                                                    <GrKey className="icon" />
                                                </label>
                                                <div className="input-group input-group-merge formInput">
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

                                            <div className="mb-6 form-password-toggle formInputValue">
                                                <label htmlFor="confirmPassword" className="form-label">
                                                    Confirm Password
                                                </label>
                                                <div className="input-group input-group-merge formInput">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        className="form-control"
                                                        onChange={userFormData.handleChange}
                                                        value={userFormData.values.confirmPassword}
                                                        placeholder="Confirm your new password"
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
                                        <button className="btn btn-primary d-grid w-100" type="submit">
                                            {emailSent && !otpGenerated ? "Generate OTP" : otpGenerated && !otpVerified ? "Verify OTP" : otpVerified ? "Reset Password" : "Send Verification Email"}
                                        </button>
                                    </div>
                                </form>

                                <p className="text-center">
                                    <span>Remember your password?</span>
                                    <a href="/login">
                                        <span>Login</span>
                                    </a>
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
