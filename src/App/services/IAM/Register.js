
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, generateOtp } from "../Api/authService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// component Register
const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dateOfBirth: "",
        address: "",
        phone: "",
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const regexPatterns = {
        firstName: /^[\p{L}\s]+( [\p{L}\s]+)*$/u,
        lastName: /^[\p{L}\s]+( [\p{L}\s]+)*$/u,
        email: /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@(gmail|GMAIL)\.(com|COM)$/,
        password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*_+])[A-Za-z\d!@#$%^&*_+]{8,20}$/,
        phone: /^((\s){0,}(0))((9|8|7|3|5|4|2)[0-9]{8,9}(\s){0,})$/,
    };

    const validateInput = (name, value) => {
        let error = "";
        if (!value.trim()) {
            error = `${name} is required.`;
        } else if (regexPatterns[name] && !regexPatterns[name].test(value)) {
            error = `${name} is invalid.`;
        }
        return error;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});

        if (name === "email") {
            localStorage.setItem("email", value);
        }

        // Validate input
        const error = validateInput(name, value);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields before submitting
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateInput(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            await register(formData);
            await generateOtp(formData.email);
            toast.success("Registration successful. OTP has been sent to your email.", {
                position: "top-right",
                autoClose: 5000,
            });
            setTimeout(() => navigate("/verify", {state: {email: formData.email}}), 1500);
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage === "User is registered but not verified") {
                toast.warning("This email is already registered but not verified. Redirecting to OTP verification", {
                    position: "top-right",
                    autoClose: 5000,
                });
                await generateOtp(formData.email);
                setTimeout(() =>navigate("/verify", {state: {email: formData.email}}), 2500);
            } else {
                toast.error(errorMessage || "An error occurred during registration.", {
                    position: "top-right",
                    autoClose: 5000,
                });
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4" style={{width: "400px"}}>
                <h2 className="text-center">Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                            placeholder="Enter your first name"
                            onChange={handleChange}
                            required
                        />
                        {errors.firstName && (
                            <div className="invalid-feedback">{errors.firstName}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                            placeholder="Enter your last name"
                            onChange={handleChange}
                            required
                        />
                        {errors.lastName && (
                            <div className="invalid-feedback">{errors.lastName}</div>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                            placeholder="Enter your email"
                            onChange={handleChange}
                            required
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email}</div>
                        )}
                    </div>
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <div className="mb-3 position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                            placeholder="Enter your password"
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary position-absolute end-0 top-0"
                            style={{height: "100%", width: "50px"}}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="dateOfBirth" className="form-label">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            className="form-control"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            className="form-control"
                            placeholder="Enter your address"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                            placeholder="Enter your phone number"
                            onChange={handleChange}
                            required
                        />
                        {errors.phone && (
                            <div className="invalid-feedback">{errors.phone}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 mb-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Registering..." : "Register"}
                    </button>
                </form>
                <button className="btn btn-link w-100" onClick={() => navigate("/")}>
                    Back to Login
                </button>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default Register;
