import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";
function Header() {
  const [users, setUsers] = useState({ firstName: "", lastName: "" });
  const [role, setRoles] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (Cookies.get("its-cms-accessToken")) {
      const decodeToken = jwtDecode(Cookies.get("its-cms-accessToken"));
      const roleUser = decodeToken.role;
      setRoles(roleUser);
      axios
      .get("http://localhost:8888/api/v1/user/profile", {
        headers: {
          Authorization: `${Cookies.get("its-cms-accessToken")}`,
        },
      })
      .then((res) => {
        setUsers(res.data.data);
      })
    }else{
      toast.error("Tài khoản truy cập trái phép, xin vui lòng đăng nhập !", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/");
    }
  }, []);
 
  
  const logout = () => {
    console.log(Cookies.get("its-cms-accessToken"))
    if(!Cookies.get("its-cms-accessToken")){
      navigate("/");
    }
    axios.get("http://localhost:8888/api/v1/auth/logoutAccount", {
      headers: {
        Authorization: `${Cookies.get("its-cms-accessToken")}`,
      },
    })
  .then(() => {
    setTimeout(()=>{
      toast.success("Hẹn gặp lại ❤️❤️❤️!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    },500)
    setTimeout(() =>{
      Cookies.remove("its-cms-accessToken");
      navigate("/");
    },1000)
  })
  .catch((error) => {
    console.error("Logout thất bại:", error);
  });
  };
  return (
    <>
      <nav
        class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
        id="layout-navbar"
      >
        <div class="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
          <a class="nav-item nav-link px-0 me-xl-6" href="javascript:void(0)">
            <i class="bx bx-menu bx-md"></i>
          </a>
        </div>

        <div
          class="navbar-nav-right d-flex align-items-center"
          id="navbar-collapse"
        >
          <div class="navbar-nav align-items-center">
            <div class="nav-item d-flex align-items-center">
              <i class="bx bx-search bx-md"></i>
              <input
                type="text"
                class="form-control border-0 shadow-none ps-1 ps-sm-2"
                placeholder="Search..."
                aria-label="Search..."
              />
            </div>
          </div>

          <ul class="navbar-nav flex-row align-items-center ms-auto">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle p-0"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div class="avatar avatar-online">
                  <img
                    src="../assets/img/avatars/1.png"
                    alt="Avatar"
                    class="w-px-40 h-auto rounded-circle"
                  />
                </div>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <a class="dropdown-item" href="#">
                    <div class="d-flex">
                      <div class="flex-shrink-0 me-3">
                        <div class="avatar avatar-online">
                          <img
                            src="../assets/img/avatars/1.png"
                            alt="Avatar"
                            class="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      </div>
                      <div class="flex-grow-1">
                        {users ? (
                          <h6 className="mb-0">
                            {users.firstName || "Chưa có dữ liệu"}
                          </h6>
                        ) : (
                          <p>Đang tải dữ liệu...</p>
                        )}
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <p class="dropdown-item">
                    <i>Quyền hạn: {role}</i> 
                  </p>
                </li>
                <li>
                  <a class="dropdown-item" href="/profile">
                    <i class="bx bx-user bx-sm me-2"></i> My Profile
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="bx bx-cog bx-sm me-2"></i> Settings
                  </a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">
                    <i class="bx bx-credit-card bx-sm me-2"></i> Wallet
                    {/* <span class="badge bg-danger rounded-pill ms-2">4</span> */}
                  </a>
                </li>
                <li>
                  <hr class="dropdown-divider" />
                </li>
                <li>
                  <a class="dropdown-item">
                    <button onClick={() => logout()}>
                      <i class="bx bx-power-off bx-sm me-2"></i> Log Out
                    </button>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
export default Header;
