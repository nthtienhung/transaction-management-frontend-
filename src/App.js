import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './App/services/IAM/Login';
import Register from './App/services/IAM/Register';
import HomeAdmin from './App/services/Business/HomePage/HomeAdmin';
import Profile from './App/services/Business/User/Profile';
import ForgotPassword from './App/services/IAM/ForgotPassword';
import VerifyOtp from './App/services/IAM/VerifyOtp';
import ConfigService from './App/services/CONFIGFE/ConfigService';
import HomeUser from "./App/services/Business/HomePage/HomeUser";
import TransactionListAdmin from './App/services/Business/Transaction/TransactionListAdmin';
import TransactionListUser from './App/services/Business/Transaction/TransactionListUser';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homeUser" element={<HomeUser/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/verify" element={<VerifyOtp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/config" element={<ConfigService />} />
        <Route path='/transactionAdmin'element={<TransactionListAdmin/>}/>
        <Route path='/transactionUser' element={<TransactionListUser/>}/>
      </Routes>
  );
}

export default App;