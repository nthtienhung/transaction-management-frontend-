import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = Cookies.get('its-cms-accessToken'); // Kiểm tra token từ cookie

    if (!token) {
        // Nếu không có token (chưa đăng nhập), chuyển hướng đến trang login và lưu trang trước đó
        return <Navigate to="/" state={{ from: location }} />;
    }

    // Nếu có token (đã đăng nhập), hiển thị các trang bảo vệ
    return children;
};

export default ProtectedRoute;