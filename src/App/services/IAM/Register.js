import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, generateOtp } from "../api/authService";
import Toast from "./Toast";

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
  const [showPassword, setShowPassword] = useState(false); // Trạng thái để hiển thị hoặc ẩn mật khẩu
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      await generateOtp(formData.email);
      setMessage("Registration successful. OTP has been sent to your email.");
      setMessageType("success");
      navigate("/verify", { state: { email: formData.email } });
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
      setMessageType("error");
    }
  };

  return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4" style={{ width: "400px" }}>
          <h2 className="text-center">Register</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="First Name"
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="mb-3">
              <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="Last Name"
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="mb-3">
              <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="mb-3 position-relative">
              <input
                  type={showPassword ? "text" : "password"} // Đổi giữa 'password' và 'text'
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={handleChange}
                  required
              />
              <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary position-absolute end-0 top-0"
                  style={{ height: "100%", width: "50px" }}
                  onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            <div className="mb-3">
              <input
                  type="date"
                  name="dateOfBirth"
                  className="form-control"
                  placeholder="Date of Birth"
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="mb-3">
              <input
                  type="text"
                  name="address"
                  className="form-control"
                  placeholder="Address"
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="mb-3">
              <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="Phone"
                  onChange={handleChange}
                  required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
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

export default Register;
