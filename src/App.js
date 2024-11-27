import logo from './logo.svg';
import React from "react";
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './App/services/IAM/Login';
import Register from './App/services/IAM/Register';
import ChangePassword from "./App/services/IAM/ChangePassword";
import HomeAdmin from './App/services/Business/HomePage/HomeAdmin';

function App() {
  return(
<>
 <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>} />
      <Route path='/homeAdmin' element={<HomeAdmin/>}/>
      <Route path='/change-password' element={<ChangePassword/>}/>
</Routes>
</>
  )



}

export default App;
