import { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
function Navbar() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false); // Quản lý trạng thái mở menu Dashboard
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
    useEffect(() =>{
      if(Cookies.get("its-cms-accessToken")){
        const decodeToken = jwtDecode(Cookies.get("its-cms-accessToken"));
        const roleUser = decodeToken.role;
        setRoles(roleUser);
      }
    },[])
  // Hàm để thay đổi trạng thái của menu Dashboard
  const handleDashboardToggle = () => {
    setIsDashboardOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    // Kiểm tra nếu click xảy ra bên ngoài `menuRef`
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsDashboardOpen(false); // Đóng menu
    }
  };

  useEffect(() => {
    // Lắng nghe sự kiện click trên document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Hủy bỏ lắng nghe sự kiện khi component bị unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
                style={{ width: "20%" }}
                src="https://rubicmarketing.com/wp-content/uploads/2022/11/y-nghia-logo-mb-bank-2.jpg"
              />
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
        <ul ref={menuRef} className="menu-inner py-1">
      <li className={`menu-item ${isDashboardOpen ? "active open" : ""}`}>
        <a
          href="javascript:void(0);"
          className="menu-link menu-toggle"
          onClick={handleDashboardToggle}
        >
          <i className="menu-icon tf-icons bx bx-home-smile"></i>
          <div className="text-truncate" data-i18n="Dashboards">
            Menu
          </div>
        </a>
        {isDashboardOpen && (
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="" className="menu-link">
                <div className="text-truncate" data-i18n="Analytics">
                  Transaction
                </div>
              </a>
            </li>
          </ul>
        )}
      </li>
    </ul>
      </aside>
    </>
  );
}
export default Navbar;
