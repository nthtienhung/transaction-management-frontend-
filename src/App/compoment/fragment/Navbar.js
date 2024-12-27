import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
function Navbar({ setActiveContent}) {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false); // Quản lý trạng thái mở menu Dashboard
  const [isConfigurationOpen, setIsConfigurationOpen] = useState(false); // Trạng thái mở cho Configuration
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false); // Trạng thái mở cho Configuration
  const menuRef = useRef(null);
  const [role, setRoles] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    const menuToggles = menuRef.current.querySelectorAll(".menu-toggle");

    // Định nghĩa callback function để có thể xóa event sau này
    const handleToggleClick = (event) => {
      const subMenu = event.currentTarget.nextElementSibling;
      if (subMenu && subMenu.classList.contains("menu-sub")) {
        subMenu.classList.toggle("show");
      }
    };

    // Đăng ký sự kiện click
    menuToggles.forEach((toggle) => {
      toggle.addEventListener("click", handleToggleClick);
    });

    // Dọn dẹp sự kiện khi component bị hủy
    return () => {
      menuToggles.forEach((toggle) => {
        toggle.removeEventListener("click", handleToggleClick); // Sử dụng cùng callback khi gọi removeEventListener
      });
    };
  }, []);
  useEffect(() => {
    if (!Cookies.get("its-cms-accessToken")) {
      navigate("/");
    }
    if (Cookies.get("its-cms-accessToken")) {
      const decodeToken = jwtDecode(Cookies.get("its-cms-accessToken"));
      const roleUser = decodeToken.role;
      setRoles(roleUser);
    }
  }, []);
  // Hàm để thay đổi trạng thái của menu Dashboard
  const handleDashboardToggle = () => {
    setIsDashboardOpen((prev) => !prev);
  };

  const handleConfigurationToggle = () => {
    if (!isConfigurationOpen) {
      setIsUserManagementOpen(false); // Disable User Management if Configuration is toggled
    }
    setIsConfigurationOpen((prevState) => !prevState);
  };

  const handleUserManagementToggle = () => {
    if (!isUserManagementOpen) {
      setIsConfigurationOpen(false); // Disable Configuration if User Management is toggled
    }
    setIsUserManagementOpen((prev) => !prev);
  };
 // open menu
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const toggleMenu = () => {
  setIsMenuOpen(!isMenuOpen);
};
  return (
    <>
      <aside
        id="layout-menu"
        className="layout-menu menu-vertical menu bg-menu-theme"
        ref={menuRef}
      >
        <div className="app-brand demo">
          <a href="index.html" className="app-brand-link">
            <span className="app-brand-text demo menu-text fw-bold ms-2">
              <img
                style={{width:"4%"}}
                src= "../assets/img/avatars/Logo.png"
                // src="../"
              ></img>
            </span>
          </a>
          <a
            href="javascript:void(0);"
            className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none"
          >
            <i className="bx bx-chevron-left bx-sm d-flex align-items-center justify-content-center"></i>
          </a>
        </div>
        <div className="menu-inner-shadow"></div>
        <ul className="menu-inner py-1">
          {/* Dashboard Menu */}
          <li className={`menu-item ${isDashboardOpen ? "active open" : ""}`}>
            <a
              href="javascript:void(0);"
              className="menu-link menu-toggle"
              onClick={handleDashboardToggle}
            >
              <i className="menu-icon tf-icons bx bx-home-smile"></i>
              <div className="text-truncate" data-i18n="Dashboards">
                {role === "ROLE_ADMIN" && <>
                <a href="/homeAdmin"> Dashboards</a>
                </> || <><a href="/homeUser"> Dashboards</a></>}
               
              </div>
            </a>
            {isDashboardOpen && (
              <ul className="menu-sub">
                {(role === "ROLE_USER" && (
                  <>
                    <li class="menu-item active">
                      <a href="/transactionUser" class="menu-link">
                    <div class="text-truncate" data-i18n="Analytics">Transaction</div>
                  </a>
                </li>
                  </>
                )) || (
                  <>
                      <li class="menu-item active">
                      <a href="/transactionAdmin" class="menu-link">
                    <div class="text-truncate" data-i18n="Analytics">Transaction Manage</div>
                  </a>
                </li>
                  </>
                )}
              </ul>
            )}
          </li>

          {/* Configuration Menu */}
          {(role === "ROLE_ADMIN" && (
            <>
              <li
                className={`menu-item ${
                  isConfigurationOpen ? "active open" : ""
                }`}
              >
                {role === "ROLE_ADMIN" && <>
                  <a
                      href="javascript:void(0);"
                      className="menu-link"
                      onClick={() => {
                        setActiveContent("configuration"); // Cập nhật nội dung hiển thị
                        handleConfigurationToggle(); // Đổi trạng thái mở menu
                      }}
                  >
                    <i className="menu-icon tf-icons bx bx-cog"></i>
                    <div className="text-truncate" data-i18n="Configuration">
                      Configuration
                    </div>
                  </a>
                </> || <></>}
              </li>
              <li
                  className={`menu-item ${
                      isUserManagementOpen ? "active open" : ""
                  }`}
              >
                <a 
                  href="#" 
                  className="menu-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveContent("users");
                    handleUserManagementToggle();
                  }}
                >
                  <i className="menu-icon tf-icons bx bx-user"></i>
                  <div className="text-truncate" data-i18n="Users">User Management</div>
                </a>
              </li>
            </>
          )) || <></>}

          {/* Other Menus */}
        </ul>
      </aside>
    </>
  );
}

export default Navbar;
