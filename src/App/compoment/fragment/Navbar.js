import { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar({ setActiveContent }) {
    const [isDashboardOpen, setIsDashboardOpen] = useState(false); // Quản lý trạng thái mở menu Dashboard
    const [isConfigurationOpen, setIsConfigurationOpen] = useState(false); // Trạng thái mở cho Configuration
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
        if(!Cookies.get("its-cms-accessToken")) {
            navigate("/");
        }
        if (Cookies.get("its-cms-accessToken")) {
            const decodeToken = jwtDecode(Cookies.get("its-cms-accessToken"));
            const roleUser = decodeToken.role;
            setRoles(roleUser);
        }
    }, [])
    // Hàm để thay đổi trạng thái của menu Dashboard
    const handleDashboardToggle = () => {
        setIsDashboardOpen((prev) => !prev);
    };

    const handleConfigurationToggle = () => {
        setIsConfigurationOpen(prevState => !prevState);
    };

    return (
        <>
            <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme" ref={menuRef}>
                <div className="app-brand demo">
                    <a href="index.html" className="app-brand-link">
                        <span className="app-brand-text demo menu-text fw-bold ms-2">sneat</span>
                    </a>
                    <a href="javascript:void(0);"
                       className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                        <i className="bx bx-chevron-left bx-sm d-flex align-items-center justify-content-center"></i>
                    </a>
                </div>
                <div className="menu-inner-shadow"></div>
                <ul className="menu-inner py-1">
                    {/* Dashboard Menu */}
                    <li className={`menu-item ${isDashboardOpen ? 'active open' : ''}`}>
                        <a href="javascript:void(0);" className="menu-link menu-toggle" onClick={handleDashboardToggle}>
                            <i className="menu-icon tf-icons bx bx-home-smile"></i>
                            <div className="text-truncate" data-i18n="Dashboards">Dashboards</div>
                            <span className="badge rounded-pill bg-danger ms-auto">5</span>
                        </a>
                        {isDashboardOpen && (
                            <ul className="menu-sub">
                                <li className="menu-item">
                                    <a href="index.html" className="menu-link">
                                        <div className="text-truncate" data-i18n="Analytics">Analytics</div>
                                    </a>
                                </li>
                                <li className="menu-item">
                                    <a href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/dashboards-crm.html"
                                       target="_blank" className="menu-link">
                                        <div className="text-truncate" data-i18n="CRM">CRM</div>
                                        <div
                                            className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        )}
                    </li>

                    {/* Configuration Menu */}
                    <li className={`menu-item ${isConfigurationOpen ? 'active open' : ''}`}>
                        <a
                            href="javascript:void(0);"
                            className="menu-link menu-toggle"
                            onClick={() => {
                                setActiveContent("configuration"); // Cập nhật nội dung hiển thị
                                handleConfigurationToggle(); // Đổi trạng thái mở menu
                            }}
                        >
                            <i className="menu-icon tf-icons bx bx-cog"></i>
                            <div className="text-truncate" data-i18n="Configuration">Configuration</div>
                        </a>
                    </li>

                    {/* Other Menus */}
                    
                </ul>

            </aside>
        </>
    )
}
export default Navbar;

