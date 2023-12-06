import logo from './logo.svg';
import './App.css';
import Login from './pages/Login/Login';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Question from './pages/Question/Question';
import Home from './pages/Home/Home';
function App() {
  const location = useLocation();
  return (
    <div className="App">
    <Routes location={location} key={location.pathname}>
          <Route path="/home" element={<Home />} />
          <Route path="/question/:id" element={<Question/>} />
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
    </div>
  );
}

export default App;
