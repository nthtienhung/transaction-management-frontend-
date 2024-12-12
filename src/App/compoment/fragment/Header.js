import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
function Header() {
  const [users, setUsers] = useState({ firstName: "", lastName: "" });
  const [role, setRoles] = useState();
  const navigate = useNavigate();
  const token = Cookies.get("its-cms-accessToken");
  useEffect(() =>{
    if(!token){
      toast.warning("Hết phiên đăng nhập, vui lòng đăng nhập lại !", {
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
  },[token])
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
          if(sessionStorage.getItem("userId") == null){
            sessionStorage.setItem("userId",res.data.data.userId);
          }
          setUsers(res.data.data);
        }).catch((error) => {
          if (error.response.status === 401 || error.response.status === 400) {
            // Xử lý lỗi 400 riêng
            axios
            .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
              headers: {
                Authorization: `Bearer ${Cookies.get("its-cms-refreshToken")}`,
              },
            })
            .then((res) => {
              // Cập nhật token mới
              Cookies.remove("its-cms-accessToken");
              Cookies.remove("its-cms-refreshToken");
              Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
              Cookies.set("its-cms-refreshToken", res.data.data.refreshToken);
        
              // Gọi lại API profile với token mới
              axios
                .get("http://localhost:8888/api/v1/user/profile", {
                  headers: {
                    Authorization: `${Cookies.get("its-cms-accessToken")}`,
                  },
                })
                .then((res) => {
                  localStorage.setItem("userId", res.data.data.userId);
                  setUsers(res.data.data);
                })
            })
          } else {
            // Nếu lỗi khác, log ra để dễ debug
            console.error(error);
          }
        
          // Thực hiện refresh token
          
          
        });
    } else {
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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };
  const logout = () => {
    axios
      .get("http://localhost:8888/api/v1/auth/logoutAccount", {
        headers: {
          Authorization: `${Cookies.get("its-cms-accessToken")}`,
        },
      })
      .then(() => {
        setTimeout(() => {
          toast.success("Hẹn gặp lại ❤️❤️❤️!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }, 500);
        setTimeout(() => {
          localStorage.clear();
          Cookies.remove("user-role");
          Cookies.remove("its-cms-accessToken");
          Cookies.remove("its-cms-refreshToken");
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        console.log(Cookies.get("its-cms-refreshToken"));
          axios.get("localhost:8888/api/v1/auth/refreshToken",{
            headers: {
              Authorization: `Bearer ${Cookies.get("its-cms-refreshToken")}`,
            },
          }).then(res =>{
            Cookies.remove("its-cms-accessToken");
            Cookies.remove("its-cms-refreshToken");
            Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
            Cookies.set("its-cms-refreshToken",res.data.data.refreshToken);
          })
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

          <ul class="navbar-nav flex-row align-items-center ms-auto ">
            <li
              class="nav-item dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <a
                class="nav-link dropdown-toggle p-0"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div class="avatar avatar-online ">
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
