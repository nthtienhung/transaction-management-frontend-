import React, { useState } from 'react';
import Footer from "../../../compoment/fragment/Footer";
import Header from "../../../compoment/fragment/Header";
import Navbar from "../../../compoment/fragment/Navbar";
import ConfigService from "./../../../services/CONFIGFE/ConfigService";
import UserManagement from '../../../pages/Admin/UserManagement';
import AdminDashboard from './../Transaction/AdminDashboard'; // Import AdminDashboard

function HomeAdmin() {
  const [activeContent, setActiveContent] = useState("dashboard"); // State để xác định nội dung hiển thị

  const renderContent = () => {
    switch (activeContent) {
      case "configuration":
        return <ConfigService />;
      case "users":
        return <UserManagement />;
      case "dashboard":
        return <AdminDashboard />; // Hiển thị AdminDashboard khi activeContent là "dashboard"
      default:
        return <div>Welcome to the Admin Dashboard!</div>;
    }
  };

  return (
      <>
        <div className="layout-wrapper layout-content-navbar">
          <div className="layout-container">
            {/* Navbar */}
            <Navbar setActiveContent={setActiveContent} />
          </div>
          <div className="layout-page">
            {/* Header */}
            <Header />
            <div className="content-wrapper">
              {/* Dynamic Content */}
              {renderContent()}
            </div>
            {/* Footer */}
            <Footer />
          </div>
        </div>
      </>
  );
}

export default HomeAdmin;
