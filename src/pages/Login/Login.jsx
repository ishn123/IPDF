import React, { useState } from 'react'
import './style.css'
function Login() {
    const [Type, setType] = useState("password");
    const [pass,setPass] = useState("");
    const [email, setemail] = useState("");
  return (
    <div className='Login'>
    <div className='Signin'>
        <h1>Sign-In</h1>
        <div className='form-container'>
            <input type="text" placeholder="Email"/>
            <input type="password" placeholder="password"/>
            <div>
            <button>Submit</button>
            <div>New User? Create Account</div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Login
