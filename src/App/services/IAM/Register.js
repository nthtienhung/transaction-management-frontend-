import { useFormik } from "formik";
import { useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import * as Yup from "yup";
function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const validationSchema = Yup.object({
    fisrtname: Yup.string()
      .required("Tên không được để trống")
      .matches(
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂƠƯăơưÁÀÂẤẦẨẪẬÉÈÊẾỀỂỄỆÍÌÎĨĪÌÔỐỒỔỖỘƠỜỞỠỢÚÙÛÜÝỲỶỸỴỹýỳỵ\s]+$/,
        "Tên không được chứa số hoặc ký tự đặc biệt"
      ),
    lastname: Yup.string()
      .required("Tên không được để trống")
      .matches(
        /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂƠƯăơưÁÀÂẤẦẨẪẬÉÈÊẾỀỂỄỆÍÌÎĨĪÌÔỐỒỔỖỘƠỜỞỠỢÚÙÛÜÝỲỶỸỴỹýỳỵ\s]+$/,
        "Tên không được chứa số hoặc ký tự đặc biệt"
      ),
    email: Yup.string()
      .required("Email không được để trống")
      .email("Email không hợp lệ")
      .matches(/^\S+@\S+\.\S+$/, "Email không được chứa khoảng trắng"),
    dateOfBirth: Yup.date()
      .max(new Date(), "Ngày tháng năm sinh không được lớn hơn hiện tại") // Kiểm tra không lớn hơn hiện tại
      .required("Ngày tháng năm sinh không được để trống"),
    numberPhone: Yup.string()
      .required("Số điện thoại không được để trống")
      .matches(
        /^[0-9]+$/,
        "Số điện thoại chỉ được chứa chữ số và không có khoảng trắng"
      )
      .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
      .max(11, "Số điện thoại không được vượt quá 11 chữ số"),
    address: Yup.string().required("Địa chỉ không được để trống"),
    password: Yup.string().required("Password không được để trống"),
  });
  const userRegisterForm = useFormik({
    initialValues: {
      fisrtname: "",
      lastname: "",
      email: "",
      dateOfBirth: "",
      numberPhone: "",
      address: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (value) => {
      console.log(value);
    },
  });
  return (
    <>
      <div class="container-xxl">
        <div class="authentication-wrapper authentication-basic container-p-y">
          <div class="authentication-inner">
            <div class="card px-sm-6 px-0">
              <div class="card-body">
                <form
                  id="formAuthentication"
                  class="mb-6"
                  action={userRegisterForm.handleSubmit}
                >
                  <div class="mb-6 formInputValue">
                    <label for="fisrtname" class="form-label">
                      Fisrt name *
                    </label>
                    <input
                      onBlur={userRegisterForm.handleBlur}
                      onChange={userRegisterForm.handleChange}
                      type="text"
                      class="form-control formRegisterInput"
                      id="fisrtname"
                      name="fisrtname"
                      autofocus
                    />
                  </div>
                  {userRegisterForm.touched.fisrtname &&
                  userRegisterForm.errors.fisrtname ? (
                    <div
                      style={{
                        color: "red",
                        paddingLeft: "50px",
                        marginTop: "-15px",
                        fontSize: "10px",
                      }}
                    >
                      {userRegisterForm.errors.fisrtname}
                    </div>
                  ) : null}
                  <div class="mb-6 formInputValue">
                    <label for="lastName" class="form-label">
                      Last name *
                    </label>
                    <input
                      onChange={userRegisterForm.handleChange}
                      onBlur={userRegisterForm.handleBlur}
                      type="text"
                      class="form-control formRegisterInput"
                      id="lastName"
                      name="lastName"
                    />
                  </div>
                  {userRegisterForm.touched.lastname &&
                  userRegisterForm.errors.lastname ? (
                    <div
                      style={{
                        color: "red",
                        paddingLeft: "50px",
                        marginTop: "-15px",
                        fontSize: "10px",
                      }}
                    >
                      {userRegisterForm.errors.lastname}
                    </div>
                  ) : null}
                  <div class="mb-6 formInputValue">
                    <label for="email" class="form-label">
                      Email *
                    </label>
                    <input
                      onChange={userRegisterForm.handleChange}
                      onBlur={userRegisterForm.handleBlur}
                      type="text"
                      class="form-control formEmailRegisterInput"
                      id="email"
                      name="email"
                    />
                  </div>
                  {userRegisterForm.touched.email &&
                  userRegisterForm.errors.email ? (
                    <div
                      style={{
                        color: "red",
                        paddingLeft: "50px",
                        marginTop: "-15px",
                        fontSize: "10px",
                      }}
                    >
                      {userRegisterForm.errors.email}
                    </div>
                  ) : null}
                  <div class="mb-6 formInputValue">
                    <label for="dateOfBirth" class="form-label">
                      DOB *
                    </label>
                    <input
                      onChange={userRegisterForm.handleChange}
                      onBlur={userRegisterForm.handleBlur}
                      type="date"
                      class="form-control formDOBRegisterInput"
                      id="dateOfBirth"
                      name="dateOfBirth"
                    />
                  </div>
                  {userRegisterForm.touched.dateOfBirth &&
                  userRegisterForm.errors.dateOfBirth ? (
                    <div
                      style={{
                        color: "red",
                        paddingLeft: "50px",
                        marginTop: "-15px",
                        fontSize: "10px",
                      }}
                    >
                      {userRegisterForm.errors.dateOfBirth}
                    </div>
                  ) : null}
                  <div class="mb-6 formInputValue">
                    <label for="numberPhone" class="form-label">
                      Phone *
                    </label>
                    <input
                      onChange={userRegisterForm.handleChange}
                      onBlur={userRegisterForm.handleBlur}
                      type="text"
                      class="form-control formPhoneRegisterInput"
                      id="numberPhone"
                      name="numberPhone"
                    />
                  </div>
                  {userRegisterForm.touched.dateOfBirth &&
                  userRegisterForm.errors.dateOfBirth ? (
                    <div
                      style={{
                        color: "red",
                        paddingLeft: "50px",
                        marginTop: "-15px",
                        fontSize: "10px",
                      }}
                    >
                      {userRegisterForm.errors.dateOfBirth}
                    </div>
                  ) : null}
                  <div class="mb-6 formInputValue">
                    <label for="address" class="form-label">
                      Address *
                    </label>
                    <input
                      onChange={userRegisterForm.handleChange}
                      onBlur={userRegisterForm.handleBlur}
                      type="text"
                      class="form-control formAddressRegisterInput"
                      id="numberPhone"
                      name="numberPhone"
                    />
                  </div>
                  <div class="mb-6 form-password-toggle formInputValue">
                    <label class="form-label" for="password">
                      Password *
                    </label>
                    <div class="input-group input-group-merge">
                      <input
                        onChange={userRegisterForm.handleChange}
                        onBlur={userRegisterForm.handleBlur}
                        type={showPassword ? "text" : "password"}
                        id="password"
                        class="form-control formPasswordRegisterInput"
                        name="password"
                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                        aria-describedby="password"
                      />
                      <span
                        className="input-group-text cursor-pointer"
                        onClick={togglePasswordVisibility} // Gắn sự kiện nhấp
                      >
                        {showPassword ? <BiShow /> : <BiHide />}{" "}
                      </span>
                    </div>
                  </div>
                  <button class="btn btn-primary d-grid w-100">Sign up</button>
                </form>

                <p class="text-center">
                  <span>Already have an account?</span>
                  <a href="/">
                    <span>Sign in</span>
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
export default Register;
