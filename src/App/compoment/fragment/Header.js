import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

function Header({ setActiveContent }) {
  const [users, setUsers] = useState({ firstName: "", lastName: "" });
  const [role, setRoles] = useState();
  const [isDashboardOpen, setIsDashboardOpen] = useState(false); // Quản lý trạng thái mở menu Dashboard
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false); // Trạng thái mở cho Configuration
  const navigate = useNavigate();
  const token = Cookies.get("its-cms-accessToken");
  const handleDashboardToggle = () => {
    setIsDashboardOpen((prev) => !prev);
  };

  const handleConfigurationToggle = () => {
    setIsConfigurationOpen((prevState) => !prevState);
  };
  useEffect(() => {
    if (!token) {
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
  }, [token]);
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
          if (sessionStorage.getItem("userId") == null) {
            sessionStorage.setItem("userId", res.data.data.userId);
          }
          setUsers(res.data.data);
        })
        .catch((error) => {
          if (error.response.status === 401 || error.response.status === 400) {
            // Xử lý lỗi 400 riêng
            axios
              .get("http://localhost:8888/api/v1/auth/refreshTokenUser", {
                headers: {
                  Authorization: `Bearer ${sessionStorage.getItem(
                    "its-cms-refreshToken"
                  )}`,
                },
              })
              .then((res) => {
                // Cập nhật token mới
                Cookies.remove("its-cms-accessToken");
                sessionStorage.removeItem("its-cms-refreshToken");
                Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
                sessionStorage.setItem(
                  "its-cms-refreshToken",
                  res.data.data.refreshToken
                );

                // Gọi lại API profile với token mới
                axios
                  .get("http://localhost:8888/api/v1/user/profile", {
                    headers: {
                      Authorization: `${Cookies.get("its-cms-accessToken")}`,
                    },
                  })
                  .then((res) => {
                    sessionStorage.setItem("userId", res.data.data.userId);
                    setUsers(res.data.data);
                  });
              });
          } else {
            console.error(error);
          }
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
          sessionStorage.clear();
          Cookies.remove("its-cms-accessToken");
          navigate("/");
        }, 1000);
      })
      .catch((error) => {
        console.log(sessionStorage.getItem("its-cms-refreshToken"));
        axios
          .get("http://localhost:8888/api/v1/auth/refreshToken", {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem(
                "its-cms-refreshToken"
              )}`,
            },
          })
          .then((res) => {
            Cookies.remove("its-cms-accessToken");
            sessionStorage.removeItem("its-cms-refreshToken");
            Cookies.set("its-cms-accessToken", res.data.data.csrfToken);
            sessionStorage.setItem(
              "its-cms-refreshToken",
              res.data.data.refreshToken
            );
          });
      });
  };
  // open menumenu
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible);
  }; // Đổi trạng thái ẩn/hiện menu
  return (
    <>
      <nav
        class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
        id="layout-navbar"
      >
        <div class="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
          <a
            className="nav-item nav-link px-0 me-xl-6"
            onClick={toggleMenuVisibility} // Khi nhấn, đổi trạng thái
          >
            <i className="bx bx-menu bx-md button-menu"></i>
          </a>

          {/* Menu chỉ hiển thị khi isMenuVisible = true */}
          {isMenuVisible && (
            <ul className="menu-inner py-1">
              {/* Dashboard Menu */}
              <li
                className={`menu-item ${isDashboardOpen ? "active open" : ""}`}
              >
                <a
                  className="menu-link menu-toggle"
                  onClick={handleDashboardToggle}
                >
                  <i className="menu-icon tf-icons bx bx-home-smile"></i>
                  <div className="text-truncate" data-i18n="Dashboards">
                    {(role === "ROLE_ADMIN" && (
                      <a href="/homeAdmin">Dashboards</a>
                    )) || <a href="/homeUser">Dashboards</a>}
                  </div>
                </a>
                {isDashboardOpen && (
                  <ul className="menu-sub">
                    {(role === "ROLE_USER" && (
                      <li className="menu-item active">
                        <a href="/transactionUser" className="menu-link">
                          <div className="text-truncate" data-i18n="Analytics">
                            Transaction
                          </div>
                        </a>
                      </li>
                    )) || (
                      <li className="menu-item active">
                        <a href="/transactionAdmin" className="menu-link">
                          <div className="text-truncate" data-i18n="Analytics">
                            Transaction Manage
                          </div>
                        </a>
                      </li>
                    )}
                  </ul>
                )}
              </li>

              {/* Configuration Menu */}
              {role === "ROLE_ADMIN" && (
                <li
                  className={`menu-item ${
                    isConfigurationOpen ? "active open" : ""
                  }`}
                >
                  <a
                    href="javascript:void(0);"
                    className="menu-link menu-toggle"
                    onClick={() => {
                      setActiveContent("configuration");
                      handleConfigurationToggle();
                    }}
                  >
                    <i className="menu-icon tf-icons bx bx-cog"></i>
                    <div className="text-truncate" data-i18n="Configuration">
                      Configuration
                    </div>
                  </a>
                </li>
              )}
            </ul>
          )}
        </div>

        <div
          class="navbar-nav-right d-flex align-items-center"
          id="navbar-collapse"
        >
          <div class="navbar-nav align-items-center">
            <div class="nav-item d-flex align-items-center">
              {/* <i class="bx bx-search bx-md"></i> */}
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
              <ul class="dropdown-menu bg-menu dropdown-menu-end">
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
