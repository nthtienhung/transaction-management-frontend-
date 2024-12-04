
import React from "react";
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './App/services/IAM/Login';
import Register from './App/services/IAM/Register';
import ChangePassword from "./App/services/IAM/ChangePassword";
import HomeAdmin from './App/services/Business/HomePage/HomeAdmin';
import HomeUser from './App/services/Business/HomePage/HomeUser';
import Profile from "./App/services/User/Profile";
import EditProfile from "./App/services/User/EditProfile";
import VerifyOtp from "./App/services/IAM/VerifyOtp";

function App() {
  return(
<>
 <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>} />
      <Route path='/homeAdmin' element={<HomeAdmin/>}/>
      <Route path="/homeUser" element={<HomeUser/>}/>
      <Route path='/change-password' element={<ChangePassword/>}/>
      <Route path='/verify' element={<VerifyOtp/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/edit-profile' element={<EditProfile/>}/>
</Routes>
</>
  )



}

export default App;
