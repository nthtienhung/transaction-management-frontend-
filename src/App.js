import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './App/services/IAM/Login';
import Register from './App/services/IAM/Register';
import HomeAdmin from './App/services/Business/HomePage/HomeAdmin';
import Profile from './App/services/Business/User/Profile';
import EditProfile from './App/services/Business/User/EditProfile';
import ForgotPassword from './App/services/IAM/ForgotPassword';
import VerifyOtp from './App/services/IAM/VerifyOtp';
import ConfigService from './App/services/CONFIGFE/ConfigService';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/config" element={<ConfigService />} />
      </Routes>
  );
}

export default App;