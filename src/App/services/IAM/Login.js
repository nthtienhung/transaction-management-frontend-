import axios from "axios";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiPlugFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { GrKey } from "react-icons/gr";
import { BiHide, BiShow } from "react-icons/bi";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRoles] = useState();
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const validationSchema = Yup.object({
    email: Yup.string().required("Email không được để trống"), // Validate không null
    password: Yup.string().required("Password không được để trống"), // Validate không null
  });
  const userFormData = useFormik({
    initialValues: {
      role: "ADMIN",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (value) => {
      console.log(value);
      axios
        .post("http://localhost:8888/api/v1/auth/login", value)
        .then((res) => {
          if (res.status == 200) {
            toast.success("Đăng nhập thành công", {
              position: "top-right",
              autoClose: 3000, // Tự động đóng sau 3 giây
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            Cookies.remove("its-cms-accessToken");
            Cookies.set("its-cms-accessToken", res.data.data.csrfToken, {
              expires: 30 / (24 * 60), // 30 phút = 30 phút / (24 * 60 phút trong một ngày)
              path: "/",
            });
            setTimeout(() => {
              console.log(Cookies.get("its-cms-accessToken"));
              axios
                .get("http://localhost:8888/api/v1/user/getRole", {
                  headers: {
                    Authorization: `${Cookies.get("its-cms-accessToken")}`, // Lấy JWT từ cookie
                  },
                })
                .then((response) => {
                  console.log(response.data);

                  // Kiểm tra quyền của người dùng
                  if (response.data.trim() === value.role.trim()) {
                    if (response.data.trim() === "USER") {
                      navigate("/homeUser");
                    } else {
                      navigate("/homeAdmin");
                    }
                  } else {
                    toast.error(
                      "Tài khoản không có quyền truy cập vào trang web này, xin thử lại!",
                      {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                      }
                    );
                  }
                })
                .catch((error) => {
                  console.error("Error fetching user role:", error);

                  // Hiển thị thông báo lỗi
                  toast.error(
                    "Đã xảy ra lỗi khi kiểm tra quyền, xin thử lại!",
                    {
                      position: "top-right",
                      autoClose: 3000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    }
                  );
                });
            }, 3300); // Trì hoãn 3 giây
          } else {
            toast.error("Tài khoản hoặc mật khẩu sai, thử lại.", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Tài khoản hoặc mật khẩu sai, thử lại.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    },
  });
  return (
    <>
      <ToastContainer></ToastContainer>

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
                        value={userFormData.values.role}
                        className="form-control"
                      >
                        <option defaultValue={"ADMIN"} value={"ADMIN"}>
                          ADMIN
                        </option>
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
                      id="email"
                      name="email"
                      onChange={userFormData.handleChange}
                      placeholder="Enter your email or username"
                      onBlur={userFormData.handleBlur}
                      autofocus
                    />
                  </div>
                  {userFormData.touched.email && userFormData.errors.email ? (
                    <div
                      style={{
                        color: "red",
                        paddingLeft: "50px",
                        marginTop: "-15px",
                        fontSize: "10px",
                      }}
                    >
                      {userFormData.errors.email}
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
                      <a href="/forgot-password" class="ms-auto">
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
