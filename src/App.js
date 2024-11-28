
import React from "react";
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './App/services/IAM/Login';
import Register from './App/services/IAM/Register';
import Home from './App/services/Home';
import ChangePassword from "./App/services/IAM/ChangePassword";
import VerifyOtp from "./App/services/IAM/VerifyOtp";

function App() {
  return(
<>
 <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>} />
      <Route path='/home' element={<Home/>}/>
      <Route path='/change-password' element={<ChangePassword/>}/>
     <Route path='/verify' element={<VerifyOtp/>}/>
</Routes>
</>
  )



}

export default App;
