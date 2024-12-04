import { useEffect, useRef, useState } from "react";
import PerfectScrollbar from "perfect-scrollbar";
function Navbar(){
    const [isDashboardOpen, setIsDashboardOpen] = useState(false); // Quản lý trạng thái mở menu Dashboard
  const menuRef = useRef(null);

  useEffect(() => {
    const menuToggles = menuRef.current.querySelectorAll('.menu-toggle');

    // Định nghĩa callback function để có thể xóa event sau này
    const handleToggleClick = (event) => {
      const subMenu = event.currentTarget.nextElementSibling;
      if (subMenu && subMenu.classList.contains('menu-sub')) {
        subMenu.classList.toggle('show');
      }
    };

    // Đăng ký sự kiện click
    menuToggles.forEach(toggle => {
      toggle.addEventListener('click', handleToggleClick);
    });

    // Dọn dẹp sự kiện khi component bị hủy
    return () => {
      menuToggles.forEach(toggle => {
        toggle.removeEventListener('click', handleToggleClick); // Sử dụng cùng callback khi gọi removeEventListener
      });
    };
  }, []);

  // Hàm để thay đổi trạng thái của menu Dashboard
  const handleDashboardToggle = () => {
    setIsDashboardOpen(prevState => !prevState); // Đổi trạng thái mở hoặc đóng menu Dashboard
  };

  return (
    <>
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme" ref={menuRef}>
      <div className="app-brand demo">
        <a href="index.html" className="app-brand-link">
          <span className="app-brand-text demo menu-text fw-bold ms-2"><img style={{width:"20%"}} src="https://rubicmarketing.com/wp-content/uploads/2022/11/y-nghia-logo-mb-bank-2.jpg"/></span>
        </a>
        <a href="javascript:void(0);" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
          <i className="bx bx-chevron-left bx-sm d-flex align-items-center justify-content-center"></i>
        </a>
      </div>
      <div className="menu-inner-shadow"></div>
      <ul className="menu-inner py-1">
        <li className={`menu-item ${isDashboardOpen ? 'active open' : ''}`}>
          <a href="javascript:void(0);" className="menu-link menu-toggle" onClick={handleDashboardToggle}>
            <i className="menu-icon tf-icons bx bx-home-smile"></i>
            <div className="text-truncate" data-i18n="Dashboards">Dashboards</div>
          </a>
          {isDashboardOpen && (
            <ul className="menu-sub">
              <li className="menu-item">
                <a href="index.html" className="menu-link">
                  <div className="text-truncate" data-i18n="Analytics">Analytics</div>
                </a>
              </li>
              <li className="menu-item">
                <a href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/vertical-menu-template/dashboards-crm.html" target="_blank" className="menu-link">
                  <div className="text-truncate" data-i18n="CRM">CRM</div>
                  <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro</div>
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-store"></i>
            <div className="text-truncate" data-i18n="Front Pages">Front Pages</div>
            <div className="badge rounded-pill bg-label-primary text-uppercase fs-tiny ms-auto">Pro</div>
          </a>
          <ul className="menu-sub">
            <li className="menu-item">
              <a href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/landing-page.html" className="menu-link" target="_blank">
                <div className="text-truncate" data-i18n="Landing">Landing</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/pricing-page.html" className="menu-link" target="_blank">
                <div className="text-truncate" data-i18n="Pricing">Pricing</div>
              </a>
            </li>
            <li className="menu-item">
              <a href="https://demos.themeselection.com/sneat-bootstrap-html-admin-template/html/front-pages/payment-page.html" className="menu-link" target="_blank">
                <div className="text-truncate" data-i18n="Payment">Payment</div>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
        </>
    )
}
export default Navbar;