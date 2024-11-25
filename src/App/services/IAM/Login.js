import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiPlugFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { GrKey } from "react-icons/gr";
import { BiHide, BiShow } from "react-icons/bi";
import * as Yup from "yup";
function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const validationSchema = Yup.object({
    usernameOrEmail: Yup.string().required(
      "Username hoặc Email không được để trống"
    ), // Validate không null
    password: Yup.string().required("Password không được để trống"), // Validate không null
  });
  const userFormData = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: "",
      role: "",
    },
    validationSchema,
    onSubmit: async (value) => {
      axios.post("");
    },
  });
  return (
    <>
      <div class="container-xxl backgroundLayout">
        <div class="authentication-wrapper authentication-basic container-p-y">
          <div class="authentication-inner">
            <div class="card px-sm-6 px-0">
              <div class="card-body">
                <h4 class="mb-1">Welcome to MB Bank! 👋</h4>
                <p class="mb-6">
                  Please sign-in to your account and start the using our service
                </p>

                <form
                  id="formAuthentication"
                  class="mb-6"
                  onSubmit={userFormData.handleSubmit}
                >
                  <div class="mb-6 form-password-toggle formInputValue">
                    <label class="form-label" for="password">
                      <PiPlugFill className="icon" />
                    </label>
                    <div class="input-group input-group-merge formInput">
                      <select
                        onChange={userFormData.handleChange}
                        id="role"
                        name="role"
                        className="form-control"
                      >
                        <option value={"ADMIN"}>ADMIN</option>
                        <option value={"USER"}>USER</option>
                      </select>
                    </div>
                  </div>
                  <div class="mb-6 formInputValue">
                    <label for="email" class="form-label ">
                      <FaUser className="iconUser" />
                    </label>
                    <input
                      type="text"
                      class="form-control formInput"
                      id="usernameOrEmail"
                      name="usernameOrEmail"
                      onChange={userFormData.handleChange}
                      placeholder="Enter your email or username"
                      onBlur={userFormData.handleBlur}
                      autofocus
                    />
                  </div>
                  {userFormData.touched.usernameOrEmail &&
                  userFormData.errors.usernameOrEmail ? (
                    <div
                      style={{
                        color: "red",
                        paddingLeft: "50px",
                        marginTop: "-15px",
                        fontSize: "10px",
                      }}
                    >
                      {userFormData.errors.usernameOrEmail}
                    </div>
                  ) : null}
                  <div class="mb-6 form-password-toggle formInputValue">
                    <label class="form-label" for="password">
                      <GrKey className="icon" />
                    </label>
                    <div class="input-group input-group-merge formInput">
                      <input
                        type={showPassword ? "text" : "password"} // Thay đổi loại input
                        id="password"
                        className="form-control"
                        onChange={userFormData.handleChange}
                        name="password"
                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                        aria-describedby="password"
                        onBlur={userFormData.handleBlur}
                        autoFocus
                      />
                      <span
                        className="input-group-text cursor-pointer"
                        onClick={togglePasswordVisibility} // Gắn sự kiện nhấp
                      >
                        {showPassword ? <BiShow /> : <BiHide />}{" "}
                      </span>
                    </div>
                  </div>
                  {userFormData.touched.password &&
                  userFormData.errors.password ? (
                    <div
                      style={{
                        color: "red",
                        paddingLeft: "50px",
                        marginTop: "-15px",
                        fontSize: "10px",
                      }}
                    >
                      {userFormData.errors.password}
                    </div>
                  ) : null}
                  <div class="mb-9">
                    <div class="d-flex justify-content-between mt-8">
                      <a href="auth-forgot-password-basic.html" class="ms-auto">
                        <span>Forgot Password?</span>
                      </a>
                    </div>
                  </div>
                  <div class="mb-6">
                    <button class="btn btn-primary d-grid w-100" type="submit">
                      Login
                    </button>
                  </div>
                </form>

                <p class="text-center">
                  <span>Don't have an account yet?</span>
                  <a href="/register">
                    <span>Sign up</span>
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

export default Login;
