import logo from './logo.svg';
import './App.css';
import Login from './pages/Login/Login';
import { Route, Routes, useLocation, Navigate, redirect } from 'react-router-dom';
import Question from './pages/Question/Question';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import Signup from './pages/Signup/Signup';
function App() {
  const location = useLocation();
  const token=localStorage.getItem("user");
  return (
    <div className="App">
    <Routes location={location} key={location.pathname}>
          {token?<Route path="/home" element={<Home />} />:  <Route path="/home" element={<Navigate to="/signin" />} />}
          {token?  <Route path="/profile" element={<Profile/>} />:  <Route path="/profile" element={<Navigate to="/signin" />} />}
        
          <Route path="/signin" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
          {token?    <Route path="/question/:id" element={<Question/>} />:  <Route path="/question/:id" element={<Navigate to="/signin" />} />}
       
          <Route path="/" element={<Navigate to="/signin" />} />
        </Routes>
    </div>
  );
}

export default App;
