import React, { useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom';
function Login() {
    const navigate=useNavigate();
    const [username, setUsername] = useState('');
    const [pass,setpass]=useState('');
    const handleInputChange = (e) => {
      setUsername(e.target.value);
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      if(username=="abc@gmail.com"&&pass=="123456"){
        localStorage.setItem("user","123456");
        navigate('/home');
      }
    };
  
    return (
    <div className='Login-container'>
    <div className="twitter-container">
        <h1 style={{color:"aliceblue"}}>Query Me</h1>
        <button className="twitter-button">
            <img
                src="https://img.icons8.com/color/48/undefined/google-logo.png"
                alt="google logo"
                className="img"
            />
            <p>Sign in with Google</p>
        </button>
        <button className="twitter-button">
            <img
                src="https://img.icons8.com/ios-filled/50/undefined/mac-os.png"
                alt="apple logo"
                className="img"
            />
            <p>Sign in with Apple</p>
        </button>
        <p style={{color:"aliceblue"}}>or</p>
        <form className="twitter-form" onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Email"
                size="22"
                value={username}
                onChange={handleInputChange}
                className="twitter-input"
            />
             <input
                type="text"
                placeholder="Password"
                size="22"
                value={pass}
                onChange={(e)=>setpass(e.target.value)}
                className="twitter-input"
            />
            <input id="next" type="submit" value="Sign in" />
            <input id="forgot" type="submit" value="Forgot Password?" />
        </form>
        <p id="signup">
            Don't have an account ? <a onClick={() => navigate(`/signup`)}>Sign up</a>
        </p>
    </div>
    </div>
    );
  
}

export default Login
