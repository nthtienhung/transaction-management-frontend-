import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './App/services/IAM/Login';
import Register from './App/services/IAM/Register';
import Home from './App/services/Home';

function App() {
  return(
<>
 <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>} />
      <Route path='/home' element={<Home/>}/>
</Routes>
</>
  )



}

export default App;
